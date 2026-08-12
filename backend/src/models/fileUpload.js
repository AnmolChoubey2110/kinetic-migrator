export async function createFileUpload(
  db,
  { userId, batchId, fileType, originalFilename, storagePath, parsedData },
) {
  const result = await db.query(
    `INSERT INTO file_uploads (
       user_id, batch_id, file_type, original_filename, storage_path, parsed_data
     )
     VALUES ($1, $2, $3, $4, $5, $6::jsonb)
     RETURNING id, user_id, batch_id, file_type, original_filename, storage_path,
               uploaded_at`,
    [
      userId,
      batchId,
      fileType,
      originalFilename,
      storagePath,
      JSON.stringify(parsedData),
    ],
  );
  return result.rows[0];
}

export async function findUploadByBatchAndType(db, { batchId, fileType }) {
  const result = await db.query(
    `SELECT id, user_id, batch_id, file_type, original_filename, storage_path, uploaded_at
     FROM file_uploads
     WHERE batch_id = $1 AND file_type = $2
     LIMIT 1`,
    [batchId, fileType],
  );
  return result.rows[0] ?? null;
}

export async function findUploadWithParsedData(db, { batchId, fileType }) {
  const result = await db.query(
    `SELECT id, user_id, batch_id, file_type, original_filename, storage_path,
            parsed_data, uploaded_at
     FROM file_uploads
     WHERE batch_id = $1 AND file_type = $2
     LIMIT 1`,
    [batchId, fileType],
  );
  return result.rows[0] ?? null;
}
