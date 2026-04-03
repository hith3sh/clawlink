import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

interface Env {
  DB: D1Database;
}

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const env = process.env as unknown as Env;
    const db = env.DB;

    if (!db) {
      // Fallback for local development
      return NextResponse.json({ integrations: [] });
    }

    // Try to find existing user
    let existingUser;
    try {
      const userResult = await db.prepare(
        "SELECT id FROM users WHERE clerk_id = ?"
      ).bind(userId).first();
      existingUser = userResult;
    } catch (e) {
      // Table might not exist yet
      return NextResponse.json({ integrations: [] });
    }

    if (!existingUser) {
      // No integrations if user doesn't exist yet
      return NextResponse.json({ integrations: [] });
    }

    // Fetch user's connected integrations
    const integrations = await db.prepare(
      `SELECT integration, expires_at, created_at 
       FROM user_integrations 
       WHERE user_id = ?`
    ).bind(existingUser.id).all();

    return NextResponse.json({ 
      integrations: integrations.results || [] 
    });
  } catch (error) {
    console.error("Error fetching integrations:", error);
    return NextResponse.json({ 
      error: "Failed to fetch integrations",
      integrations: [] 
    }, { status: 500 });
  }
}