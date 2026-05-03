import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = (role) => {
    login(role)
    navigate('/app')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020617] to-[#030712]">
      <div className="bg-slate-900 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">Sign in (demo)</h2>
        <div className="grid grid-cols-1 gap-2">
          <button onClick={() => handle('admin')} className="px-4 py-2 rounded bg-emerald-600 text-white">Sign in as Admin</button>
          <button onClick={() => handle('production_head')} className="px-4 py-2 rounded bg-cyan-600 text-white">Sign in as Production Head</button>
          <button onClick={() => handle('leadman')} className="px-4 py-2 rounded bg-indigo-600 text-white">Sign in as Leadman</button>
          <button onClick={() => handle('finance')} className="px-4 py-2 rounded bg-blue-600 text-white">Sign in as Finance</button>
          <button onClick={() => handle('hr')} className="px-4 py-2 rounded bg-amber-600 text-white">Sign in as HR</button>
          <button onClick={() => handle('employee')} className="px-4 py-2 rounded bg-rose-600 text-white">Sign in as Employee</button>
        </div>
      </div>
    </div>
  )
}
