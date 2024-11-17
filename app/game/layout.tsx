import { Suspense } from 'react'

export default function GameCodeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-6xl mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </div>
  )
}