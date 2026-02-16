# Research Brief from Links

A web application that generates structured research briefs from multiple URLs. Paste 1-10 article links, and the app will fetch content, analyze it using AI, and create a comprehensive research brief with summaries, key points, conflicting claims, and citations.

## Features

**Multi-Source Analysis** - Process 1-10 URLs simultaneously  
**Content Extraction** - Automatically fetches and cleans article content  
**AI-Powered Insights** - Generates summaries, key points, and identifies conflicts  
**Citation Tracking** - Each claim links back to its source with snippets  
**Verification Checklist** - Highlights claims that need independent verification  
**History** - View your last 5 research briefs  
**System Status** - Monitor backend, database, and LLM health  

---

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key (free from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Research_brief_from_Links

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Gemini API key to .env.local
# GEMINI_API_KEY=your_api_key_here
```

### Running the App

```bash
# Development mode
npm run dev

# Open http://localhost:3000
```

### Building for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

---

## How to Use

1. **Home Page** - Paste 1-10 URLs (one per line) into the textarea
2. **Generate** - Click "Generate Research Brief" button
3. **Wait** - Processing takes 30-60 seconds depending on content length
4. **Review** - View your research brief with:
   - Executive summary
   - Key points with citations
   - Conflicting claims (if any)
   - Verification checklist
   - Source breakdown
5. **History** - Access past briefs from the History page

---

## Project Structure

```
Research_brief_from_Links/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts    # Main analysis endpoint
│   │   ├── history/route.ts    # Fetch past reports
│   │   └── status/route.ts     # System health check
│   ├── history/page.tsx        # History page
│   ├── result/[id]/page.tsx    # Individual report view
│   ├── status/page.tsx         # Status dashboard
│   └── page.tsx                # Home page
├── lib/
│   ├── db.ts                   # SQLite database
│   ├── fetchReadable.ts        # Content extraction
│   ├── llm.ts                  # Gemini AI integration
│   ├── logger.ts               # Structured logging
│   └── validation.ts           # Input validation
├── types/
│   └── report.ts               # TypeScript types
└── data/
    └── reports.db              # SQLite database file
```

---

## What's Implemented

### Core Features ✅
- URL input (1-10 links)
- Content fetching with browser-like headers
- Readability-based content extraction
- LLM-powered analysis (Gemini 2.5 Flash)
- Research brief generation with:
  - Summary
  - Key points with citations
  - Conflicting claims detection
  - Verification checklist
  - Source attribution
- SQLite database for persistence
- History page (last 5 reports)
- Status page (backend/DB/LLM health)
- Input validation
- Error handling
- Structured logging

### UI/UX ✅
- [x] Clean, modern interface
- [x] Loading states
- [x] Error messages
- [x] Responsive design
- [x] Clear navigation


## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **LLM**: Google Gemini 2.5 Flash
- **Content Extraction**: Mozilla Readability + JSDOM
- **HTTP Client**: node-fetch

---

## Environment Variables

Create a `.env.local` file with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

See `.env.example` for reference.

---

## API Endpoints

### POST `/api/analyze`
Generate research brief from URLs

**Request:**
```json
{
  "urls": "https://example.com/article1\nhttps://example.com/article2"
}
```

**Response:**
```json
{
  "id": 1,
  "success": true
}
```

### GET `/api/history`
Get last 5 research briefs

**Response:**
```json
{
  "reports": [...]
}
```

### GET `/api/status`
Check system health

**Response:**
```json
{
  "backend": true,
  "database": true,
  "llm": true,
  "timestamp": "2026-02-17T00:00:00.000Z"
}
```

---

## Troubleshooting

### "Failed to extract content"
- Some websites block automated scraping
- Try different URLs or articles from open platforms (Wikipedia, Medium, etc.)

### "Gemini API error"
- Check your API key in `.env.local`
- Verify you have API quota remaining
- Ensure you're using a valid model name

### Database errors
- Delete `data/reports.db` and restart the app
- Check file permissions on the `data/` directory

### Vercel Deployment Note
- The app uses SQLite which stores data in `/tmp` directory on Vercel
- **Data is ephemeral** - history will reset between deployments
- For production use, consider migrating to Vercel Postgres, Supabase, or PlanetScale

---

## License

MIT License - See LICENSE file for details

---

## Contributing

This is a hiring project submission. Not accepting contributions at this time.
