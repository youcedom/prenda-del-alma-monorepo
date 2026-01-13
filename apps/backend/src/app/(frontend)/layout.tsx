import React from 'react'
import './globals.css'

export const metadata = {
    title: 'Payload CMS',
    description: 'Payload CMS 3.0',
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
