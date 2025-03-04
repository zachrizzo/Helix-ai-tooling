import './globals.css'

export const metadata = {
    title: 'AI Tooling Website',
    description: 'A platform for AI and robotics tools',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    )
}
