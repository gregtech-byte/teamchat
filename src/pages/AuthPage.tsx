import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const { signUp, logIn } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await logIn(email, password)
      } else {
        if (!name.trim()) { setError('Please enter your name'); setLoading(false); return }
        await signUp(email, password, name)
      }
    } catch (err: any) {
      const code = err.code
      if (['auth/user-not-found','auth/wrong-password','auth/invalid-credential'].includes(code)) {
        setError('Invalid email or password.')
      } else if (code === 'auth/email-already-in-use') {
        setError('Email already registered. Try signing in.')
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-main flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 shadow-lg">
            <img src="/logo.png" alt="Greg Tech" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Greg Tech</h1>
          <p className="text-muted text-sm mt-1">Team communication, simplified</p>
        </div>

        {/* Card */}
        <div className="bg-sidebar rounded-2xl border border-border p-8 shadow-xl">
          <h2 className="text-lg font-semibold text-primary mb-6">
            {isLogin ? 'Sign in to your workspace' : 'Create your account'}
          </h2>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
