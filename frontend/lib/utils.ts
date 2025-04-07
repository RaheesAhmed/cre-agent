import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and twMerge for Tailwind optimization
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date for display in chat messages
 */
export function formatMessageDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

/**
 * Helper function to ensure the API URL is correctly set based on environment
 */
export function getApiUrl(): string {
  // If NEXT_PUBLIC_API_URL is explicitly set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In the browser, use the current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // In development on the server side, use localhost
  return "http://localhost:3000";
}

/**
 * Formats a market analysis response with proper styling
 * This can be expanded for different response types
 */
export function formatPropertyAnalysisResponse(text: string): string {
  // In a real implementation, this would parse and format structured data
  // For now, we just return the text as is
  return text;
}

/**
 * Formats a file size in bytes to a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Returns the appropriate icon name based on file extension
 */
export function getFileIcon(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // Map file extensions to icon names
  const iconMap: Record<string, string> = {
    // Documents
    'pdf': 'file-text',
    'doc': 'file-text',
    'docx': 'file-text',
    'txt': 'file-text',
    'rtf': 'file-text',
    
    // Archives
    'zip': 'file-archive',
    'rar': 'file-archive',
    'tar': 'file-archive',
    'gz': 'file-archive',
    
    // Images
    'jpg': 'file-image',
    'jpeg': 'file-image',
    'png': 'file-image',
    'gif': 'file-image',
    'webp': 'file-image',
    'svg': 'file-image',
    
    // Data
    'json': 'file-spreadsheet',
    'csv': 'file-spreadsheet',
    'xls': 'file-spreadsheet',
    'xlsx': 'file-spreadsheet',
    
    // Code
    'js': 'file-code',
    'ts': 'file-code',
    'html': 'file-code',
    'css': 'file-code',
    'py': 'file-code',
    'java': 'file-code',
    'cpp': 'file-code',
    'c': 'file-code',
  };
  
  return iconMap[extension] || 'file-text';
}
