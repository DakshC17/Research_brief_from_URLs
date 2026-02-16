import { notFound } from 'next/navigation'
import { getReport } from '@/lib/db'

export default function ResultPage({ params }: { params: { id: string } }) {
    const reportId = parseInt(params.id)

    if (isNaN(reportId)) {
        notFound()
    }

    const savedReport = getReport(reportId)

    if (!savedReport) {
        notFound()
    }

    const { report, urls, created_at } = savedReport

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
