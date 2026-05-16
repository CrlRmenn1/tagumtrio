import { useEffect, useMemo, useState } from 'react'
import { MessageSquareWarning, Save, Send } from 'lucide-react'
import { useAuth } from '../../context/auth-context'
import { useQr } from '../../context/qr-context'
import { DEPARTMENTS } from '../../constants/departments'

const REPORT_STORAGE_KEY = 'triops-leadman-report-draft'

export default function LeadmanDailyReport() {
  const { user } = useAuth()
  const { formatDateTime } = useQr()

  const assignedDepartments = useMemo(() => {
    if (Array.isArray(user?.departments) && user.departments.length > 0) return user.departments
    if (user?.department) return [user.department]
    return [DEPARTMENTS[0]]
  }, [user?.department, user?.departments])

  const [selectedDepartment, setSelectedDepartment] = useState(assignedDepartments[0])
  const [reportDraft, setReportDraft] = useState('')
  const [reportSavedAt, setReportSavedAt] = useState(null)

  useEffect(() => {
    if (!assignedDepartments.includes(selectedDepartment)) {
      setSelectedDepartment(assignedDepartments[0])
    }
  }, [assignedDepartments, selectedDepartment])

  useEffect(() => {
    if (!user) return
    const key = `${REPORT_STORAGE_KEY}:${user.id}:${selectedDepartment}`
    const saved = window.localStorage.getItem(key)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setReportDraft(parsed.reportDraft || '')
        setReportSavedAt(parsed.reportSavedAt || null)
      } catch {
        setReportDraft('')
        setReportSavedAt(null)
      }
    } else {
      setReportDraft('')
      setReportSavedAt(null)
    }
  }, [selectedDepartment, user])

  function saveDraft() {
    if (!user) return
    const key = `${REPORT_STORAGE_KEY}:${user.id}:${selectedDepartment}`
    const payload = {
      reportDraft,
      reportSavedAt: new Date().toISOString(),
    }
    window.localStorage.setItem(key, JSON.stringify(payload))
    setReportSavedAt(payload.reportSavedAt)
  }

  function submitReport() {
    saveDraft()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Leadman daily log</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Daily Report</h2>
            <p className="mt-1 text-sm text-slate-400">Write and save the end-of-day report for the selected department.</p>
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
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white"><MessageSquareWarning className="h-5 w-5 text-cyan-400" /> Report Draft</h3>
        <p className="text-sm text-slate-400">Record shift updates, issues encountered, and actions taken before submission.</p>
        <textarea
          value={reportDraft}
          onChange={(e) => setReportDraft(e.target.value)}
          rows={10}
          className="w-full resize-none rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 focus:border-emerald-500 focus:outline-none"
          placeholder={`Department: ${selectedDepartment}\nShift summary...\nIssues encountered...\nActions taken...`}
        />
        <div className="flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{reportSavedAt ? `Draft saved at ${formatDateTime(reportSavedAt)}` : 'No draft saved yet.'}</p>
          <div className="flex items-center gap-2">
            <button onClick={saveDraft} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-slate-200 transition-colors hover:bg-slate-700">
              <Save className="h-4 w-4" /> Save Draft
            </button>
            <button onClick={submitReport} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-medium text-black transition-colors hover:bg-emerald-400">
              <Send className="h-4 w-4" /> Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}