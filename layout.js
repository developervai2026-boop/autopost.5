import './globals.css'

export const metadata = {
  title: 'AI Chat — 5 Models',
  description: 'Chat with ChatGPT, Claude, Gemini, Grok & DeepSeek',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
