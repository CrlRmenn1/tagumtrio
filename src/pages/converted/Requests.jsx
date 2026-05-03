import { FileText, CheckCircle, XCircle, Clock, ArrowRightLeft } from 'lucide-react'

const requests = [
  { id: 'REQ-001', type: 'Leave', employee: 'Juan Dela Cruz', date: 'May 20 - May 22, 2026', reason: 'Medical Leave', status: 'Pending' },
  { id: 'REQ-002', type: 'Transfer', employee: 'Maria Clara', date: 'May 15, 2026', reason: 'Transfer from Drying to Gluing', status: 'Approved' },
  { id: 'REQ-003', type: 'Overtime', employee: 'Pedro Penduko', date: 'May 10, 2026', reason: 'Target Production Catch-up', status: 'Pending' },
  { id: 'REQ-004', type: 'Leave', employee: 'Jose Rizal', date: 'May 12, 2026', reason: 'Personal Matter', status: 'Rejected' },
]

export default function Requests() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Requests & Transfers</h2>
        <p className="text-slate-400 mt-1">Manage employee leaves, overtimes, and department transfers.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button className="bg-slate-900 border border-emerald-500/30 px-4 py-2 rounded-lg text-emerald-400 text-sm font-medium hover:bg-emerald-500/10 transition-colors">All Requests</button>
        <button className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-slate-400 text-sm font-medium hover:bg-slate-800 transition-colors">Leaves</button>
        <button className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-slate-400 text-sm font-medium hover:bg-slate-800 transition-colors">Transfers</button>
        <button className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-slate-400 text-sm font-medium hover:bg-slate-800 transition-colors">Overtime</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex gap-4">
              <div className={`p-3 rounded-xl h-fit ${
                req.type === 'Leave' ? 'bg-rose-500/10 text-rose-400' : req.type === 'Transfer' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {req.type === 'Leave' ? <FileText className="w-6 h-6" /> : req.type === 'Transfer' ? <ArrowRightLeft className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">{req.employee}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    req.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>{req.status}</span>
                </div>
                <div className="text-sm text-slate-400 mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span><strong className="text-slate-300">Type:</strong> {req.type} Request</span>
                  <span className="hidden sm:inline text-slate-600">•</span>
                  <span><strong className="text-slate-300">Date:</strong> {req.date}</span>
                </div>
                <p className="text-sm text-slate-300 mt-2 bg-slate-950 p-2 rounded border border-slate-800/50">{req.reason}</p>
              </div>
            </div>

            {req.status === 'Pending' && (
              <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-emerald-500/20"><CheckCircle className="w-4 h-4" />Approve</button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-rose-500/20"><XCircle className="w-4 h-4" />Reject</button>
              </div>
            )}

            {req.status !== 'Pending' && <div className="text-sm font-medium text-slate-500 px-4">Processed</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
