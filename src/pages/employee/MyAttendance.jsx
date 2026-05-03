import { useState } from 'react'
import { Plus, ArrowLeft, Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, Clock4 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MOCK_REQUESTS = [
  { id: 'REQ-01', type: 'Leave', date: 'May 30, 2026', reason: 'Personal Matter', status: 'Approved' },
  { id: 'REQ-02', type: 'Overtime', date: 'May 25, 2026', duration: '2 hours', reason: 'Target volume not met', status: 'Approved' },
  { id: 'REQ-03', type: 'Leave', date: 'Jun 05, 2026', reason: 'Medical Appointment', status: 'Pending' },
  { id: 'REQ-04', type: 'Overtime', date: 'May 20, 2026', duration: '1 hour', reason: 'Machine Maintenance', status: 'Rejected' },
]

export default function MyAttendance() {
  const [activeTab, setActiveTab] = useState('history')
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="mb-2">
            <button onClick={() => navigate('/app/portal')} className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white">Leaves & Overtime</h2>
          <p className="text-slate-400 text-sm mt-1">Manage your requests and track their approval status.</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button onClick={() => setActiveTab('history')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'history' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}>History</button>
          <button onClick={() => setActiveTab('new')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'new' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}>New Request</button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Request ID</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Date / Details</th>
                  <th className="px-6 py-4 font-medium">Reason</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {MOCK_REQUESTS.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/20 transition-colors text-slate-300">
                    <td className="px-6 py-4 font-medium">{req.id}</td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${req.type === 'Leave' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{req.type === 'Leave' ? <CalendarIcon className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}{req.type}</span></td>
                    <td className="px-6 py-4">{req.date}{req.duration && <span className="block text-xs text-slate-500 mt-0.5">{req.duration}</span>}</td>
                    <td className="px-6 py-4">{req.reason}</td>
                    <td className="px-6 py-4 text-right">{req.status === 'Approved' && <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-4 h-4"/> Approved</span>}{req.status === 'Pending' && <span className="inline-flex items-center gap-1 text-amber-400"><Clock4 className="w-4 h-4"/> Pending</span>}{req.status === 'Rejected' && <span className="inline-flex items-center gap-1 text-rose-400"><XCircle className="w-4 h-4"/> Rejected</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 max-w-2xl">
          <div className="mb-4">
            <button onClick={() => navigate('/app/portal')} className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setActiveTab('history'); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Request Type</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500">
                  <option>Leave of Absence</option>
                  <option>Overtime</option>
                  <option>Change Schedule</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Target Date</label>
                <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 [color-scheme:dark]" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Reason</label>
              <textarea rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 resize-none" placeholder="Provide a brief explanation for your request..."></textarea>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button type="button" onClick={() => setActiveTab('history')} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2"><Plus className="w-4 h-4"/> Submit Request</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

