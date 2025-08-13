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
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center items-center h-20 relative">
                
                {/* Main logo/title */}
                <div className="flex items-center space-x-3">
                  {/* Icon element */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-900 rounded-full"></div>
                  </div>
                  
                  {/* Brand name with enhanced typography */}
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight relative">
                    <span className="relative z-10">BenchMark</span>
                    <span className="text-gray-600 font-normal">IQ</span>
                    {/* Subtle underline accent */}
                    <div className="absolute -bottom-1 left-0 w-16 h-0.5 bg-gradient-to-r from-black to-gray-300"></div>
                  </h1>
                </div>

                {/* Right geometric accent */}
                <div className="absolute right-0 w-12 h-12 opacity-5">
                  <div className="w-full h-full grid grid-cols-3 gap-0.5">
                    <div className="bg-black"></div>
                    <div className="bg-black opacity-60"></div>
                    <div className="bg-black opacity-30"></div>
                    <div className="bg-black opacity-60"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black opacity-60"></div>
                    <div className="bg-black opacity-30"></div>
                    <div className="bg-black opacity-60"></div>
                    <div className="bg-black"></div>
                  </div>
                </div>

                <div className="absolute left-0 w-12 h-12 opacity-5">
                  <div className="w-full h-full grid grid-cols-3 gap-0.5">
                    <div className="bg-black"></div>
                    <div className="bg-black opacity-60"></div>
                    <div className="bg-black opacity-30"></div>
                    <div className="bg-black opacity-60"></div>
                    <div className="bg-black"></div>
                    <div className="bg-black opacity-60"></div>
                    <div className="bg-black opacity-30"></div>
                    <div className="bg-black opacity-60"></div>
                    <div className="bg-black"></div>
                  </div>
                </div>

              </div>

              {/* Subtle tagline */}
              <div className="flex justify-center pb-4">
                <p className="text-xs text-gray-500 font-medium tracking-wider uppercase letter-spacing-wide">
                  Industry Benchmark Intelligence
                </p>
              </div>
            </div>
          </header>

          {/* Enhanced main content area */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
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