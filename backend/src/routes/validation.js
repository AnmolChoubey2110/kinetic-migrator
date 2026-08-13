import { Router } from "express";
import multer from "multer";
import { mapDetectorToRulesBusinessObject } from "../constants/businessObjectMap.js";
import { BUSINESS_OBJECTS, isBusinessObject } from "../constants/businessObjects.js";
import {
  isAllowedUploadFilename,
  parseUploadedBuffer,
} from "../lib/uploadParse.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  createCleanupSession,
  findCleanupSessionForUser,
  toPublicCleanupSession,
  updateCleanupSession,
} from "../models/validationCleanupSession.js";
import { findLatestValidationRulesByBusinessObject } from "../models/validationRules.js";
import { detectBusinessObject } from "../services/businessObjectDetector.js";
import { evaluateValidationRules } from "../services/rulesEvaluationService.js";
import { buildPlainLanguageValidationReport } from "../services/plainLanguageReport.js";
import {
  applyProposalToRows,
  buildFixProposal,
  matchFindingFromMessage,
} from "../services/ruleFixService.js";
import { SUPPORTED_BUSINESS_OBJECTS } from "../services/sapMetadataService.js";

const router = Router();
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const maxBytes = Number(process.env.UPLOAD_MAX_BYTES) || 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxBytes },
  fileFilter(_req, file, cb) {
    if (!isAllowedUploadFilename(file.originalname)) {
      const error = new Error("Only .csv and .xlsx files are allowed");
      error.status = 400;
      return cb(error);
    }
    return cb(null, true);
  },
});

function collectColumns(rows) {
  const columns = new Set();
  for (const row of rows) {
    for (const key of Object.keys(row || {})) {
      columns.add(key);
    }
  }
  return [...columns];
}

function csvEscape(value) {
  if (value == null) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowsToCsv(rows) {
  const data = Array.isArray(rows) ? rows : [];
  const columns = collectColumns(data);
  const lines = [columns.map(csvEscape).join(",")];
  for (const row of data) {
    lines.push(columns.map((col) => csvEscape(row?.[col])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

function appendChat(messages, entry) {
  const list = Array.isArray(messages) ? [...messages] : [];
  list.push({
    id: `${Date.now()}-${list.length}`,
    at: new Date().toISOString(),
    ...entry,
  });
  return list.slice(-40);
}

function rebuildEvaluation(rows, rulesSnapshot, businessObject, filename) {
  const evaluation = evaluateValidationRules(rows, rulesSnapshot);
  const report = buildPlainLanguageValidationReport(evaluation.findings, {
    businessObject,
    filename,
    totalRows: rows.length,
  });
  return { evaluation, report };
}

function wantsFix(message) {
  const text = String(message || "").toLowerCase();
  return (
    text.includes("fix") ||
    text.includes("correct") ||
    text.includes("repair") ||
    text.includes("clean") ||
    text.includes("resolve") ||
    text.includes("apply")
  );
}

async function loadOwnedSession(req, res) {
  const sessionId = String(req.params.sessionId || "").trim();
  if (!UUID_RE.test(sessionId)) {
    res.status(400).json({ error: "Invalid session id" });
    return null;
  }
  const session = await findCleanupSessionForUser({
    sessionId,
    userId: req.user.id,
  });
  if (!session) {
    res.status(404).json({ error: "Cleanup session not found" });
    return null;
  }
  return session;
}

/**
 * Upload preload → detect BO → fetch rules → evaluate → persist session.
 */
router.post(
  "/execute-cleanup",
  requireAuth,
  requireRole("normal_user", "admin"),
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file?.buffer) {
        return res.status(400).json({ error: "A file is required (field name: file)" });
      }

      let rows;
      try {
        rows = parseUploadedBuffer(req.file.buffer, req.file.originalname);
      } catch (parseErr) {
        parseErr.status = parseErr.status || 400;
        return next(parseErr);
      }

      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ error: "File contains no data rows" });
      }

      const columns = collectColumns(rows);
      const sampleRows = rows.slice(0, 5);

      const manualBo = String(
        req.body?.businessObject || req.body?.business_object || "",
      ).trim();

      let detection = null;
      let detectorLabel = null;
      let rulesBusinessObject = null;

      if (manualBo) {
        if (isBusinessObject(manualBo)) {
          rulesBusinessObject = manualBo;
          detectorLabel = manualBo;
        } else {
          const mapped = mapDetectorToRulesBusinessObject(manualBo);
          if (!mapped) {
            return res.status(400).json({
              error: `Unsupported businessObject. Use one of: ${BUSINESS_OBJECTS.join(", ")} or ${SUPPORTED_BUSINESS_OBJECTS.join(", ")}`,
            });
          }
          rulesBusinessObject = mapped;
          detectorLabel = manualBo.toUpperCase().replace(/\s+/g, "_");
        }
        detection = {
          source: "manual",
          businessObject: detectorLabel,
          confidence: "high",
          reasoning: "Manually selected by user",
        };
      } else {
        detection = await detectBusinessObject({ columns, sampleRows });
        if (!detection.ok) {
          return res.status(422).json({
            needs_business_object: true,
            error:
              detection.message ||
              detection.error?.message ||
              "Could not auto-detect business object",
            detection: {
              businessObject: detection.businessObject ?? null,
              confidence: detection.confidence ?? null,
              reasoning: detection.reasoning ?? null,
              error: detection.error ?? null,
            },
            candidates: detection.candidates || [...SUPPORTED_BUSINESS_OBJECTS],
          });
        }

        detectorLabel = detection.businessObject;
        rulesBusinessObject = mapDetectorToRulesBusinessObject(detectorLabel);

        if (!rulesBusinessObject) {
          return res.status(422).json({
            error: `Detected ${detectorLabel}, but no validation_rules mapping exists for it (supported: MM, PO, GL Account, BP)`,
            detection: {
              source: "auto",
              businessObject: detectorLabel,
              confidence: detection.confidence,
              reasoning: detection.reasoning,
            },
          });
        }

        detection = {
          source: "auto",
          businessObject: detectorLabel,
          confidence: detection.confidence,
          reasoning: detection.reasoning,
          modelId: detection.modelId,
        };
      }

      const ruleSet = await findLatestValidationRulesByBusinessObject(
        rulesBusinessObject,
      );

      if (!ruleSet) {
        return res.status(404).json({
          error: `No saved validation rules found for business object '${rulesBusinessObject}'. Save rules from Admin first.`,
          detection,
          rulesBusinessObject,
        });
      }

      const { evaluation, report } = rebuildEvaluation(
        rows,
        ruleSet.rules,
        rulesBusinessObject,
        req.file.originalname,
      );

      const welcome = {
        role: "assistant",
        content: `I analyzed ${req.file.originalname} as ${detection.businessObject} (ruleset ${rulesBusinessObject}). Found ${evaluation.findings.length} rule issue(s). Ask me about a finding, or say e.g. "fix the material length issue" — I'll show a preview before applying anything.`,
      };

      const session = await createCleanupSession({
        userId: req.user.id,
        filename: req.file.originalname,
        businessObject: rulesBusinessObject,
        detectorLabel,
        detection,
        ruleSetId: ruleSet.id,
        rulesSnapshot: ruleSet.rules,
        originalData: rows,
        currentData: rows,
        findings: evaluation.findings,
        report,
        summary: evaluation.summary,
        chatMessages: [welcome],
      });

      return res.status(200).json({
        sessionId: session.id,
        filename: req.file.originalname,
        rowCount: rows.length,
        columns,
        detection,
        rulesBusinessObject,
        ruleSet: {
          id: ruleSet.id,
          business_object: ruleSet.business_object,
          created_at: ruleSet.created_at,
        },
        summary: evaluation.summary,
        findings: evaluation.findings,
        report,
        session: toPublicCleanupSession(session),
      });
    } catch (err) {
      return next(err);
    }
  },
);

