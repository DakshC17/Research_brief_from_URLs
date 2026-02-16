import { NextResponse } from 'next/server'
import { getRecentReports } from '@/lib/db'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:history')

export async function GET() {
    try {
        logger.info({}, 'Fetching recent reports')
        const reports = getRecentReports(5)
        logger.info({ count: reports.length }, 'Reports fetched successfully')
        return NextResponse.json({ reports })
    } catch (error) {
        logger.error({
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, 'Failed to fetch history')
        return NextResponse.json(
            { error: 'Failed to fetch history' },
            { status: 500 }
        )
    }
}
