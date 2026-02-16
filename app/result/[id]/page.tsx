'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface ResearchBrief {
    summary: string
    key_points: Array<{
        point: string
        sources: number[]
        snippet: string
    }>
    conflicting_claims: Array<{
        claim: string
        sources: number[]
    }>
    verification_checklist: string[]
    sources_used: Array<{
        id: number
        url: string
        what_used: string
    }>
}

interface SavedReport {
    report: ResearchBrief
    urls: string[]
    created_at: string
}

export default function ResultPage() {
    const params = useParams()
    const reportId = params.id as string
    const [savedReport, setSavedReport] = useState<SavedReport | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Try to load from localStorage first (for serverless compatibility)
        const stored = localStorage.getItem(`report_${reportId}`)
        if (stored) {
            setSavedReport(JSON.parse(stored))
            setLoading(false)
        } else {
            // Fallback: try to fetch from server (won't work in serverless but kept for completeness)
            setLoading(false)
        }
    }, [reportId])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!savedReport) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h1>
                        <p className="text-gray-600 mb-6">
                            This report is no longer available. Due to serverless architecture,
                            reports are stored temporarily in your browser.
                        </p>
                        <a
                            href="/"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Generate New Brief
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    const { report, created_at } = savedReport

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <a
                        href="/"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        ← Back to Home
                    </a>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Research Brief
                        </h1>
                        <p className="text-sm text-gray-500">
                            Generated on {new Date(created_at).toLocaleString()}
                        </p>
                    </div>

                    {/* Summary */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {report.summary}
                        </p>
                    </section>

                    {/* Key Points */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Key Points
                        </h2>
                        <div className="space-y-6">
                            {report.key_points.map((kp, index) => (
                                <div
                                    key={index}
                                    className="border-l-4 border-blue-500 pl-4"
                                >
                                    <p className="font-medium text-gray-900 mb-2">
                                        {kp.point}
                                    </p>
                                    <p className="text-sm text-gray-600 italic mb-2">
                                        "{kp.snippet}"
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Sources: {kp.sources.join(', ')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Conflicting Claims */}
                    {report.conflicting_claims.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Conflicting Claims
                            </h2>
                            <div className="space-y-4">
                                {report.conflicting_claims.map((cc, index) => (
                                    <div
                                        key={index}
                                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                                    >
                                        <p className="text-gray-900 mb-2">
                                            {cc.claim}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            Sources: {cc.sources.join(', ')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Verification Checklist */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Verification Checklist
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {report.verification_checklist.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Sources */}
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Sources Used
                        </h2>
                        <div className="space-y-4">
                            {report.sources_used.map((source) => (
                                <div
                                    key={source.id}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-semibold">
                                            {source.id}
                                        </span>
                                        <div className="flex-1">
                                            <a
                                                href={source.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 break-all"
                                            >
                                                {source.url}
                                            </a>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {source.what_used}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
