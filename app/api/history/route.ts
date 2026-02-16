import { NextResponse } from 'next/server'
import { getRecentReports } from '@/lib/db'

export async function GET() {
    try {
        const reports = getRecentReports(5)
        return NextResponse.json({ reports })
    } catch (error) {
        console.error('Error in history API:', error)
        return NextResponse.json(
            { error: 'Failed to fetch history' },
            { status: 500 }
        )
    }
}
