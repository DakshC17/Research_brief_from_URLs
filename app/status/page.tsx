'use client'

import { useEffect, useState } from 'react'

interface SystemStatus {
    backend: boolean
    database: boolean
    llm: boolean
    timestamp: string
    error?: string
}

export default function StatusPage() {
    const [status, setStatus] = useState<SystemStatus | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkStatus() {
            try {
                const response = await fetch('/api/status')
                const data = await response.json()
                setStatus(data)
            } catch (err) {
                setStatus({
                    backend: false,
                    database: false,
                    llm: false,
                    timestamp: new Date().toISOString(),
                    error: 'Failed to connect to backend',
                })
            } finally {
                setLoading(false)
            }
        }

        checkStatus()
    }, [])

    const StatusIndicator = ({ isOk }: { isOk: boolean }) => (
        <span
            className={`inline-block w-3 h-3 rounded-full ${isOk ? 'bg-green-500' : 'bg-red-500'
                }`}
        />
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
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
                        System Status
                    </h1>

                    {loading && (
                        <p className="text-gray-600">Checking system status...</p>
                    )}

                    {!loading && status && (
                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Backend Server
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Next.js API routes
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusIndicator isOk={status.backend} />
                                        <span
                                            className={`text-sm font-medium ${status.backend
                                                    ? 'text-green-700'
                                                    : 'text-red-700'
                                                }`}
                                        >
                                            {status.backend ? 'Running' : 'Down'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Database
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            SQLite connection
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusIndicator isOk={status.database} />
                                        <span
                                            className={`text-sm font-medium ${status.database
                                                    ? 'text-green-700'
                                                    : 'text-red-700'
                                                }`}
                                        >
                                            {status.database ? 'Connected' : 'Disconnected'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            LLM Service
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            OpenAI API connectivity
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <StatusIndicator isOk={status.llm} />
                                        <span
                                            className={`text-sm font-medium ${status.llm
                                                    ? 'text-green-700'
                                                    : 'text-red-700'
                                                }`}
                                        >
                                            {status.llm ? 'Reachable' : 'Unreachable'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {status.error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-800 text-sm">{status.error}</p>
                                </div>
                            )}

                            <div className="pt-4">
                                <p className="text-xs text-gray-500">
                                    Last checked: {new Date(status.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
