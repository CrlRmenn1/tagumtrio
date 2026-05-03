import { Download, Eye, FileText } from "lucide-react";

const MOCK_PAYSLIPS = [
  { id: "PAY-2026-05B", period: "May 16 - 31, 2026", date: "June 05, 2026", net: "₱ 8,450.00", status: "Available" },
  { id: "PAY-2026-05A", period: "May 01 - 15, 2026", date: "May 20, 2026", net: "₱ 8,120.00", status: "Available" },
  { id: "PAY-2026-04B", period: "Apr 16 - 30, 2026", date: "May 05, 2026", net: "₱ 8,600.00", status: "Available" },
  { id: "PAY-2026-04A", period: "Apr 01 - 15, 2026", date: "Apr 20, 2026", net: "₱ 8,300.00", status: "Available" },
];

export function EmployeePayslips() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Payslips</h2>
        <p className="text-slate-400 text-sm mt-1">View and download your recent payslips securely.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {MOCK_PAYSLIPS.map((payslip) => (
          <div key={payslip.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row gap-4 justify-between group hover:border-slate-700 transition-colors">
            <div className="flex gap-4 items-start">
              <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-medium">{payslip.period}</h3>
                <p className="text-sm text-slate-400 mt-0.5">Distributed: {payslip.date}</p>
                <p className="text-emerald-400 font-bold mt-2">{payslip.net}</p>
              </div>
            </div>
            
            <div className="flex sm:flex-col gap-2 justify-end sm:justify-start border-t border-slate-800 sm:border-0 pt-4 sm:pt-0 mt-4 sm:mt-0">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-300 hover:text-white hover:border-slate-700 transition-colors">
                <Eye className="w-4 h-4" /> View
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/20 transition-colors">
                <Download className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center mt-8">
        <p className="text-slate-400 text-sm">Showing records for the year 2026. For older payslips, please contact HR.</p>
      </div>
    </div>
  );
}
