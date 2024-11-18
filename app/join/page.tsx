'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function JoinGame() {
  const [gameCode, setGameCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/game/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameCode, playerName })
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('userId', data.data.player.id)
        router.push(`/game/${data.data.gameCode}`)
      } else {
        setError(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Join game error:', error)
      setError('Không thể tham gia game')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg w-full max-w-md border border-purple-100">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Tham Gia Game
        </h1>
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Mã Game"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã game"
            required
            className="bg-white/60 focus:bg-white/90 border-purple-100 uppercase"
          />
          <Input
            label="Tên của bạn"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nhập tên của bạn"
            required
            className="bg-white/60 focus:bg-white/90 border-purple-100"
          />
          <Button 
            type="submit" 
            variant="secondary" 
            isLoading={loading} 
            className="w-full shadow-md hover:shadow-lg transition-all bg-purple-500 hover:bg-purple-600"
          >
            {loading ? 'Đang tham gia...' : 'Tham Gia'}
          </Button>
        </form>
      </div>
    </div>
  )
}