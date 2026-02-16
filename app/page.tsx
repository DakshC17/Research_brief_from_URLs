'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
    const [urls, setUrls] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ urls }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'An error occurred')
                setLoading(false)
                return
            }

            // Redirect to result page
            router.push(`/result/${data.id}`)
        } catch (err) {
            setError('Failed to process request')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Research Brief from Links
                    </h1>
                    <p className="text-lg text-gray-600">
                        Generate structured research briefs from multiple URLs
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Instructions
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 leading-tight">
                            <li className="whitespace-nowrap">Paste 1-10 URLs (one per line)</li>
                            <li className="whitespace-nowrap">URLs should be articles, blogs, or documentation</li>
                            <li className="whitespace-nowrap">The app will extract content and generate a research brief</li>
                            <li className="whitespace-nowrap">Processing may take 30-60 seconds</li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="urls"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Enter URLs (one per line)
                            </label>
                            <textarea
                                id="urls"
                                value={urls}
                                onChange={(e) => setUrls(e.target.value)}
                                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
                                placeholder={`https://example.com/article-1
https://example.com/article-2
https://example.com/article-3`}
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Processing...' : 'Generate Research Brief'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                            <a
                                href="/history"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                View History
                            </a>
                            <a
                                href="/status"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                System Status
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
