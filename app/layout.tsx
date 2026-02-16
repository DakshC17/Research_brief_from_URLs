import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Research Brief from Links',
    description: 'Generate structured research briefs from multiple URLs',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
