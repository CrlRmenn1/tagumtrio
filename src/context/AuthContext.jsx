import { useEffect, useState } from 'react'
import { AuthContext } from './auth-context'
import { DEPARTMENTS } from '../constants/departments'

const AUTH_USERS_KEY = 'triops-auth-users'
const AUTH_SESSION_KEY = 'triops-auth-session'

const ROLE_PREFIX = {
  admin: 'ADM',
  production_head: 'PRD',
  leadman: 'LD',
  finance: 'FIN',
  employee: 'EMP',
}

const DEFAULT_USERS = [
  { id: 'ADM-001', identifier: 'admin@triops.local', password: 'Admin@123', name: 'System Admin', role: 'admin' },
  { id: 'PRD-001', identifier: 'production@triops.local', password: 'Prod@123', name: 'John Doe', role: 'production_head', department: 'Production' },
  { id: 'LD-001', identifier: 'leadman@triops.local', password: 'Lead@123', name: 'Lead Man', role: 'leadman', department: DEPARTMENTS[0], departments: [DEPARTMENTS[0]] },
  { id: 'FIN-001', identifier: 'finance@triops.local', password: 'Fin@12345', name: 'Andres Bonifacio', role: 'finance', department: 'Finance' },
  { id: 'EMP-001', identifier: 'employee@triops.local', password: 'Emp@12345', name: 'Juan Dela Cruz', role: 'employee', department: DEPARTMENTS[0] },
]

function normalizeIdentifier(value) {
  return String(value || '').trim().toLowerCase()
}

function normalizeUsers(rawUsers) {
  if (!Array.isArray(rawUsers)) return []

  return rawUsers.map((item) => {
    if (item?.role === 'hr') {
      return {
        ...item,
        role: 'production_head',
        department: item.department || 'Production',
      }
    }

    if (item?.role === 'leadman') {
      const departments = Array.isArray(item.departments) && item.departments.length > 0
        ? item.departments
        : [item.department || DEPARTMENTS[0]]
      return {
        ...item,
        department: item.department || departments[0],
        departments,
      }
    }

    return item
  })
}

function loadUsers() {
  if (typeof window === 'undefined') return DEFAULT_USERS
  try {
    const raw = window.localStorage.getItem(AUTH_USERS_KEY)
    if (!raw) return DEFAULT_USERS
    const parsed = JSON.parse(raw)
    const normalized = normalizeUsers(parsed)
    if (!Array.isArray(normalized) || normalized.length === 0) return DEFAULT_USERS
    return normalized
  } catch {
    return DEFAULT_USERS
  }
}

function buildSessionUser(record) {
  if (!record) return null
  const base = {
    id: record.id,
    name: record.name,
    role: record.role,
  }

  if (record.role === 'leadman') {
    const leadmanDepartments = Array.isArray(record.departments) && record.departments.length > 0
      ? record.departments
      : [record.department || DEPARTMENTS[0]]
    return {
      ...base,
      department: record.department || leadmanDepartments[0],
      departments: leadmanDepartments,
    }
  }

  if (record.department) {
    return { ...base, department: record.department }
  }

  return base
}

function loadSession(users) {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.id) return null
    const match = users.find((item) => item.id === parsed.id)
    return buildSessionUser(match)
  } catch {
    return null
  }
}

function makeUserId(role) {
  const prefix = ROLE_PREFIX[role] || 'USR'
  const token = String(Date.now()).slice(-6)
  return `${prefix}-${token}`
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadUsers())
  const [user, setUser] = useState(() => loadSession(loadUsers()))

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!user) {
      window.localStorage.removeItem(AUTH_SESSION_KEY)
      return
    }
    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ id: user.id }))
  }, [user])

  const login = (role, options = {}) => {
    const existing = users.find((item) => item.role === role)
    if (existing) {
      setUser(buildSessionUser(existing))
      return
    }

    if (!role) {
      setUser(null)
      return
    }

    const created = {
      id: makeUserId(role),
      identifier: `${role}@triops.local`,
      password: 'Pass@123',
      name: role.replace('_', ' ').replace(/\b\w/g, (s) => s.toUpperCase()),
      role,
      department: role === 'leadman'
        ? ((Array.isArray(options.departments) && options.departments.length > 0 ? options.departments[0] : options.department) || DEPARTMENTS[0])
        : (role === 'employee' ? DEPARTMENTS[0] : undefined),
      departments: role === 'leadman'
        ? (Array.isArray(options.departments) && options.departments.length > 0 ? options.departments : [options.department || DEPARTMENTS[0]])
        : undefined,
    }
    setUsers((current) => [created, ...current])
    setUser(buildSessionUser(created))
  }

  const loginWithCredentials = ({ identifier, password }) => {
    const normalized = normalizeIdentifier(identifier)
    const account = users.find((item) => normalizeIdentifier(item.identifier) === normalized || normalizeIdentifier(item.id) === normalized)

    if (!account) return { ok: false, error: 'No account found with that email or ID.' }
    if (account.password !== password) return { ok: false, error: 'Incorrect password.' }

    const sessionUser = buildSessionUser(account)
    setUser(sessionUser)
    return { ok: true, user: sessionUser }
  }

  const registerUser = ({ name, identifier, password, role, department, departments }) => {
    const normalized = normalizeIdentifier(identifier)
    if (!normalized) return { ok: false, error: 'Email or employee ID is required.' }

    const duplicate = users.some((item) => normalizeIdentifier(item.identifier) === normalized || normalizeIdentifier(item.id) === normalized)
    if (duplicate) return { ok: false, error: 'Account already exists for this email or ID.' }

    const leadmanDepartments = Array.isArray(departments) && departments.length > 0
      ? departments
      : [department || DEPARTMENTS[0]]

    const nextUser = {
      id: makeUserId(role),
      identifier: normalized,
      password,
      name: String(name || '').trim(),
      role,
      department: role === 'leadman' ? leadmanDepartments[0] : department,
      departments: role === 'leadman' ? leadmanDepartments : undefined,
    }

    setUsers((current) => [nextUser, ...current])
    return { ok: true, user: nextUser }
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, users, login, loginWithCredentials, registerUser, logout }}>{children}</AuthContext.Provider>
}
