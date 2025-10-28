import { Outlet, Link } from 'react-router-dom'
import WalletConnect from './src/components/WalletConnect'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold tracking-wide">AICo</Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="hidden sm:inline text-white/90 hover:text-white">Home</Link>
            <div className="scale-90 sm:scale-100">
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500">
          © {new Date().getFullYear()} AICo
        </div>
      </footer>
    </div>
  )
}
