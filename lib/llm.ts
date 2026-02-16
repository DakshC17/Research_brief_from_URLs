import { ResearchBrief } from '@/types/report';
import { ExtractedContent } from './fetchReadable';
import { createLogger } from './logger';

const logger = createLogger('lib:llm');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are a research analyst tasked with creating a structured research brief from multiple sources.

CRITICAL RULES:
1. Only use information from the provided sources
2. Do not add external knowledge or assumptions
3. Be factual and objective
4. Cite sources using the provided IDs
5. Return ONLY valid JSON, no additional text or markdown formatting

Your output MUST be a valid JSON object with this exact structure:
{
  "summary": "A concise paragraph summarizing the main findings",
  "key_points": [
    {
      "point": "An important claim or finding",
      "sources": [1, 2],
      "snippet": "Direct quote or paraphrase supporting this point"
    }
  ],
  "conflicting_claims": [
    {
      "claim": "Description of the disagreement",
      "sources": [2, 4]
    }
  ],
  "verification_checklist": [
    "Things readers should verify independently"
  ],
  "sources_used": [
    {
      "id": 1,
      "url": "original URL",
      "what_used": "What information was extracted from this source"
    }
  ]
}`;

export async function generateResearchBrief(
    extractedContents: ExtractedContent[]
): Promise<ResearchBrief> {
    const startTime = Date.now();

    if (!API_KEY) {
        logger.error({}, 'GEMINI_API_KEY not configured');
        throw new Error('GEMINI_API_KEY is not configured');
    }

    logger.info({ model: MODEL, sourceCount: extractedContents.length }, 'Starting LLM generation');

    // Filter successful extractions
    const validContents = extractedContents.filter(c => c.success);

    if (validContents.length === 0) {
        throw new Error('No valid content extracted from any URL');
    }

    // Build user prompt with sources
    const sourcesText = validContents
        .map((content, index) => {
            return `[Source ${index + 1}]
URL: ${content.url}
Title: ${content.title}
Content: ${content.content}
---`;
        })
        .join('\n\n');

    const userPrompt = `Analyze the following sources and create a research brief:

${sourcesText}

Generate a comprehensive research brief following the JSON structure specified in the system prompt.`;

    // Call Gemini API
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: SYSTEM_PROMPT + '\n\n' + userPrompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.3,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 8192,
                    responseMimeType: 'application/json', // Force JSON response
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_NONE'
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_NONE'
                    },
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_NONE'
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_NONE'
                    }
                ]
            }),
        }
    );

    if (!response.ok) {
        const duration = Date.now() - startTime;
        const errorText = await response.text();
        logger.error({ status: response.status, error: errorText, duration }, 'Gemini API error');
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
        const duration = Date.now() - startTime;
        logger.error({ duration }, 'No content returned from Gemini');
        throw new Error('No content returned from Gemini');
    }

    logger.debug({ contentLength: content.length }, 'Received LLM response');

    // Parse and validate JSON
    try {
        // Remove markdown code blocks if present
        let jsonText = content.trim();

        // Handle various markdown formats
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json\s*\n?/, '').replace(/\n?```\s*$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
        }

        // Remove any leading/trailing whitespace
        jsonText = jsonText.trim();

        // Log first 200 chars for debugging
        logger.debug({ preview: jsonText.substring(0, 200) }, 'Attempting to parse JSON');

        const brief: ResearchBrief = JSON.parse(jsonText);
        const duration = Date.now() - startTime;
        logger.info({ duration, keyPointsCount: brief.key_points?.length || 0 }, 'Research brief generated successfully');
        return brief;
    } catch (error) {
        const duration = Date.now() - startTime;
        // Log more details for debugging
        logger.error({
            error: error instanceof Error ? error.message : 'Unknown error',
            contentPreview: content.substring(0, 500),
            duration
        }, 'Failed to parse Gemini response');
        throw new Error(`Failed to parse Gemini response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function checkLLMConnection(): Promise<boolean> {
    if (!API_KEY) {
        return false;
    }

    // For Gemini API, just verify the key exists
    return API_KEY.length > 0;
}
