import { NextRequest, NextResponse } from 'next/server'
import { parseUrlsFromText, validateUrls } from '@/lib/validation'
import { fetchMultipleUrls } from '@/lib/fetchReadable'
import { generateResearchBrief } from '@/lib/llm'
import { saveReport } from '@/lib/db'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:analyze')

export async function POST(request: NextRequest) {
    const startTime = Date.now()

    try {
        const body = await request.json()
        const { urls: urlsText } = body

        if (!urlsText || typeof urlsText !== 'string') {
            logger.warn({}, 'Request missing URLs')
            return NextResponse.json(
                { error: 'URLs are required' },
                { status: 400 }
            )
        }

        // Parse URLs from text
        const urls = parseUrlsFromText(urlsText)
        logger.info({ urlCount: urls.length }, 'Request received')

        // Validate URLs
        const validation = validateUrls(urls)
        if (!validation.valid) {
            logger.warn({ error: validation.error }, 'URL validation failed')
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            )
        }

        // Fetch content from URLs
        logger.info({ urls: urls.length }, 'Starting content extraction')
        const extractedContents = await fetchMultipleUrls(urls)

        // Check if any content was successfully extracted
        const successfulExtractions = extractedContents.filter(c => c.success)
        logger.info({
            successful: successfulExtractions.length,
            failed: extractedContents.length - successfulExtractions.length
        }, 'Content extraction completed')

        if (successfulExtractions.length === 0) {
            logger.error({}, 'All content extractions failed')
            return NextResponse.json(
                { error: 'Failed to extract content from any URL' },
                { status: 400 }
            )
        }

        // Generate research brief using LLM
        logger.info({}, 'Starting LLM generation')
        const report = await generateResearchBrief(extractedContents)
        logger.info({}, 'LLM generation completed')

        // Save to database
        const reportId = saveReport(urls, report)
        logger.info({ reportId }, 'Report saved')

        const duration = Date.now() - startTime
        logger.info({ reportId, duration }, 'Request completed successfully')

        return NextResponse.json({
            id: reportId,
            success: true,
            report: report,
            urls: urls,
            created_at: new Date().toISOString(),
        })
    } catch (error) {
        const duration = Date.now() - startTime
        logger.error({
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            duration
        }, 'Request failed')
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        )
    }
}
