import { useState } from 'react'
import { Box, Users } from 'lucide-react'

const roles = [
  { key: 'admin', label: 'Admin' },
  { key: 'production', label: 'Production' },
  { key: 'finance', label: 'Finance' },
  { key: 'hr', label: 'HR' },
  { key: 'employee', label: 'Employee' },
]

function Sidebar({ role }) {
  const links = {
    admin: ['Dashboard', 'Workforce', 'Salary', 'QR'],
    production: ['Dashboard', 'Batch Tracking', 'Worker Output'],
    finance: ['Dashboard', 'Cash Flow', 'Payroll Review'],
    hr: ['Dashboard', 'Employees', 'Payroll Processing'],
    employee: ['Dashboard', 'My Attendance', 'My Payslips'],
  }

  return (
    <aside className="w-64 flex-shrink-0 rounded-[10px] bg-[#030213] text-white p-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-md bg-gradient-to-br from-[#0ea5a4] to-[#0891b2] p-2">
          <Box className="w-6 h-6 text-white" />
        </div>
        <div className="text-lg font-semibold">Tagum Trio</div>
      </div>

      <nav className="flex flex-col gap-2">
        {links[role].map((l) => (
          <button key={l} className="text-left rounded-md px-3 py-2 hover:bg-white/5 transition">{l}</button>
        ))}
      </nav>
    </aside>
  )
}

function Card({ title, value, accent }) {
  return (
    <div className="rounded-[10px] bg-white/5 p-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
      <div className="text-sm text-slate-300">{title}</div>
      <div className={`mt-2 text-2xl font-semibold ${accent}`}>{value}</div>
    </div>
  )
}

export default function FigmaDemo() {
  const [role, setRole] = useState('production')

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-[#020617] to-[#030712] text-slate-100">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-[#e9ebef] p-2 text-[#030213]">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold">Imported Figma UI (Demo)</h1>
        </div>
        <div className="flex items-center gap-3">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => setRole(r.key)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${role === r.key ? 'bg-white/8 text-white' : 'text-slate-300 hover:bg-white/5'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <Sidebar role={role} />

        <main>
          <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card title="Batch Tracking" value="12" accent="text-cyan-300" />
            <Card title="Worker Output" value="98%" accent="text-green-300" />
            <Card title="Active Batches" value="3" accent="text-amber-300" />
          </section>

          <section className="rounded-[10px] bg-[#0b1220]/60 p-4">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-semibold">Role preview: {role}</h2>
              <div className="flex items-center gap-3">
                <button className="rounded-md bg-white/6 px-3 py-2">Export</button>
                <button className="rounded-md bg-white/6 px-3 py-2">Share</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[10px] bg-white/3 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-300">Today's Output</div>
                    <div className="mt-1 text-3xl font-bold">120</div>
                  </div>
                  <div className="text-slate-400">+3%</div>
                </div>
              </div>

              <div className="rounded-[10px] bg-white/3 p-4">
                <div className="text-sm text-slate-300">Efficiency</div>
                <div className="mt-1 text-3xl font-bold">98%</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
