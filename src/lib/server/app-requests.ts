import "server-only";

import { getDatabase } from "@/lib/server/integration-store";

export interface AppRequestRow {
  id: number;
  user_id: string;
  email: string;
  toolkit_name: string;
  use_case: string;
  votes: number;
  created_at: string;
}

export interface AppRequestWithUserVote extends AppRequestRow {
  userVoted: boolean;
}

export async function listAppRequests(
  currentUserId: string,
): Promise<AppRequestWithUserVote[]> {
  const db = getDatabase();
  if (!db) {
    throw new Error("DB binding missing");
  }

  const stmt = db.prepare(`
    SELECT
      ar.*,
      EXISTS(
        SELECT 1 FROM app_request_votes arv
        WHERE arv.request_id = ar.id AND arv.user_id = ?
      ) as user_voted
    FROM app_requests ar
    ORDER BY ar.votes DESC, ar.created_at DESC
  `);

  const result = await stmt.bind(currentUserId).all<Record<string, unknown>>();

  return (result.results ?? []).map((row) => ({
    id: row.id as number,
    user_id: row.user_id as string,
    email: row.email as string,
    toolkit_name: row.toolkit_name as string,
    use_case: row.use_case as string,
    votes: row.votes as number,
    created_at: row.created_at as string,
    userVoted: (row.user_voted as number) === 1,
  }));
}

export async function createAppRequest({
  userId,
  email,
  toolkitName,
  useCase,
}: {
  userId: string;
  email: string;
  toolkitName: string;
  useCase: string;
}): Promise<AppRequestRow> {
  const db = getDatabase();
  if (!db) {
    throw new Error("DB binding missing");
  }

  const stmt = db.prepare(`
    INSERT INTO app_requests (user_id, email, toolkit_name, use_case)
    VALUES (?, ?, ?, ?)
    RETURNING *
  `);

  const row = await stmt.bind(userId, email, toolkitName, useCase).first<Record<string, unknown>>();

  if (!row) {
    throw new Error("Failed to create app request");
  }

  return {
    id: row.id as number,
    user_id: row.user_id as string,
    email: row.email as string,
    toolkit_name: row.toolkit_name as string,
    use_case: row.use_case as string,
    votes: row.votes as number,
    created_at: row.created_at as string,
  };
}

export async function toggleAppRequestUpvote({
  requestId,
  userId,
}: {
  requestId: number;
  userId: string;
}): Promise<{ votes: number; userVoted: boolean }> {
  const db = getDatabase();
  if (!db) {
    throw new Error("DB binding missing");
  }

  // Check if user already voted
  const voteCheck = await db
    .prepare(
      `SELECT id FROM app_request_votes WHERE request_id = ? AND user_id = ?`
    )
    .bind(requestId, userId)
    .first<{ id: number }>();

  if (voteCheck) {
    // Remove vote
    await db
      .prepare(`DELETE FROM app_request_votes WHERE request_id = ? AND user_id = ?`)
      .bind(requestId, userId)
      .run();

    await db
      .prepare(`UPDATE app_requests SET votes = votes - 1 WHERE id = ?`)
      .bind(requestId)
      .run();

    const updated = await db
      .prepare(`SELECT votes FROM app_requests WHERE id = ?`)
      .bind(requestId)
      .first<{ votes: number }>();

    return { votes: updated?.votes ?? 0, userVoted: false };
  }

  // Add vote
  await db
    .prepare(`INSERT INTO app_request_votes (request_id, user_id) VALUES (?, ?)`)
    .bind(requestId, userId)
    .run();

  await db
    .prepare(`UPDATE app_requests SET votes = votes + 1 WHERE id = ?`)
    .bind(requestId)
    .run();

  const updated = await db
    .prepare(`SELECT votes FROM app_requests WHERE id = ?`)
    .bind(requestId)
    .first<{ votes: number }>();

  return { votes: updated?.votes ?? 0, userVoted: true };
}
