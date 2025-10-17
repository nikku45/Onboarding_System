import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { LoginPage } from './auth/LoginPage'
import { RegisterPage } from './auth/RegisterPage'
import { Dashboard } from './dashboard/Dashboard'
import { Admin } from './dashboard/Admin'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <nav className="border-b bg-white">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
              <Link to="/" className="font-semibold">Neximprove</Link>
              <div className="ml-auto flex gap-3 text-sm">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/admin">Admin</Link>
              </div>
            </div>
          </nav>
          <main className="flex-1">
            <div className="max-w-5xl mx-auto px-4 py-10">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
