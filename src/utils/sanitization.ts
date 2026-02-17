/**
 * Utility to fix common UTF-8 encoding issues (Mojibake) 
 * and sanitize log messages.
 */

const MOJIBAKE_MAP: { [key: string]: string } = {
    '├¡': 'í',
    '├º': 'ç',
    '├ú': 'ã',
    '├║': 'ú',
    '├│': 'ó',
    '├®': 'é',
    '├ê': 'É',
    '├á': 'à',
    '├é': 'Â',
    '├ｪ': 'ê',
    '├┤': 'ô',
    '├ë': 'É',
    '├ô': 'Ó',
    '├ì': 'Í',
    '├Ç': 'À',
    '├â': 'Ã',
    'Â®': '®',
    'Â©': '©',
};

/**
 * Fixes common Mojibake sequences and cleans up formatting characters.
 */
export function sanitizeLogMessage(message: string): string {
    if (!message) return '';

    let sanitized = message;

    // 1. Fix Mojibake
    for (const [key, value] of Object.entries(MOJIBAKE_MAP)) {
        sanitized = sanitized.split(key).join(value);
    }

    // 2. Clear known problem characters like the placeholder question marks
    // If the message contains the actual replacement character (U+FFFD)
    sanitized = sanitized.split('\uFFFD').join('?');

    return sanitized;
}

/**
 * Formats multi-line log messages to be more readable in small containers.
 */
export function formatLogDetails(details: string): string {
    if (!details) return '';
    return details.trim().replace(/\n{3,}/g, '\n\n');
}
