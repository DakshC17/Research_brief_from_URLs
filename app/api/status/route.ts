import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db'
import { checkLLMConnection } from '@/lib/llm'

export async function GET() {
    try {
        const dbStatus = checkDatabaseConnection()
        const llmStatus = await checkLLMConnection()

        return NextResponse.json({
            backend: true,
            database: dbStatus,
            llm: llmStatus,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error('Error in status API:', error)
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
