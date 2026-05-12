import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Calendar as CalendarIcon, Clock3, FileText, Megaphone, BadgeCheck, TimerReset, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/auth-context'
import { useQr } from '../../context/qr-context'
import { DEPARTMENTS } from '../../constants/departments'

export default function EmployeeDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    submitDepartmentRequest,
    getEmployeeDepartment,
    getEmployeeDepartmentRequests,
    getEmployeeTotals,
    formatDateTime,
    getEmployeeAttendance,
  } = useQr()

  const [requestedDepartment, setRequestedDepartment] = useState('Production')
  const currentDepartment = getEmployeeDepartment(user?.id)
  const departmentRequests = getEmployeeDepartmentRequests(user?.id)
  const totals = getEmployeeTotals(user?.id)
  const attendance = getEmployeeAttendance(user?.id)
  const latestRecord = totals.latestRecord
  const approvedRequests = departmentRequests.filter((request) => request.status === 'approved')
  const pendingRequests = departmentRequests.filter((request) => request.status === 'pending')

  const currentPeriodHours = useMemo(() => {
    return attendance
      .filter((record) => record.status === 'head_verified')
      .reduce((sum, record) => sum + Number(record.loggedHours || 0), 0)
  }, [attendance])

  function handleDepartmentRequest(event) {
    event.preventDefault()
    if (!requestedDepartment || !user) return
    submitDepartmentRequest({
      employeeId: user.id,
      employeeName: user.name,
      requestedDepartment,
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 pointer-events-none"></div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-300 border-4 border-slate-950 shadow-xl">JD</div>
            <div>
              <h2 className="text-3xl font-bold text-white">{user?.name || 'Employee'}</h2>
              <p className="text-emerald-400 font-medium mt-1">{currentDepartment ? `${currentDepartment} Department` : 'Department not yet assigned'}</p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> ID: {user?.id || '—'}</span>
                <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> Current hour log sync</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 text-sm text-slate-300 max-w-md">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="font-medium text-white">Workflow update</p>
              <p className="text-slate-400 mt-1">Employees select a department here. Leadman accepts the request, then leadman scans your QR during work. You only keep leave requests, work history, and payslips.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Total Logged Hours</p>
          <p className="text-2xl font-bold text-white mt-2">{currentPeriodHours.toFixed(1)} hrs</p>
          <p className="text-sm text-slate-400 mt-1">Auto-added from leadman scans</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Latest Scan</p>
          <p className="text-lg font-semibold text-white mt-2">{latestRecord ? formatDateTime(latestRecord.scannedAt) : 'No scan yet'}</p>
          <p className="text-sm text-slate-400 mt-1">Leadman scan time shown exactly</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Current Status</p>
          <p className="text-lg font-semibold text-white mt-2">{pendingRequests.length > 0 ? 'Waiting for Leadman' : currentDepartment ? 'Active' : 'Unassigned'}</p>
          <p className="text-sm text-slate-400 mt-1">Department request and approval</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Approved Requests</p>
          <p className="text-2xl font-bold text-white mt-2">{approvedRequests.length}</p>
          <p className="text-sm text-slate-400 mt-1">Department changes accepted</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><BadgeCheck className="w-5 h-5 text-emerald-400" /> Department Request</h3>
              <span className="text-sm text-slate-400">Notifies your leadman</span>
            </div>
            <form onSubmit={handleDepartmentRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Select Department</label>
                  <select value={requestedDepartment} onChange={(e) => setRequestedDepartment(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500">
                    {DEPARTMENTS.map((department) => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Current Department</label>
                  <div className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white min-h-[44px] flex items-center">
                    {currentDepartment || 'No active department yet'}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm text-slate-400">Once submitted, your leadman will approve your placement before scans are logged.</p>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg font-medium transition-colors">
                  Send Request <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Clock3 className="w-5 h-5 text-cyan-400" /> Work History</h3>
              <span className="text-sm text-slate-400">Detailed hours and scan times</span>
            </div>
            {attendance.filter((record) => record.status === 'head_verified').length === 0 ? (
              <div className="text-slate-400 p-4 rounded-lg border border-slate-800">No verified work history yet.</div>
            ) : (
              <div className="space-y-3">
                {attendance
                  .filter((record) => record.status === 'head_verified')
                  .map((record) => (
                    <div key={record.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-white font-medium">{record.department}</p>
                        <p className="text-sm text-slate-400">Scanned at {formatDateTime(record.scannedAt)}</p>
                        <p className="text-xs text-slate-500 mt-1">Leadman verified {formatDateTime(record.leadmanVerifiedAt)} • Head verified {formatDateTime(record.headVerifiedAt)}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-white font-semibold">{Number(record.loggedHours || 0).toFixed(1)} hrs</p>
                        <p className="text-emerald-400 text-sm">₱{Number(record.amount || 0).toLocaleString()} earned</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-amber-400" /> Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => navigate('/app/portal/leaves')} className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group">
                <span className="text-slate-300 font-medium group-hover:text-white">File Leave</span>
                <span className="text-slate-500">→</span>
              </button>
              <button onClick={() => navigate('/app/portal/payslips')} className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group">
                <span className="text-slate-300 font-medium group-hover:text-white">View Payslips</span>
                <span className="text-slate-500">→</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><TimerReset className="w-5 h-5 text-emerald-400" /> Current Summary</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <p>Total approved hours: <span className="text-white">{totals.totalHours.toFixed(1)} hrs</span></p>
              <p>Total earned: <span className="text-white">₱{totals.totalAmount.toLocaleString()}</span></p>
              <p>Latest scanned department: <span className="text-white">{latestRecord?.department || 'None'}</span></p>
              <p>Employee requests for department changes are listed here and sent to leadman.</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Request Status</h3>
            {departmentRequests.length === 0 ? (
              <div className="text-slate-400 text-sm">No department requests submitted yet.</div>
            ) : (
              <div className="space-y-3">
                {departmentRequests.map((request) => (
                  <div key={request.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-white font-medium">{request.requestedDepartment}</p>
                        <p className="text-xs text-slate-500">{formatDateTime(request.requestedAt)}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${request.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
