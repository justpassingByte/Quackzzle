'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import GameClient from '@/components/game/GameClient'

export default function GamePage({ 
  params 
}: { 
  params: { code: string } 
}) {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Debug mã game
    console.log('Game code from params:', params.code)
    
    // Lấy userId từ query params và lưu vào localStorage
    const playerId = searchParams.get('playerId')
    if (playerId) {
      localStorage.setItem('userId', playerId)
      console.log('Setting userId in localStorage:', playerId)
    }
  }, [searchParams, params.code])
  
  return <GameClient gameCode={params.code} />
}