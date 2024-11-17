export default function GameCodeLayout({
    children,
    params,
  }: {
    children: React.ReactNode
    params: { code: string }
  }) {
    return (
      <div className="max-w-6xl mx-auto">
        <header className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 text-white">
          <h1 className="text-2xl font-bold">Game: {params.code}</h1>
        </header>
        {children}
      </div>
    )
  }