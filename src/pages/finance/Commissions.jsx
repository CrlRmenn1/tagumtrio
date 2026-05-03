import { useQr } from '../../context/qr-context'

export default function Commissions() {
  const { qrs } = useQr()
  // Show records that have been approved by head
  const approved = qrs.filter(q => q.status === 'head_approved')
  const ratePerPiece = 10 // PHP per piece commission (demo)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white">Commissions — Head Approved</h2>
        <p className="text-slate-400 mt-1">List of verified production entries with computed commissions for finance review.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        {approved.length === 0 ? (
          <div className="text-slate-400 p-6 text-center">No approved entries yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Worker</th>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Pieces</th>
                  <th className="px-6 py-3 font-medium">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {approved.map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/20 transition-colors text-slate-300">
                    <td className="px-6 py-4 font-medium">{r.id}</td>
                    <td className="px-6 py-4">{r.workerName}</td>
                    <td className="px-6 py-4">{r.product}</td>
                    <td className="px-6 py-4">{r.pieces}</td>
                    <td className="px-6 py-4">₱{(Number(r.pieces) * ratePerPiece).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
