import { ResearchBrief } from '@/types/report';
import { ExtractedContent } from './fetchReadable';

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
    if (!API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

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
                },
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
        throw new Error('No content returned from Gemini');
    }

    // Parse and validate JSON
    try {
        // Remove markdown code blocks if present
        let jsonText = content.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        const brief: ResearchBrief = JSON.parse(jsonText);
        return brief;
    } catch (error) {
        console.error('Failed to parse Gemini response:', content);
        throw new Error('Failed to parse Gemini response as JSON');
    }
}

export async function checkLLMConnection(): Promise<boolean> {
    if (!API_KEY) {
        return false;
    }

    // For Gemini API, just verify the key exists
    return API_KEY.length > 0;
}
