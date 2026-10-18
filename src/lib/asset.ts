/**
 * Prefix a path from /public with the deploy base ("/showcase/" in production on GitHub Pages). Always use this for images, videos and PDFs so URLs never break
 * on GitHub Pages.
 */
export const asset = (path: string): string => import.meta.env.BASE_URL + path.replace(/^\/+/, '');
