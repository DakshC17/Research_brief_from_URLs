export interface ValidationResult {
    valid: boolean;
    error?: string;
}

export function validateUrls(urls: string[]): ValidationResult {
    // Check if array is empty
    if (!urls || urls.length === 0) {
        return {
            valid: false,
            error: 'Please provide at least one URL',
        };
    }

    // Check maximum count (minimum is 1, already checked above)
    if (urls.length > 10) {
        return {
            valid: false,
            error: 'Please provide no more than 10 URLs',
        };
    }

    // Validate each URL
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i].trim();

        if (!url) {
            return {
                valid: false,
                error: `URL at line ${i + 1} is empty`,
            };
        }

        try {
            const parsed = new URL(url);

            // Only allow http and https
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                return {
                    valid: false,
                    error: `URL at line ${i + 1} must use http or https protocol`,
                };
            }
        } catch (error) {
            return {
                valid: false,
                error: `Invalid URL at line ${i + 1}: ${url}`,
            };
        }
    }

    return { valid: true };
}

export function parseUrlsFromText(text: string): string[] {
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}
