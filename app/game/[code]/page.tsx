import GameClient from '@/components/game/GameClient'

export default function GamePage({ 
  params 
}: { 
  params: { code: string } 
}) {
  return <GameClient gameCode={params.code} />
}