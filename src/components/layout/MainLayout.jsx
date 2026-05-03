import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom'
import PageTransition from '../ui/PageTransition'
import { Bell, LogOut, QrCode, X, Users, Factory, Banknote, FileSpreadsheet, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/auth-context'
import { useState } from 'react'

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ')
}

const allNavItems = [
  { name: 'Analytics', href: '/app/dashboard', icon: LayoutDashboard, roles: ['admin', 'production_head', 'hr'] },
  { name: 'Production', href: '/app/production', icon: Factory, roles: ['admin', 'production_head', 'leadman'] },
  { name: 'Payroll', href: '/app/payroll', icon: Banknote, roles: ['admin', 'finance'] },
  { name: 'Employees', href: '/app/employees', icon: Users, roles: ['admin', 'hr'] },
  { name: 'Requests', href: '/app/requests', icon: FileSpreadsheet, roles: ['admin', 'hr', 'production_head'] },
  { name: 'My Portal', href: '/app/portal', icon: QrCode, roles: ['employee'] },
]

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (user.role === 'employee' || user.role === 'leadman') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg"><QrCode className="w-5 h-5 text-white" /></div>
            <h1 className="text-lg font-bold text-white">TriOPS</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors"><Bell className="w-5 h-5" /></button>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-300 hidden sm:inline-block">{user.name}</span>
              <button onClick={handleLogout} className="text-slate-400 hover:text-rose-400 transition-colors p-2" title="Sign Out"><LogOut className="w-5 h-5" /></button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto"><div className="max-w-7xl mx-auto"><PageTransition><Outlet /></PageTransition></div></main>
      </div>
    )
  }

  const filteredNav = allNavItems.filter(i => i.roles.includes(user.role))

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex">
      {mobileMenuOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>}

      <aside className={cn('fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300', mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0')}>
        <div className="p-6 flex items-center justify-between md:justify-start gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20"><QrCode className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-xl font-bold text-white">TriOPS</h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{user.role}</p>
            </div>
          </div>
          <button className="md:hidden p-2 text-slate-400" onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2 px-3">Navigation Menu</div>
          {filteredNav.map(item => (
            <NavLink key={item.name} to={item.href} title={item.name} className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200')}>
              <item.icon className="w-5 h-5" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800/50 mb-3 border border-slate-700/50">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/20">{user.name.split(' ').map(n=>n[0]).join('').substring(0,2)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{user.role.replace('_',' ')}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><LogOut className="w-5 h-5" />Sign out</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 bg-slate-950 border-b border-slate-800 hidden md:flex items-center justify-between px-6 shrink-0">
          <div className="flex-1"></div>
          <div className="flex items-center gap-4"><button className="relative p-2 text-slate-400 hover:text-white transition-colors bg-slate-900 rounded-lg border border-slate-800"><Bell className="w-5 h-5" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span></button></div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8"><div className="max-w-7xl mx-auto pb-12"><Outlet /></div></div>
      </main>
    </div>
  )
}
