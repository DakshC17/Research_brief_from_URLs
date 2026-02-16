import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db'
import { checkLLMConnection } from '@/lib/llm'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:status')

export async function GET() {
    try {
        logger.debug({}, 'Running status checks')
        const dbStatus = checkDatabaseConnection()
        const llmStatus = await checkLLMConnection()

        logger.info({
            database: dbStatus,
            llm: llmStatus
        }, 'Status check completed')

        return NextResponse.json({
            backend: true,
            database: dbStatus,
            llm: llmStatus,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        logger.error({
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, 'Status check failed')
        return NextResponse.json(
            {
                backend: true,
                database: false,
                llm: false,
                error: 'Status check failed',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        )
    }
}