router.get(
  "/sessions/:sessionId",
  requireAuth,
  requireRole("normal_user", "admin"),
  async (req, res, next) => {
    try {
      const session = await loadOwnedSession(req, res);
      if (!session) return undefined;
      return res.json({ session: toPublicCleanupSession(session) });
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * Chat scoped to session. Fix requests return a pending proposal (preview only).
 */
router.post(
  "/sessions/:sessionId/chat",
  requireAuth,
  requireRole("normal_user", "admin"),
  async (req, res, next) => {
    try {
      const session = await loadOwnedSession(req, res);
      if (!session) return undefined;

      const message = String(req.body?.message || "").trim();
      if (!message) {
        return res.status(400).json({ error: "message is required" });
      }

      let chatMessages = appendChat(session.chat_messages, {
        role: "user",
        content: message,
      });

      const findings = Array.isArray(session.findings) ? session.findings : [];
      const matched = matchFindingFromMessage(message, findings);
      const fixIntent = wantsFix(message);

      if (fixIntent) {
        if (!matched) {
          const reply =
            findings.length === 0
              ? "There are no open findings to fix right now."
              : `I couldn't tell which finding you mean. Try naming the field (e.g. ${findings
                  .slice(0, 3)
                  .map((f) => f.fieldName)
                  .join(", ")}).`;
          chatMessages = appendChat(chatMessages, {
            role: "assistant",
            content: reply,
          });
          const updated = await updateCleanupSession(session.id, {
            chatMessages,
            pendingProposal: null,
          });
          return res.json({
            session: toPublicCleanupSession(updated),
            reply,
            pendingProposal: null,
          });
        }

        const built = buildFixProposal(matched, session.current_data);
        if (!built.ok) {
          const reply = `I matched ${matched.fieldName} / ${matched.ruleName}, but ${built.error}`;
          chatMessages = appendChat(chatMessages, {
            role: "assistant",
            content: reply,
          });
          const updated = await updateCleanupSession(session.id, {
            chatMessages,
            pendingProposal: null,
          });
          return res.json({
            session: toPublicCleanupSession(updated),
            reply,
            pendingProposal: null,
          });
        }

        const reply = `${built.proposal.explanation}\n\nPreview: ${built.proposal.affectedCount} row(s) would change. Confirm to apply, or reject to discard. No changes are saved until you confirm.`;
        chatMessages = appendChat(chatMessages, {
          role: "assistant",
          content: reply,
          proposalId: built.proposal.id,
        });

        const updated = await updateCleanupSession(session.id, {
          chatMessages,
          pendingProposal: built.proposal,
        });

        return res.json({
          session: toPublicCleanupSession(updated),
          reply,
          pendingProposal: built.proposal,
        });
      }

      // Explain / Q&A about findings (no mutation)
      let reply;
      if (matched) {
        reply = `For ${matched.fieldName} — ${matched.ruleName}: ${matched.issue}. Affected ${matched.affectedCount} row(s)${
          matched.affectedRows?.length
            ? ` (e.g. ${matched.affectedRows.slice(0, 5).join(", ")})`
            : ""
        }. Rule: ${matched.rule?.constraint || matched.rule?.description || "see stored validation rule"}. Say "fix the ${matched.fieldName} issue" to preview a correction.`;
      } else if (findings.length === 0) {
        reply =
          "The current corrected file has no open validation findings. You can download the corrected CSV anytime.";
      } else {
        reply = `This session is for ${session.filename} (${session.business_object}). Open findings: ${findings
          .map((f) => `${f.fieldName} (${f.ruleName})`)
          .join("; ")}. Ask about one, or request a fix.`;
      }

      chatMessages = appendChat(chatMessages, {
        role: "assistant",
        content: reply,
      });
      const updated = await updateCleanupSession(session.id, { chatMessages });
      return res.json({
        session: toPublicCleanupSession(updated),
        reply,
        pendingProposal: session.pending_proposal,
      });
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * Confirm pending proposal → apply → re-evaluate → persist to DB.
 */
router.post(
  "/sessions/:sessionId/confirm-fix",
  requireAuth,
  requireRole("normal_user", "admin"),
  async (req, res, next) => {
    try {
      const session = await loadOwnedSession(req, res);
      if (!session) return undefined;

      const proposal = session.pending_proposal;
      if (!proposal?.id) {
        return res.status(409).json({ error: "No pending fix to confirm" });
      }

      const proposalId = String(req.body?.proposalId || "").trim();
      if (proposalId && proposalId !== proposal.id) {
        return res.status(409).json({ error: "Pending proposal mismatch" });
      }

      const nextRows = applyProposalToRows(session.current_data, proposal);
      const { evaluation, report } = rebuildEvaluation(
        nextRows,
        session.rules_snapshot,
        session.business_object,
        session.filename,
      );

      let chatMessages = appendChat(session.chat_messages, {
        role: "assistant",
        content: `Applied fix for ${proposal.fieldName} / ${proposal.ruleName} to ${proposal.affectedCount} row(s). Report refreshed. Download the corrected file when ready.`,
      });

      const updated = await updateCleanupSession(session.id, {
        currentData: nextRows,
        findings: evaluation.findings,
        report,
        summary: evaluation.summary,
        pendingProposal: null,
        chatMessages,
      });

      return res.json({
        session: toPublicCleanupSession(updated),
        findings: evaluation.findings,
        report,
        summary: evaluation.summary,
        appliedProposal: proposal,
      });
    } catch (err) {
      return next(err);
    }
  },
);

router.post(
  "/sessions/:sessionId/reject-fix",
  requireAuth,
  requireRole("normal_user", "admin"),
  async (req, res, next) => {
    try {
      const session = await loadOwnedSession(req, res);
      if (!session) return undefined;

      const chatMessages = appendChat(session.chat_messages, {
        role: "assistant",
        content: "Discarded the proposed fix. No data was changed.",
      });

      const updated = await updateCleanupSession(session.id, {
        pendingProposal: null,
        chatMessages,
      });

      return res.json({ session: toPublicCleanupSession(updated) });
    } catch (err) {
      return next(err);
    }
  },
);

router.get(
  "/sessions/:sessionId/download",
  requireAuth,
  requireRole("normal_user", "admin"),
  async (req, res, next) => {
    try {
      const session = await loadOwnedSession(req, res);
      if (!session) return undefined;

      const csv = rowsToCsv(session.current_data);
      const base = String(session.filename || "corrected")
        .replace(/\.[^.]+$/, "")
        .replace(/[^\w.-]+/g, "_");
      const filename = `${base}-corrected.csv`;

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      return res.status(200).send(csv);
    } catch (err) {
      return next(err);
    }
  },
);

export default router;
