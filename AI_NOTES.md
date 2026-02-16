# AI Usage Notes

## Development Tools Used

**Primary AI Assistant**: Google Antigravity (AI coding assistant)

I used Antigravity throughout the development process to help with code generation, problem-solving, and implementation. This document explains what the AI helped with and what I verified myself.

---

## LLM Provider for the Application

### Selected: Google Gemini 2.5 Flash

**Why Gemini?**
- Free tier with generous quota
- Fast response times (~10-15 seconds per brief)
- Excellent at structured JSON output
- Large context window for multiple articles
- Native JSON mode support


---

## What Antigravity Helped With

### Code Generation
- Initial Next.js project structure and TypeScript setup
- UI components (home page, result page, history page)
- API route implementations
- Database schema and operations
- Content extraction logic with Readability
- LLM integration with Gemini API

### Problem Solving
- Fixed Pino logging compatibility issues in Next.js
- Debugged TypeScript errors
- Improved content extraction with browser-like headers
- Handled JSON parsing edge cases from LLM responses

### Documentation
- README structure and content
- Code comments and type definitions
- This AI_NOTES.md file

---

## What I Verified and Tested Myself

### System Design ✅
- Chose Gemini over other LLM providers (cost/speed tradeoff)
- Decided on SQLite vs PostgreSQL (simplicity for deployment)
- URL limits (1-10 URLs for balance of flexibility and performance)
- Content length caps to prevent token overflow

### Prompt Engineering ✅
- Wrote and refined the system prompt for research brief generation
- Tested with 20+ different article combinations
- Iterated 5+ times to get reliable JSON output
- Added rules to prevent hallucination and ensure citations

### Testing ✅
- Manually tested with 30+ different URLs
- Verified edge cases (broken links, paywalls, long articles)
- Tested all user flows (home → generate → result → history)
- Checked status page accuracy
- Validated error handling

### Code Review ✅
- Reviewed all AI-generated code before using it
- Modified implementations to fit the architecture
- Added error handling and edge case coverage
- Fixed TypeScript errors manually
- Ensured type safety throughout

### Custom Solutions ✅
- Built custom structured logger when Pino didn't work in Next.js
- Adjusted UI/UX based on manual testing
- Refined validation logic for better user experience


## Learning Outcomes

- Practical experience with Next.js 14 App Router
- LLM API integration and prompt engineering
- Web scraping and anti-bot bypass techniques
- TypeScript best practices
- Effective AI-assisted development workflow
- Understanding when to trust AI vs. when to verify manually
