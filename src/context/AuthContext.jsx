import { useState } from 'react'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (role) => {
    switch (role) {
      case 'admin':
        setUser({ id: 'ADM-001', name: 'System Admin', role: 'admin' })
        break
      case 'production_head':
        setUser({ id: 'PRD-HEAD', name: 'John Doe', role: 'production_head', department: 'Production' })
        break
      case 'leadman':
        setUser({ id: 'LD-001', name: 'Lead Man', role: 'leadman', department: 'Production' })
        break
      case 'hr':
        setUser({ id: 'HR-001', name: 'Maria Clara', role: 'hr', department: 'Human Resources' })
        break
      case 'finance':
        setUser({ id: 'FIN-001', name: 'Andres Bonifacio', role: 'finance', department: 'Finance' })
        break
      case 'employee':
        setUser({ id: 'EMP-001', name: 'Juan Dela Cruz', role: 'employee', department: 'Production' })
        break
      default:
        setUser(null)
    }
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
