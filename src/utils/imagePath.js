/**
 * Utility function to sanitize image paths from the backend
 * Removes the server root path prefix to make paths accessible to the frontend
 */

/**
 * Removes the server root path from image paths
 * @param {string} path - The image path from the backend
 * @returns {string} - The sanitized path without server root
 */
export const sanitizeImagePath = (path) => {
  if (!path) return null;
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Remove the server root path prefix
  const serverRootPath = '/home/ubuntu/cohopers.backend';
  if (path.startsWith(serverRootPath)) {
    return path.replace(serverRootPath, '');
  }
  
  // Return as is if no server root prefix
  return path;
};

/**
 * Formats a document URL for the frontend
 * @param {string} path - The document path from the backend
 * @param {string} baseUrl - The base API URL (default: 'https://api.boldtribe.in')
 * @returns {string|null} - The formatted URL or null
 */
export const formatDocumentUrl = (path, baseUrl = 'https://api.boldtribe.in') => {
  if (!path) return null;
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Sanitize the path first
  const sanitizedPath = sanitizeImagePath(path);
  
  // Prepend base URL
  return `${baseUrl}${sanitizedPath}`;
};
