import { AuthProvider, useAuth } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import AuthPage from './pages/AuthPage'

function AppInner() {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-main">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) return <AuthPage />

  return (
    <ChatProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-main">
        <Sidebar />
        <main className="flex flex-1 min-w-0 h-full overflow-hidden">
          <ChatArea />
        </main>
      </div>
    </ChatProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  )
}
