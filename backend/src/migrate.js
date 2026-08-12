import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { createPgConfig } from "./dbConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const schemaPath = path.join(__dirname, "..", "sql", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  let client;

  try {
    const config = await createPgConfig();
    // Client needs a concrete password string for this connection
    if (typeof config.password === "function") {
      config.password = await config.password();
    }
    client = new pg.Client(config);
    await client.connect();
    await client.query(sql);
    console.log("Schema applied successfully.");
  } catch (err) {
    console.error("Failed to apply schema:", err.message);
    process.exitCode = 1;
  } finally {
    if (client) {
      await client.end().catch(() => {});
    }
  }
}

migrate();
