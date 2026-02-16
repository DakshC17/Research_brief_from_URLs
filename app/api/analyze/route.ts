import { NextRequest, NextResponse } from 'next/server'
import { parseUrlsFromText, validateUrls } from '@/lib/validation'
import { fetchMultipleUrls } from '@/lib/fetchReadable'
import { generateResearchBrief } from '@/lib/llm'
import { saveReport } from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { urls: urlsText } = body

        if (!urlsText || typeof urlsText !== 'string') {
            return NextResponse.json(
                { error: 'URLs are required' },
                { status: 400 }
            )
        }

        // Parse URLs from text
        const urls = parseUrlsFromText(urlsText)

        // Validate URLs
        const validation = validateUrls(urls)
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            )
        }

        // Fetch content from URLs
        const extractedContents = await fetchMultipleUrls(urls)

        // Check if any content was successfully extracted
        const successfulExtractions = extractedContents.filter(c => c.success)
        if (successfulExtractions.length === 0) {
            return NextResponse.json(
                { error: 'Failed to extract content from any URL' },
                { status: 400 }
            )
        }

        // Generate research brief using LLM
        const report = await generateResearchBrief(extractedContents)

        // Save to database
        const reportId = saveReport(urls, report)

        return NextResponse.json({
            id: reportId,
            success: true,
        })
    } catch (error) {
        console.error('Error in analyze API:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
