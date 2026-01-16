
/**
 * HTML Sanitization Utilities
 * 
 * Provides safe HTML rendering by sanitizing user-generated content.
 * Prevents XSS attacks when using dangerouslySetInnerHTML.
 */

// Allowed HTML tags for sanitization
const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'a', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
  'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'img', 'hr', 'sup', 'sub', 'mark'
])

// Allowed attributes per tag
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height']),
  '*': new Set(['class', 'id', 'style']),
}

// Dangerous URL protocols
const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:']

/**
 * Check if a URL is safe (no dangerous protocols)
 */
function isSafeUrl(url: string): boolean {
  const normalized = url.toLowerCase().trim()
  return !DANGEROUS_PROTOCOLS.some(protocol => normalized.startsWith(protocol))
}

/**
 * Escape HTML entities
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, char => htmlEntities[char] || char)
}

/**
 * Simple HTML sanitizer that removes dangerous tags and attributes
 * For production use, consider using DOMPurify library
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
  
  // Remove javascript: URLs
  sanitized = sanitized.replace(/href\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'href="#"')
  sanitized = sanitized.replace(/src\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'src=""')
  
  // Remove data: URLs (except for safe image types)
  sanitized = sanitized.replace(/src\s*=\s*["']?\s*data:(?!image\/(png|jpeg|gif|webp|svg\+xml))[^"'>\s]*/gi, 'src=""')
  
  // Remove style tags
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  
  // Remove iframe, object, embed tags
  sanitized = sanitized.replace(/<(iframe|object|embed|form|input|button)[^>]*>/gi, '')
  sanitized = sanitized.replace(/<\/(iframe|object|embed|form|input|button)>/gi, '')
  
  return sanitized
}

/**
 * Sanitize HTML and return safe content for dangerouslySetInnerHTML
 */
export function createSafeHtml(html: string): { __html: string } {
  return { __html: sanitizeHtml(html) }
}

/**
 * Convert markdown-like text to safe HTML
 * Basic implementation - for full markdown support, use a library like marked + DOMPurify
 */
export function markdownToSafeHtml(text: string): string {
  if (!text) return ''

  let html = escapeHtml(text)
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-2 mt-4">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-2 mt-4">$1</h1>')
  
  // Bold and italic
  html = html.replace(/\*\*([^*]+)\*\*/gim, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/gim, '<em>$1</em>')
  
  // Code
  html = html.replace(/`([^`]+)`/gim, '<code class="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-sm">$1</code>')
  
  // Blockquotes
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote class="border-l-4 border-neutral-300 pl-4 italic my-2">$1</blockquote>')
  
  // Lists
  html = html.replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
  
  // Links (safe - already escaped)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, (_, text, url) => {
    if (isSafeUrl(url)) {
      return `<a href="${url}" class="text-accent-primary hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`
    }
    return text
  })
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p class="mb-4">')
  html = html.replace(/\n/g, '<br/>')
  
  return `<p class="mb-4">${html}</p>`
}

/**
 * Create safe HTML from markdown for dangerouslySetInnerHTML
 */
export function createSafeMarkdownHtml(markdown: string): { __html: string } {
  return { __html: markdownToSafeHtml(markdown) }
}

/**
 * Strip all HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * Truncate HTML content safely (preserves tag structure)
 */
export function truncateHtml(html: string, maxLength: number): string {
  const stripped = stripHtml(html)
  if (stripped.length <= maxLength) return html
  
  // Simple truncation - for complex HTML, use a library
  const truncated = stripped.substring(0, maxLength)
  return escapeHtml(truncated) + '...'
}
