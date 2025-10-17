import { useEffect, useState } from 'react'

export function Admin() {
  const [users, setUsers] = useState([])
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    try{
      Promise.all([
        fetch('http://localhost:4000/api/admin/users', { credentials: 'include' }).then(r=>r.json()),
        fetch('http://localhost:4000/api/admin/customers', { credentials: 'include' }).then(r=>r.json()),
      ]).then(([u, c]) => { setUsers(u.users); setCustomers(c.customers) })
      console.log(users, customers);
    } catch (error) {
      console.error(error)
    }
   
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Admin</h1>
        <p className="text-sm text-gray-600">View all users and customers (admin only)</p>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border bg-white">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border bg-white">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">GSTIN</th>
                <th className="p-2">Broker</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.email}</td>
                  <td className="p-2">{c.gstin}</td>
                  <td className="p-2">{c.broker_name} ({c.broker_email})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


