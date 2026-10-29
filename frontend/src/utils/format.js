/**
 * Formats an Ethereum wallet address for display
 * @param {string} address - Full address string
 * @returns {string} Truncated address e.g. 0x1234...5678
 */
export function formatAddress(address) {
  if (!address) return '';
  if (address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Formats a 32-byte hex proof hash for display
 * @param {string} hash - 0x prefixed hex string
 * @returns {string} Truncated hash e.g. 0xa1b2...c3d4
 */
export function formatHash(hash) {
  if (!hash) return '';
  if (hash.length < 14) return hash;
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
}

/**
 * Formats UNIX timestamp or ISO string into human readable local date & time
 * @param {number|string} timestamp - Seconds or milliseconds timestamp
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  
  // If timestamp is in seconds (10 digits), convert to ms
  let ms = Number(timestamp);
  if (isNaN(ms)) {
    ms = new Date(timestamp).getTime();
  } else if (ms < 10000000000) {
    ms = ms * 1000;
  }
  
  return new Date(ms).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

/**
 * Copies text to clipboard and returns success boolean
 * @param {string} text 
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}
