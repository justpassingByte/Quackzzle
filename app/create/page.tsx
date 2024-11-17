'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CreateGame = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState('')
  const router = useRouter()

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!userId.trim()) {
        setError('Vui lòng nhập tên của bạn')
        return
      }

      const trimmedUserId = userId.trim()
      localStorage.setItem('userId', trimmedUserId)

      const res = await fetch('/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hostId: trimmedUserId
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Network response was not ok')
      }

      if (data.success && data.game?.gameCode) {
        router.push(`/game/${data.game.gameCode}`)
      } else {
        throw new Error('Invalid game data received')
      }

    } catch (error: any) {
      console.error('Error creating game:', error)
      setError(error.message || 'Không thể tạo game. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Tạo Game Mới</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleCreateGame} className="space-y-4">
          <Input
            label="Tên của bạn"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Nhập tên của bạn"
            required
          />
          <Button 
            type="submit" 
            isLoading={loading} 
            className="w-full"
          >
            {loading ? 'Đang tạo...' : 'Tạo Game'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CreateGame