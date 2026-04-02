/**
 * Clerk JWT verification for worker authentication
 * Note: env variables are passed via env parameter in the handler
 */

/**
 * Verify the Clerk JWT and extract user ID
 */
export async function verifyAuth(authHeader: string | null, env?: { CLERK_PUBLISHABLE_KEY?: string; CLERK_JWT_KEY?: string }): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);

  try {
    // In production, verify JWT with Clerk's public key
    // For now, we'll decode the JWT to get the user ID (demo mode)
    const payload = decodeJWT(token);
    
    if (payload && payload.sub) {
      return payload.sub;
    }
    
    return null;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}

/**
 * Decode JWT (simple implementation - in production use proper verification)
 */
function decodeJWT(token: string): { sub?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

/**
 * Middleware to require authentication (sync version for compatibility)
 */
export function requireAuth(authHeader: string | null): string {
  // For sync use, we'll just return a placeholder - use verifyAuth async in real code
  throw new Error("Use verifyAuth (async) instead");
}