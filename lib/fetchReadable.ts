import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export interface ExtractedContent {
    url: string;
    title: string;
    content: string;
    excerpt: string;
    success: boolean;
    error?: string;
}

const MAX_CONTENT_LENGTH = 8000; // Limit content to avoid token overflow

export async function fetchReadableContent(url: string): Promise<ExtractedContent> {
    try {
        // Fetch the HTML with browser-like headers
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
            timeout: 15000, // 15 second timeout
        });

        if (!response.ok) {
            return {
                url,
                title: '',
                content: '',
                excerpt: '',
                success: false,
                error: `HTTP ${response.status}: ${response.statusText}`,
            };
        }

        const html = await response.text();

        // Parse with JSDOM
        const dom = new JSDOM(html, { url });
        const document = dom.window.document;

        // Extract readable content using Readability
        const reader = new Readability(document);
        const article = reader.parse();

        if (!article || !article.textContent) {
            return {
                url,
                title: '',
                content: '',
                excerpt: '',
                success: false,
                error: 'Could not extract readable content from this page',
            };
        }

        // Clean and limit content
        const cleanContent = article.textContent
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, MAX_CONTENT_LENGTH);

        return {
            url,
            title: article.title || 'Untitled',
            content: cleanContent,
            excerpt: article.excerpt || cleanContent.substring(0, 200),
            success: true,
        };
    } catch (error) {
        return {
            url,
            title: '',
            content: '',
            excerpt: '',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

export async function fetchMultipleUrls(urls: string[]): Promise<ExtractedContent[]> {
    const promises = urls.map(url => fetchReadableContent(url));
    return Promise.all(promises);
}
