// Reads the role claim out of the stored JWT.
//
// This is a display hint, never a security boundary — the server checks the
// signature and enforces the role on every write, and this deliberately does
// not verify anything. It exists because the role is not on the user object,
// so the Admin page had no way to tell an admin from an ordinary signed-in
// account and rendered every panel either way. A non-admin then got a page
// that looked fully functional and failed on save.
export function roleFromToken(token: string | null): string | null {
  if (!token) return null;
  const payload = token.split('.')[1];
  if (!payload) return null;
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const claims = JSON.parse(json) as { role?: unknown };
    return typeof claims.role === 'string' ? claims.role : null;
  } catch {
    // A malformed or unreadable token is not an admin token.
    return null;
  }
}
