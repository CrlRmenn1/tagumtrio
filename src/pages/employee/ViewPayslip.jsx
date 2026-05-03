import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, FileText } from 'lucide-react'

const MOCK_PAYSLIPS = [
  { id: 'PAY-2026-05B', period: 'May 16 - 31, 2026', date: 'June 05, 2026', net: '₱ 8,450.00', status: 'Available', details: 'Regular pay period. Employer contributions included.' },
  { id: 'PAY-2026-05A', period: 'May 01 - 15, 2026', date: 'May 20, 2026', net: '₱ 8,120.00', status: 'Available', details: 'Regular pay period.' },
  { id: 'PAY-2026-04B', period: 'Apr 16 - 30, 2026', date: 'May 05, 2026', net: '₱ 8,600.00', status: 'Available', details: 'Includes overtime.' },
  { id: 'PAY-2026-04A', period: 'Apr 01 - 15, 2026', date: 'Apr 20, 2026', net: '₱ 8,300.00', status: 'Available', details: 'Regular pay period.' },
]

export default function ViewPayslip() {
  const { id } = useParams()
  const navigate = useNavigate()
  const payslip = MOCK_PAYSLIPS.find(p => p.id === id) || { id, period: 'Unknown', date: '-', net: '-', details: 'No details available.' }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <button onClick={() => navigate('/app/portal/payslips')} className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-4"><ArrowLeft className="w-4 h-4"/> Back</button>
        <h2 className="text-2xl font-bold text-white">Payslip • {payslip.period}</h2>
        <p className="text-slate-400 text-sm mt-1">Distributed: {payslip.date} — Net: <span className="text-emerald-400 font-medium">{payslip.net}</span></p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-medium">{payslip.id}</h3>
            <p className="text-sm text-slate-400 mt-2">{payslip.details}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button className="px-4 py-2 bg-emerald-500 text-black rounded font-medium flex items-center gap-2"><Download className="w-4 h-4"/> Download PDF</button>
          <button onClick={() => navigate('/app/portal/payslips')} className="px-4 py-2 bg-slate-800 text-slate-200 rounded">Close</button>
        </div>
      </div>
    </div>
  )
}
