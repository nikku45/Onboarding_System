import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      nav('/dashboard')
    } catch (e) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-start sm:items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block mb-1">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="********" />
        </div>
        <button className="w-full" type="submit">Login</button>
      </form>
      <p className="text-sm mt-4 text-center">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
      </div>
    </div>
  )
}


