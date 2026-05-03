import { useQr } from '../../context/qr-context'
import { useAuth } from '../../context/auth-context'

export default function LeadmanDashboard() {
  const { qrs, approveByLeadman } = useQr()
  const { user } = useAuth()

  const pending = qrs.filter(q => q.status === 'pending' && (!user?.department || q.department === user.department))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Leadman: Incoming Scans</h2>
        <p className="text-slate-400 mt-1">Approve scanned QR entries before sending to Head.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        {pending.length === 0 ? (
          <div className="text-slate-400 p-6 text-center">No pending scans — waiting for operators to scan.</div>
        ) : (
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <div className="text-sm text-slate-400">{r.id} • {new Date(r.submittedAt).toLocaleTimeString()}</div>
                  <div className="text-white font-medium">{r.workerName} — {r.product} ({r.pieces} pcs)</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => approveByLeadman(r.id, user?.id || 'LD-001')} className="px-3 py-2 bg-emerald-500 text-black rounded font-medium">Approve</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
