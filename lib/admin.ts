/**
 * Admin Access Control
 *
 * Simple admin authentication system.
 * For now, only lllencinas@gmail.com has admin access.
 */

const ADMIN_EMAIL = 'lllencinas@gmail.com';

/**
 * Check if an email has admin privileges
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

/**
 * Get admin email (for display purposes)
 */
export function getAdminEmail(): string {
  return ADMIN_EMAIL;
}

/**
 * Validate admin access token
 * For now, we'll use a simple approach: check if user exists with admin email
 */
export async function validateAdminAccess(email: string): Promise<boolean> {
  return isAdmin(email);
}
