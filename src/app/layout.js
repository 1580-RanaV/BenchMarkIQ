import './globals.css'

export const metadata = {
  title: 'BenchMarkIQ - Industry Benchmark Comparator',
  description: 'Compare your company KPIs against industry medians instantly',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <div className="min-h-full bg-gradient-to-br from-gray-50 to-white">
           <header
      className="
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        w-[92%] max-w-4xl
        rounded-full border border-white/10
        bg-black backdrop-blur-md shadow-xl
        px-6 py-3 h-24
        [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]
        [background-size:14px_14px] [background-position:0px_0px]
      "
    >
      <div className="flex justify-center items-center h-full">
        {/* Logo + Brand */}
        <div className="flex items-center gap-4">
          {/* Logo: 3 squares (middle rotated) */}
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-sm bg-white"></div>
            <div className="w-8 h-8 rounded-sm bg-white -rotate-90"></div>
            <div className="w-8 h-8 rounded-sm bg-white"></div>
          </div>

          {/* Brand */}
          <h1 className="text-xl font-semibold tracking-tight">
            <span className="text-white font-bold">BenchMark</span>
            <span className="text-neutral-400 font-bold">IQ</span>
          </h1>
        </div>
      </div>
    </header>

          {/* Enhanced main content area */}
          <main className="mt-26 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <div className="w-full h-full" 
                   style={{
                     backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
                     backgroundSize: '24px 24px'
                   }}>
              </div>
            </div>
            
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}