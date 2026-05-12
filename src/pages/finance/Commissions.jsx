import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpDown, CalendarRange, FilterX, ListFilter, ReceiptText, Users } from 'lucide-react'
import { useQr } from '../../context/qr-context'

export default function Commissions() {
  const { getFinanceRecords, getFinanceEmployees, getFinanceEmployeeHistory, getFinancePayrollCycles, formatDateTime, payrollCycleLabel } = useQr()
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [sortDirection, setSortDirection] = useState('desc')

  const employees = getFinanceEmployees()
  const allRecords = useMemo(() => {
    const records = selectedEmployeeId ? getFinanceEmployeeHistory(selectedEmployeeId) : getFinanceRecords()
    return records.slice().sort((a, b) => {
      const dateCompare = new Date(a.scannedAt) - new Date(b.scannedAt)
      return sortDirection === 'asc' ? dateCompare : -dateCompare
    })
  }, [getFinanceEmployeeHistory, getFinanceRecords, selectedEmployeeId, sortDirection])

  const selectedEmployee = employees.find((employee) => employee.employeeId === selectedEmployeeId)
  const cycles = getFinancePayrollCycles()

  const summary = useMemo(() => {
    return allRecords.reduce(
      (accumulator, record) => {
        accumulator.hours += Number(record.loggedHours || 0)
        accumulator.amount += Number(record.amount || 0)
        accumulator.departments.add(record.department)
        accumulator.employees.add(record.employeeId)
        return accumulator
      },
      { hours: 0, amount: 0, departments: new Set(), employees: new Set() }
    )
  }, [allRecords])

  function clearFilter() {
    setSelectedEmployeeId('')
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 w-full">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
              <ReceiptText className="h-3.5 w-3.5" />
              Finance Payroll Dashboard
            </div>
            <h2 className="text-3xl font-bold text-white">Company payroll and commission logs</h2>
            <p className="text-sm leading-6 text-slate-400">
              View every employee log, sort by name, filter to a single employee, and review the 15-day payroll cycle before release.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[520px]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Employees</p>
              <p className="mt-1 text-xl font-bold text-white">{summary.employees.size || employees.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Logs</p>
              <p className="mt-1 text-xl font-bold text-white">{allRecords.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Hours</p>
              <p className="mt-1 text-xl font-bold text-white">{summary.hours.toFixed(1)}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Amount</p>
              <p className="mt-1 text-xl font-bold text-emerald-400">₱{summary.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Employee salary log</h3>
              <p className="text-sm text-slate-400">Names repeat when employees move departments. Filter any employee to review the exact payroll history.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-[240px] flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5">
                <label className="text-[11px] uppercase tracking-wider text-slate-500">Filter employee</label>
                <select
                  value={selectedEmployeeId}
                  onChange={(event) => setSelectedEmployeeId(event.target.value)}
                  className="mt-1 w-full bg-slate-950 text-sm text-white focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-slate-950 text-white">All employees</option>
                  {employees.map((employee) => (
                    <option key={employee.employeeId} value={employee.employeeId} className="bg-slate-950 text-white">{employee.employeeName}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 hover:border-slate-700"
              >
                <ArrowUpDown className="h-4 w-4" />
                {sortDirection === 'desc' ? 'Newest first' : 'Oldest first'}
              </button>

              <button
                type="button"
                onClick={clearFilter}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 hover:border-slate-700"
              >
                <FilterX className="h-4 w-4" />
                Clear
              </button>

              <Link to="/app/payroll/archive" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-emerald-400">
                <CalendarRange className="h-4 w-4" />
                Archive
              </Link>
            </div>
          </div>

          {selectedEmployee && (
            <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
              Showing full 15-day payroll history for <strong>{selectedEmployee.employeeName}</strong>. Remove the filter to restore the company-wide list.
            </div>
          )}

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Employee</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Hours</th>
                  <th className="px-4 py-3 font-medium">Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 bg-slate-900/50">
                {allRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">No payroll logs available.</td>
                  </tr>
                ) : (
                  allRecords.map((record) => (
                    <tr key={record.id} className="text-slate-300 hover:bg-slate-900/80">
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">{record.employeeName}</div>
                        <div className="text-xs text-slate-500">{record.employeeId}</div>
                      </td>
                      <td className="px-4 py-4">{record.department}</td>
                      <td className="px-4 py-4">
                        <div>{formatDateTime(record.scannedAt)}</div>
                        <div className="text-xs text-slate-500">{payrollCycleLabel(record.scannedAt)}</div>
                      </td>
                      <td className="px-4 py-4">{Number(record.loggedHours || 0).toFixed(1)}</td>
                      <td className="px-4 py-4 font-semibold text-emerald-400">₱{Number(record.amount || 0).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Employee index</h3>
            </div>
            <div className="mt-4 space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {employees.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-6 text-sm text-slate-400">No employees found.</div>
              ) : (
                employees.map((employee) => {
                  const employeeTotal = getFinanceEmployeeHistory(employee.employeeId).reduce((sum, record) => sum + Number(record.amount || 0), 0)
                  return (
                    <button
                      key={employee.employeeId}
                      type="button"
                      onClick={() => setSelectedEmployeeId(employee.employeeId)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${selectedEmployeeId === employee.employeeId ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium text-white">{employee.employeeName}</div>
                          <div className="text-xs text-slate-500">{employee.employeeId}</div>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                          <div>{getFinanceEmployeeHistory(employee.employeeId).length} logs</div>
                          <div className="text-emerald-400 font-semibold">₱{employeeTotal.toLocaleString()}</div>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10">
            <div className="flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">15-day cycle snapshot</h3>
            </div>
            <div className="mt-4 space-y-2">
              {cycles.slice(0, 4).length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-6 text-sm text-slate-400">No cycles available.</div>
              ) : (
                cycles.slice(0, 4).map((cycle) => (
                  <Link key={cycle.key} to={`/app/payroll/archive?cycle=${cycle.key}`} className="block rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 hover:border-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{cycle.label}</div>
                        <div className="text-xs text-slate-500">{cycle.employeeCount} employees • {cycle.records.length} logs</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-emerald-400 font-semibold">₱{cycle.totalAmount.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">{cycle.totalHours.toFixed(1)} hrs</div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}