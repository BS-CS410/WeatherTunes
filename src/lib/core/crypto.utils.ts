/**
 * Cryptographic utilities for secure operations
 */

/**
 * Generate a random string for OAuth state parameter
 */
/**
 * Generate a cryptographically secure random string.
 * @param length The desired length of the string.
 * @returns A cryptographically secure random string.
 */
export function generateSecureRandomString(length: number): string;

/**
 * Generate a cryptographically secure random string.
 * @param length The desired length of the string.
 * @returns A cryptographically secure random string.
 */
export function generateSecureRandomString(length: number): string {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const result = new Uint8Array(length);
  window.crypto.getRandomValues(result);
  return Array.from(result)
    .map((byte) => charset[byte % charset.length])
    .join("");
}

/**
 * Generate code verifier for PKCE
 */
export function generateCodeVerifier(): string {
  return generateSecureRandomString(128);
}

/**
 * Generate code challenge from verifier
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
