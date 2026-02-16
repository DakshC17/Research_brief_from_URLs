'use client'

import { useEffect, useState } from 'react'
import { SavedReport } from '@/types/report'

export default function HistoryPage() {
    const [reports, setReports] = useState<SavedReport[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Load all reports from localStorage
        const loadedReports: SavedReport[] = []

        // Iterate through localStorage to find all report_* keys
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith('report_')) {
                try {
                    const data = localStorage.getItem(key)
                    if (data) {
                        const parsed = JSON.parse(data)
                        const id = parseInt(key.replace('report_', ''))
                        loadedReports.push({
                            id,
                            ...parsed
                        })
                    }
                } catch (err) {
                    console.error('Failed to parse report:', key, err)
                }
            }
        }

        // Sort by ID descending (most recent first)
        loadedReports.sort((a, b) => b.id - a.id)

        // Keep only last 5
        setReports(loadedReports.slice(0, 5))
        setLoading(false)
    }, [])

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Recent Research Briefs
                    </h1>

                    {loading && (
                        <p className="text-gray-600">Loading history...</p>
                    )}

                    {!loading && reports.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">
                                No research briefs generated yet.
                            </p>
                            <a
                                href="/"
                                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Generate Your First Brief
                            </a>
                        </div>
                    )}

                    {!loading && reports.length > 0 && (
                        <div className="space-y-6">
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                                Report #{report.id}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {new Date(report.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <a
                                            href={`/result/${report.id}`}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                        >
                                            View Report
                                        </a>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Summary:
                                        </p>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {report.report.summary}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Sources ({report.urls.length}):
                                        </p>
                                        <ul className="text-xs text-gray-500 space-y-1">
                                            {report.urls.slice(0, 3).map((url, index) => (
                                                <li key={index} className="truncate">
                                                    {url}
                                                </li>
                                            ))}
                                            {report.urls.length > 3 && (
                                                <li className="text-gray-400">
                                                    +{report.urls.length - 3} more...
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
