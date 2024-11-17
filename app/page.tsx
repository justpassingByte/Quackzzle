import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-500 to-purple-600">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Quackzzle</h1>
        <p className="text-white text-xl mb-8">Game đố vui có thưởng</p>
      </div>
      
      <div className="flex gap-4">
        <Link href="/create">
          <Button variant="primary">Tạo Game</Button>
        </Link>
        <Link href="/join">
          <Button variant="secondary">Tham Gia Game</Button>
        </Link>
      </div>
    </main>
  )
}