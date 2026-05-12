import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Eye, EyeOff, Lock, UserCircle2 } from 'lucide-react'
import { useAuth } from '../context/auth-context'
import { DEPARTMENTS } from '../constants/departments'

const LOGIN_PREFS_KEY = 'triops-login-prefs'

const ROLE_OPTIONS = [
  { key: 'admin', label: 'Admin', hint: 'System-wide controls and approvals' },
  { key: 'production_head', label: 'Production Head', hint: 'Final production verification' },
  { key: 'leadman', label: 'Leadman', hint: 'Team handling, scan and reports' },
  { key: 'finance', label: 'Finance', hint: 'Payroll and payment release' },
  { key: 'hr', label: 'HR', hint: 'Employee records and requests' },
  { key: 'employee', label: 'Employee', hint: 'Portal, attendance and payslips' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState('employee')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [leadmanDepartments, setLeadmanDepartments] = useState([DEPARTMENTS[0]])
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOGIN_PREFS_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (typeof parsed.identifier === 'string') setIdentifier(parsed.identifier)
      if (typeof parsed.role === 'string') setSelectedRole(parsed.role)
      if (Array.isArray(parsed.leadmanDepartments) && parsed.leadmanDepartments.length > 0) {
        setLeadmanDepartments(parsed.leadmanDepartments)
      }
      if (typeof parsed.rememberMe === 'boolean') setRememberMe(parsed.rememberMe)
    } catch {
      // Ignore malformed localStorage data in demo mode.
    }
  }, [])

  const selectedRoleMeta = useMemo(() => ROLE_OPTIONS.find((role) => role.key === selectedRole), [selectedRole])

  const validationMessage = useMemo(() => {
    if (!identifier.trim()) return 'Enter your work email or employee ID.'
    if (identifier.trim().length < 3) return 'Identifier is too short.'
    if (!password) return 'Enter your password.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    if (selectedRole === 'leadman' && leadmanDepartments.length === 0) return 'Select at least one department for leadman login.'
    return ''
  }, [identifier, leadmanDepartments.length, password, selectedRole])

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (validationMessage) {
      setFormError(validationMessage)
      return
    }

    setSubmitting(true)

    if (rememberMe) {
      window.localStorage.setItem(
        LOGIN_PREFS_KEY,
        JSON.stringify({
          identifier: identifier.trim(),
          role: selectedRole,
          leadmanDepartments,
          rememberMe,
        })
      )
    } else {
      window.localStorage.removeItem(LOGIN_PREFS_KEY)
    }

    if (selectedRole === 'leadman') {
      login(selectedRole, { departments: leadmanDepartments })
    } else {
      login(selectedRole)
    }

    navigate('/app')
  }

  function toggleDepartment(department) {
    setLeadmanDepartments((current) => {
      const exists = current.includes(department)
      if (exists) {
        if (current.length === 1) return current
        return current.filter((value) => value !== department)
      }
      return [...current, department]
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#030712] to-[#020617] px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/30 backdrop-blur">
        <section className="p-6 sm:p-8 md:p-10">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">TriOPS</p>
            <h1 className="text-2xl font-bold text-white mt-1">Secure Sign in</h1>
            <p className="mt-2 text-sm text-slate-400">Sign in by role to continue with attendance, approvals, production workflow, and payroll operations.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-slate-300">Role</label>
              <select
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.key} value={role.key}>{role.label}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-400">{selectedRoleMeta?.hint}</p>
            </div>

            <div>
              <label className="text-sm text-slate-300">Email or Employee ID</label>
              <div className="mt-1.5 relative">
                <UserCircle2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  autoComplete="username"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. juan.dela.cruz or EMP-001"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-300">Password</label>
              <div className="mt-1.5 relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-12 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {selectedRole === 'leadman' && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="text-sm font-medium text-white">Leadman Departments</p>
                <p className="text-xs text-slate-400 mt-1">Assign one or more departments to this leadman session.</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {DEPARTMENTS.map((department) => (
                    <label key={department} className="flex items-center gap-2 text-xs text-slate-200 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2">
                      <input
                        type="checkbox"
                        checked={leadmanDepartments.includes(department)}
                        onChange={() => toggleDepartment(department)}
                        className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>{department}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
                />
                Remember me
              </label>
              <button type="button" className="text-cyan-300 hover:text-cyan-200" onClick={() => setFormError('Password reset will be connected to backend email flow.')}>Forgot password?</button>
            </div>

            {(formError || validationMessage) && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{formError || validationMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || Boolean(validationMessage)}
              className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {submitting ? 'Signing in...' : `Sign in as ${selectedRoleMeta?.label || 'User'}`}
            </button>

            <p className="text-[11px] text-slate-500 text-center">
              Demo environment. Role and identity are simulated locally.
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}
