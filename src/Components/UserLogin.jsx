{/*Emmanuel wema*/}
import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, LogIn } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { loginWithApi, setSession, userSessionKey } from '../auth/adminAuth.js'

function UserLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const user = await loginWithApi({ email, password, requiredRole: 'Customer' })
      setSession(userSessionKey, user)
      const destination = location.state?.from || '/shop'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071015] px-6 py-12 text-white">
      <section className="w-full max-w-md rounded-2xl border border-[#5cd9e0]/25 bg-[#101a20] p-8 shadow-2xl shadow-black/40">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#5cd9e0]">Customer account</p>
        <h1 className="mt-1 text-2xl font-bold">Sign in to order parts</h1>
        <p className="mt-3 text-sm leading-6 text-[#b0d4e3]">Verified customers can order spare parts directly from the shop.</p>

        {location.state?.registered && (
          <p className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Account created. An administrator must verify it before you can place an order.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block text-sm font-medium text-[#d5e6ec]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
              className="mt-2 w-full rounded-lg border border-[#5cd9e0]/50 bg-[#080d10] px-4 py-3 font-semibold text-[#f8fafc] placeholder:text-[#8aa8b7] outline-none transition focus:border-[#5cd9e0] focus:ring-1 focus:ring-[#5cd9e0]"
            />
          </label>

          <label className="block text-sm font-medium text-[#d5e6ec]">
            Password
            <span className="relative mt-2 block">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8aa8b7]" size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-[#5cd9e0]/50 bg-[#080d10] py-3 pl-10 pr-12 font-semibold text-[#f8fafc] placeholder:text-[#8aa8b7] outline-none transition focus:border-[#5cd9e0] focus:ring-1 focus:ring-[#5cd9e0]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5cd9e0] transition hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>

          {error && <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">{error}</p>}

          <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5cd9e0] px-4 py-3 font-bold text-[#102b40] transition hover:bg-white disabled:opacity-60">
            <LogIn size={18} />
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8aa8b7]">
          Don't have an account? <Link to="/register" className="font-semibold text-[#5cd9e0] hover:text-white">Create one</Link>
        </p>
      </section>
    </main>
  )
}

export default UserLogin
