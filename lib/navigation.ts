/**
 * Navigation utility for handling redirects
 * Using a wrapper function allows for easy mocking in tests
 */

/**
 * Performs a hard navigation (full page reload) to the specified URL.
 * This ensures cookies and server-side state are properly picked up.
 */
export function hardNavigate(url: string): void {
  window.location.href = url;
}
