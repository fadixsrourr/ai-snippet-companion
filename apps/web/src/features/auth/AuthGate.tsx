import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export function AuthGate() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const signInWithMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin }
    })
    setSending(false)
    setMessage(error ? error.message : 'Check your email for a login link.')
  }

  const signInAnon = async () => {
    // Optional: quick test mode (remove in prod)
    const { data, error } = await supabase.auth.signInAnonymously()
    setMessage(error ? error.message : `Signed in as anon user ${data.user?.id}`)
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Sign in</h2>
      <form onSubmit={signInWithMagicLink} className="space-y-3">
        <input
          className="w-full rounded-md bg-neutral-800 px-3 py-2 outline-none focus:ring-2 ring-neutral-600"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="rounded-md px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
          disabled={sending}
        >
          {sending ? 'Sending…' : 'Send magic link'}
        </button>
      </form>

      <button onClick={signInAnon} className="text-sm opacity-70 underline">
        Or continue as anonymous (dev only)
      </button>

      {message && <p className="text-sm opacity-80">{message}</p>}
    </div>
  )
}
