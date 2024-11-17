import GameClient from '@/components/game/GameClient'

export async function generateMetadata({ 
  params 
}: { 
  params: { code: string } 
}) {
  return {
    title: `Game ${params.code}`,
  }
}

export default function GamePage({ 
  params 
}: { 
  params: { code: string } 
}) {
  return <GameClient gameCode={params.code} />
}