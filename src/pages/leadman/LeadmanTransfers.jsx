import { useMemo, useState } from 'react'
import { BadgeCheck, Search } from 'lucide-react'
import { useAuth } from '../../context/auth-context'
import { useQr } from '../../context/qr-context'
import { DEPARTMENTS } from '../../constants/departments'

export default function LeadmanTransfers() {
  const { user } = useAuth()
  const { departmentRequests, approveDepartmentRequest, formatDateTime } = useQr()

  const assignedDepartments = useMemo(() => {
    if (Array.isArray(user?.departments) && user.departments.length > 0) return user.departments
    if (user?.department) return [user.department]
    return [DEPARTMENTS[0]]
  }, [user?.department, user?.departments])

  const [selectedDepartment, setSelectedDepartment] = useState(assignedDepartments[0])
  const [query, setQuery] = useState('')
  const [transferNote, setTransferNote] = useState('')

  const departmentTransferRequests = useMemo(() => {
    return departmentRequests
      .filter((request) => request.requestedDepartment === selectedDepartment && request.status === 'pending')
      .filter((request) => request.employeeName.toLowerCase().includes(query.toLowerCase()) || request.employeeId.toLowerCase().includes(query.toLowerCase()))
  }, [departmentRequests, query, selectedDepartment])

  function handleTransferAction(request, action) {
    if (action === 'approve') {
      approveDepartmentRequest(request.id, user?.id || 'LD-001')
      return
    }

    if (action === 'discuss') {
      const note = transferNote.trim() || 'Discussed with admin for manual review.'
      window.localStorage.setItem(
        `triops-transfer-note:${request.id}`,
        JSON.stringify({
          requestId: request.id,
          employeeId: request.employeeId,
          employeeName: request.employeeName,
          department: request.requestedDepartment,
          note,
          leadmanId: user?.id || 'LD-001',
          discussedAt: new Date().toISOString(),
        })
      )
      setTransferNote('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Leadman queue</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Transfer Requests</h2>
            <p className="mt-1 text-sm text-slate-400">Approve or discuss requests from workers in your assigned department.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Department</p>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="mt-2 min-w-[220px] rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none">
              {assignedDepartments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search requests..." className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="border-b border-slate-800 px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><BadgeCheck className="h-5 w-5 text-emerald-400" /> Pending Requests</h3>
        </div>
        {departmentTransferRequests.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">No transfer requests for {selectedDepartment}.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {departmentTransferRequests.map((request) => (
              <div key={request.id} className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{request.employeeName}</p>
                  <p className="mt-1 text-sm text-slate-400">{request.employeeId} • wants {request.requestedDepartment}</p>
                  <p className="mt-1 text-xs text-slate-500">Requested {formatDateTime(request.requestedAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => handleTransferAction(request, 'approve')} className="rounded-xl bg-emerald-500 px-4 py-2 font-medium text-black transition-colors hover:bg-emerald-400">Approve</button>
                  <button onClick={() => handleTransferAction(request, 'discuss')} className="rounded-xl bg-slate-800 px-4 py-2 font-medium text-slate-200 transition-colors hover:bg-slate-700">Discuss with admin</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}