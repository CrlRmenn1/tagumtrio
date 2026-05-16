import { useEffect, useMemo, useState } from 'react'
import { BadgeCheck, ClipboardList, ScanLine, Search } from 'lucide-react'
import Portal from '../../components/ui/Portal'
import { useAuth } from '../../context/auth-context'
import { useQr } from '../../context/qr-context'
import { DEPARTMENTS } from '../../constants/departments'

export default function LeadmanDashboard() {
  const { user } = useAuth()
  const { departmentRequests, getLeadmanAttendance, recordAttendanceScan, formatDateTime } = useQr()

  const assignedDepartments = useMemo(() => {
    if (Array.isArray(user?.departments) && user.departments.length > 0) return user.departments
    if (user?.department) return [user.department]
    return [DEPARTMENTS[0]]
  }, [user?.department, user?.departments])

  const [selectedDepartment, setSelectedDepartment] = useState(assignedDepartments[0])
  const [query, setQuery] = useState('')
  const [scanModalOpen, setScanModalOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [hours, setHours] = useState(8)

  useEffect(() => {
    if (!assignedDepartments.includes(selectedDepartment)) {
      setSelectedDepartment(assignedDepartments[0])
    }
  }, [assignedDepartments, selectedDepartment])

  const deployedEmployees = useMemo(() => {
    return departmentRequests
      .filter((request) => request.status === 'approved' && request.requestedDepartment === selectedDepartment)
      .map((request) => ({
        employeeId: request.employeeId,
        employeeName: request.employeeName,
        department: request.requestedDepartment,
        approvedAt: request.leadmanAt,
      }))
      .filter((employee) => employee.employeeName.toLowerCase().includes(query.toLowerCase()) || employee.employeeId.toLowerCase().includes(query.toLowerCase()))
  }, [departmentRequests, query, selectedDepartment])

  const currentScans = useMemo(() => {
    return getLeadmanAttendance(selectedDepartment)
      .filter((record) => record.status === 'leadman_verified')
      .filter((record) => record.employeeName.toLowerCase().includes(query.toLowerCase()) || record.employeeId.toLowerCase().includes(query.toLowerCase()) || record.department.toLowerCase().includes(query.toLowerCase()))
  }, [getLeadmanAttendance, query, selectedDepartment])

  const stats = useMemo(() => {
    return {
      deployed: deployedEmployees.length,
      scans: currentScans.length,
      hours: currentScans.reduce((sum, record) => sum + Number(record.loggedHours || 0), 0),
      pending: departmentRequests.filter((request) => request.requestedDepartment === selectedDepartment && request.status === 'pending').length,
    }
  }, [currentScans, departmentRequests, deployedEmployees.length, selectedDepartment])

  const selectedEmployee = deployedEmployees.find((employee) => employee.employeeId === selectedEmployeeId) || deployedEmployees[0] || null

  useEffect(() => {
    if (deployedEmployees.length === 0) {
      setSelectedEmployeeId('')
      return
    }

    if (!deployedEmployees.some((employee) => employee.employeeId === selectedEmployeeId)) {
      setSelectedEmployeeId(deployedEmployees[0].employeeId)
    }
  }, [deployedEmployees, selectedEmployeeId])

  function handleScanSubmit(event) {
    event.preventDefault()
    if (!selectedEmployee) return
    recordAttendanceScan({
      employeeId: selectedEmployee.employeeId,
      employeeName: selectedEmployee.employeeName,
      department: selectedDepartment,
      loggedHours: Number(hours || 0),
    })
    setScanModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Leadman scanning</p>
            <h2 className="mt-2 text-2xl font-bold text-white">QR Scan Dashboard</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">Use this page to scan deployed workers. Transfer approvals, deployed workers, and the daily report live on separate pages.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Department</p>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="mt-2 w-full min-w-[220px] rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none">
              {assignedDepartments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Deployed workers</p>
            <p className="mt-2 text-2xl font-bold text-white">{stats.deployed}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Scans</p>
            <p className="mt-2 text-2xl font-bold text-white">{stats.scans}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Logged hours</p>
            <p className="mt-2 text-2xl font-bold text-white">{stats.hours.toFixed(1)} hrs</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500">Pending transfers</p>
            <p className="mt-2 text-2xl font-bold text-white">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><ScanLine className="h-5 w-5 text-emerald-400" /> QR Scan</h3>
              <p className="mt-1 text-sm text-slate-400">Open the scan form and select the deployed worker being scanned.</p>
            </div>
            <button onClick={() => setScanModalOpen(true)} disabled={deployedEmployees.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-medium text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
              <ScanLine className="h-4 w-4" /> Start Scan
            </button>
          </div>

          <div className="mt-5 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search deployed workers..." className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>

          <div className="mt-5 space-y-3">
            {deployedEmployees.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">No deployed employees in {selectedDepartment} yet.</div>
            ) : (
              deployedEmployees.map((employee) => (
                <button key={employee.employeeId} onClick={() => { setSelectedEmployeeId(employee.employeeId); setScanModalOpen(true) }} className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 text-left transition-colors hover:border-slate-700 hover:bg-slate-900">
                  <div>
                    <p className="font-medium text-white">{employee.employeeName}</p>
                    <p className="mt-1 text-sm text-slate-400">{employee.employeeId} • approved {formatDateTime(employee.approvedAt)}</p>
                  </div>
                  <span className="text-xs uppercase tracking-widest text-slate-500">Tap to scan</span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><BadgeCheck className="h-5 w-5 text-cyan-400" /> Recent Scans</h3>
            <div className="mt-4 space-y-3">
              {currentScans.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">No scans recorded yet.</div>
              ) : (
                currentScans.slice(0, 4).map((record) => (
                  <div key={record.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className="font-medium text-white">{record.employeeName}</p>
                    <p className="mt-1 text-sm text-slate-400">{record.department} • {formatDateTime(record.scannedAt)}</p>
                    <p className="mt-1 text-sm text-emerald-300">{Number(record.loggedHours || 0).toFixed(1)} hrs</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><ClipboardList className="h-5 w-5 text-amber-400" /> What moves out</h3>
            <p className="mt-3 text-sm text-slate-400">Transfer approvals, deployed workers, and daily reports are now on their own pages in the left menu.</p>
          </div>
        </div>
      </div>

      {scanModalOpen && (
        <Portal>
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
            <form onSubmit={handleScanSubmit} className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <button type="button" onClick={() => setScanModalOpen(false)} className="absolute right-5 top-5 text-slate-400 hover:text-white">
                ×
              </button>
              <h3 className="text-lg font-bold text-white">Start QR Scan</h3>
              <p className="mt-1 text-sm text-slate-400">Select a deployed employee and record the hours for this scan.</p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm text-slate-300">Employee</label>
                  <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none">
                    {deployedEmployees.map((employee) => (
                      <option key={employee.employeeId} value={employee.employeeId}>{employee.employeeName} • {employee.employeeId}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-300">Hours</label>
                  <input value={hours} onChange={(e) => setHours(e.target.value)} type="number" min="0" step="0.5" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white focus:border-emerald-500 focus:outline-none" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setScanModalOpen(false)} className="rounded-xl bg-slate-800 px-4 py-2.5 text-slate-200 transition-colors hover:bg-slate-700">Cancel</button>
                  <button type="submit" className="rounded-xl bg-emerald-500 px-4 py-2.5 font-medium text-black transition-colors hover:bg-emerald-400">Record Scan</button>
                </div>
              </div>
            </form>
          </div>
        </Portal>
      )}
    </div>
  )
}