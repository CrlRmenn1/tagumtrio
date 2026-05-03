import { Calendar as CalendarIcon, FileText, Briefcase, Megaphone, QrCode, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const QR_PATTERN = Array.from({ length: 36 }, (_, index) => ((index * 7 + 3) % 5) > 1) // QR pattern for modal

export default function EmployeeDashboard() {
  const navigate = useNavigate()
  const [showQrModal, setShowQrModal] = useState(false)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-300 border-4 border-slate-950 shadow-xl">JC</div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-3xl font-bold text-white">Juan Dela Cruz</h2>
            <p className="text-emerald-400 font-medium mt-1">Veneer Operator • Production Dept</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-sm text-slate-400">
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4"/> ID: EMP-001</span>
              <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4"/> Joined: Jan 2025</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-sm text-slate-400">Physical QR codes are scanned by the employee using their mobile device via the Employee Portal.</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Megaphone className="w-5 h-5 text-blue-400"/> Official Announcements</h3>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4 py-1">
                <p className="text-xs text-slate-500 mb-1">May 28, 2026 • Management</p>
                <h4 className="text-slate-200 font-medium">New Safety Protocol in Drying Section</h4>
                <p className="text-sm text-slate-400 mt-1">Please review the updated safety guidelines posted near the main dryers. All operators must comply starting June 1.</p>
              </div>
              <div className="border-l-2 border-slate-700 pl-4 py-1">
                <p className="text-xs text-slate-500 mb-1">May 25, 2026 • HR Dept</p>
                <h4 className="text-slate-200 font-medium">Annual Medical Checkup Schedule</h4>
                <p className="text-sm text-slate-400 mt-1">Schedules for the annual physical exam have been released. Check with your Leadman for your designated slot.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Briefcase className="w-5 h-5 text-emerald-400"/> My Production Logs (Today)</h3>
              <span className="text-emerald-400 font-medium text-sm">Total: 55 Pieces</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <p className="text-slate-200 font-medium">Marine Plywood 3/4"</p>
                  <p className="text-xs text-slate-500">Scanned at 08:45 AM</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">25 pcs</p>
                  <p className="text-xs text-emerald-400">Verified</p>
                </div>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <p className="text-slate-200 font-medium">Marine Plywood 1/2"</p>
                  <p className="text-xs text-slate-500">Scanned at 10:15 AM</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">30 pcs</p>
                  <p className="text-xs text-emerald-400">Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-amber-400"/> Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => navigate('/app/portal/leaves')} className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group"><span className="text-slate-300 font-medium group-hover:text-white">File Leave</span><span className="text-slate-500">→</span></button>
              <button onClick={() => navigate('/app/portal/leaves')} className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group"><span className="text-slate-300 font-medium group-hover:text-white">Request Overtime</span><span className="text-slate-500">→</span></button>
              <button onClick={() => navigate('/app/portal/payslips')} className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors group"><span className="text-slate-300 font-medium group-hover:text-white">View Payslips</span><span className="text-slate-500">→</span></button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upcoming Schedule</h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                  <div className="w-0.5 h-full bg-slate-800 my-1"></div>
                </div>
                <div className="pb-3">
                  <p className="text-sm font-medium text-white">Tomorrow</p>
                  <p className="text-xs text-slate-400">Regular Shift (8:00 AM - 5:00 PM)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-slate-600 mt-2"></div>
                  <div className="w-0.5 h-full bg-transparent my-1"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Friday, May 30</p>
                  <p className="text-xs text-slate-400">Approved Leave</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR display removed — use mobile Employee Portal to scan physical QR codes. */}
    </div>
  )
}

