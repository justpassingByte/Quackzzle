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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-500 to-purple-600">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Tham Gia Game
        </h1>
        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Mã Game"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã game"
            required
          />
          <Input
            label="Tên của bạn"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nhập tên của bạn"
            required
          />
          <Button 
            type="submit" 
            variant="secondary" 
            isLoading={loading} 
            className="w-full"
          >
            {loading ? 'Đang tham gia...' : 'Tham Gia'}
          </Button>
        </form>
      </div>
    </div>
  )
}