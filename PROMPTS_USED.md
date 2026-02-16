# Prompts Used for Development

This document contains key prompts used during development. The most important one is the system prompt sent to the LLM for generating research briefs.

---

## System Prompt for Gemini (Research Brief Generation)

This is the actual prompt used in the application (`lib/llm.ts`):

```
You are a research analyst tasked with creating a structured research brief from multiple sources.

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
}
```

**Why this prompt works:**
- Clear structure requirements prevent hallucination
- Source citation rules ensure traceability
- JSON-only output makes parsing reliable
- Verification checklist adds critical thinking

---

## Sample Development Prompts

### Initial Project Setup
```
Create a Next.js 14 TypeScript app that generates research briefs from multiple URLs.
Use App Router, Tailwind CSS, and SQLite for storage.
```

### Content Extraction
```
Write a function to fetch and extract readable content from URLs using Mozilla Readability.
Include browser-like headers to avoid being blocked by websites.
```

### LLM Integration
```
Integrate Google Gemini API to analyze extracted content and generate a research brief.
Handle JSON parsing errors and API failures gracefully.
```

### UI Components
```
Create a clean, modern home page with:
- URL input textarea (1-10 URLs)
- Validation and error handling
- Loading states
- Tailwind CSS styling
```

---

## Notes

- Prompts were iterative - refined based on testing
- System prompt went through 5+ iterations to get reliable JSON output
- Most code was AI-generated but manually reviewed and modified
- Error handling and edge cases were added through testing
