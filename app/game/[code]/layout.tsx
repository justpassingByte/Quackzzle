'use client'

import { useState } from 'react'

export default function GameCodeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { code: string }
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(params.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-purple-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">Game:</h1>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono text-indigo-600">{params.code}</span>
              <button
                onClick={handleCopy}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${copied 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                title="Copy game code"
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {copied && (
            <span className="text-sm text-green-600 animate-fade-in">
              Đã sao chép mã game!
            </span>
          )}
        </div>
      </header>
      {children}
    </div>
  )
}