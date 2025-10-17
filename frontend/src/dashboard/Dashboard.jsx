import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

export function Dashboard() {
  const { user, logout } = useAuth()
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', gstin: '' })
  const [error, setError] = useState('')

  const load = async () => {
    const r = await fetch('http://localhost:4000/api/customers', { credentials: 'include' })
    if (r.ok) {
      const data = await r.json()
      setCustomers(data.customers)
    }
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const r = await fetch('http://localhost:4000/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    })
    if (!r.ok) {
      setError('Invalid data')
      return
    }
    setForm({ name: '', email: '', gstin: '' })
    await load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600">Signed in as {user?.name} ({user?.email})</p>
        </div>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold mb-3">Onboard Customer</h2>
          <form className="space-y-3" onSubmit={onSubmit}>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div>
              <label>Name</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} placeholder="Customer name" />
            </div>
            <div>
              <label>Email</label>
              <input value={form.email} type="email" onChange={e=>setForm(f=>({...f, email: e.target.value}))} placeholder="customer@example.com" />
            </div>
            <div>
              <label>GSTIN</label>
              <input value={form.gstin} onChange={e=>setForm(f=>({...f, gstin: e.target.value}))} placeholder="GSTIN" />
            </div>
            <button type="submit">Create</button>
          </form>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Customers</h2>
          <div className="border rounded-md bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">GSTIN</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} className="border-t">
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.email}</td>
                    <td className="p-2">{c.gstin}</td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr><td className="p-3 text-gray-500" colSpan={3}>No customers yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


