import { useEffect, useState } from 'react'
import { QRContext } from './qr-context'
import { DEPARTMENTS } from '../constants/departments'
import { enqueueScan, pendingCount, trySyncOnce } from '../lib/offline/queue'

const STORAGE_KEY = 'triops-demo-state'

const DEPARTMENT_RATES = {
  Sundry: 70,
  Sorting: 70,
  Assembly: 70,
  'Cold Press': 75,
  Repair: 70,
  'Hot Press': 75,
  Putty: 68,
  Sunder: 70,
  Spreadersizer: 72,
  'Packing/Classifying': 70,
  'Putty Make Up': 68,
  'Sand Paper': 70,
  'Paint Black': 72,
  Bundle: 70,
  Logo: 70,
}

const COMPANY_EMPLOYEES = [
  { employeeId: 'EMP-001', employeeName: 'Juan Dela Cruz', department: 'Sundry', role: 'Line Worker' },
  { employeeId: 'EMP-002', employeeName: 'Maria Santos', department: 'Sorting', role: 'Sorter' },
  { employeeId: 'EMP-003', employeeName: 'Pedro Reyes', department: 'Assembly', role: 'Assembler' },
  { employeeId: 'EMP-004', employeeName: 'Ana Lim', department: 'Cold Press', role: 'Press Operator' },
  { employeeId: 'EMP-005', employeeName: 'Jose Cruz', department: 'Repair', role: 'Repair Technician' },
  { employeeId: 'EMP-006', employeeName: 'Liza Fernandez', department: 'Hot Press', role: 'Press Operator' },
  { employeeId: 'EMP-007', employeeName: 'Mark Villanueva', department: 'Putty', role: 'Putty Specialist' },
  { employeeId: 'EMP-008', employeeName: 'Grace Navarro', department: 'Sunder', role: 'Sunder Operator' },
  { employeeId: 'EMP-009', employeeName: 'Anton dela Pena', department: 'Spreadersizer', role: 'Machine Operator' },
  { employeeId: 'EMP-010', employeeName: 'Mia Torres', department: 'Packing/Classifying', role: 'Classifier' },
  { employeeId: 'EMP-011', employeeName: 'Carlo Mendoza', department: 'Putty Make Up', role: 'Putty Mixer' },
  { employeeId: 'EMP-012', employeeName: 'Nina Bautista', department: 'Sand Paper', role: 'Sanding Crew' },
  { employeeId: 'EMP-013', employeeName: 'Ramon Flores', department: 'Paint Black', role: 'Painter' },
  { employeeId: 'EMP-014', employeeName: 'Ivy Castillo', department: 'Bundle', role: 'Bundler' },
  { employeeId: 'EMP-015', employeeName: 'Leo Gutierrez', department: 'Logo', role: 'Branding Crew' },
  { employeeId: 'EMP-016', employeeName: 'Carmela Soriano', department: 'Sorting', role: 'Sorter' },
  { employeeId: 'EMP-017', employeeName: 'Renzo Ponce', department: 'Assembly', role: 'Assembler' },
  { employeeId: 'EMP-018', employeeName: 'Bea Ramos', department: 'Cold Press', role: 'Press Assistant' },
  { employeeId: 'EMP-019', employeeName: 'Jomar Dizon', department: 'Repair', role: 'Repair Technician' },
  { employeeId: 'EMP-020', employeeName: 'Clara Gonzales', department: 'Hot Press', role: 'Press Assistant' },
]

function buildDemoDepartmentRequests() {
  return COMPANY_EMPLOYEES.map((employee, index) => ({
    id: `REQ-${100 + index}`,
    employeeId: employee.employeeId,
    employeeName: employee.employeeName,
    requestedDepartment: employee.department,
    status: index >= 15 ? 'pending' : 'approved',
    requestedAt: new Date(2026, 4, Math.max(1, (index % 14) + 1), 8, 15 + index).toISOString(),
    leadmanId: index >= 15 ? undefined : 'LD-001',
    leadmanAt: index >= 15 ? undefined : new Date(2026, 4, Math.max(1, (index % 14) + 1), 8, 40 + index).toISOString(),
  }))
}

function buildDemoAttendanceRecords() {
  return COMPANY_EMPLOYEES.flatMap((employee, index) => {
    const departmentRate = DEPARTMENT_RATES[employee.department] ?? 70
    const firstDate = new Date(2026, 4, Math.max(1, (index % 14) + 1), 7, 30 + index)
    const secondDate = new Date(2026, 4, 16 + (index % 10), 7, 45 + index)
    const thirdDate = new Date(2026, 4, 10 + (index % 12), 7, 50 + index)

    return [
      {
        id: `ATD-${100 + index * 3}`,
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        department: employee.department,
        loggedHours: 4 + (index % 5),
        scannedAt: firstDate.toISOString(),
        leadmanId: 'LD-001',
        leadmanVerifiedAt: firstDate.toISOString(),
        headId: 'PRD-HEAD',
        headVerifiedAt: new Date(firstDate.getTime() + 35 * 60000).toISOString(),
        status: 'head_verified',
        rate: departmentRate,
        amount: Number(4 + (index % 5)) * departmentRate,
      },
      {
        id: `ATD-${101 + index * 3}`,
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        department: COMPANY_EMPLOYEES[(index + 1) % COMPANY_EMPLOYEES.length].department,
        loggedHours: 6 + (index % 4),
        scannedAt: secondDate.toISOString(),
        leadmanId: 'LD-001',
        leadmanVerifiedAt: secondDate.toISOString(),
        headId: 'PRD-HEAD',
        headVerifiedAt: new Date(secondDate.getTime() + 40 * 60000).toISOString(),
        status: 'head_verified',
        rate: DEPARTMENT_RATES[COMPANY_EMPLOYEES[(index + 1) % COMPANY_EMPLOYEES.length].department] ?? departmentRate,
        amount: Number(6 + (index % 4)) * (DEPARTMENT_RATES[COMPANY_EMPLOYEES[(index + 1) % COMPANY_EMPLOYEES.length].department] ?? departmentRate),
      },
      {
        id: `ATD-${102 + index * 3}`,
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        department: employee.department,
        loggedHours: 8,
        scannedAt: thirdDate.toISOString(),
        leadmanId: 'LD-001',
        leadmanVerifiedAt: thirdDate.toISOString(),
        headId: 'PRD-HEAD',
        headVerifiedAt: new Date(thirdDate.getTime() + 45 * 60000).toISOString(),
        status: 'head_verified',
        rate: departmentRate,
        amount: 8 * departmentRate,
      },
    ]
  })
}

function buildDemoPayments(attendanceRecords) {
  const cycles = attendanceRecords.filter((record) => record.status === 'head_verified').slice(0, 8)
  return cycles.map((record, index) => ({
    id: `PAY-${100 + index}`,
    employeeId: record.employeeId,
    period: payrollCycleKey(record.scannedAt),
    amount: record.amount,
    releasedAt: new Date(new Date(record.scannedAt).getTime() + 24 * 60 * 60000).toISOString(),
    releasedBy: 'FIN-001',
  }))
}

const DEFAULT_STATE = {
  departmentRequests: buildDemoDepartmentRequests(),
  attendanceRecords: buildDemoAttendanceRecords(),
  payments: buildDemoPayments(buildDemoAttendanceRecords()),
  leaveRequests: [],
}

function loadState() {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    return {
      departmentRequests: Array.isArray(parsed.departmentRequests) ? parsed.departmentRequests : DEFAULT_STATE.departmentRequests,
      attendanceRecords: Array.isArray(parsed.attendanceRecords) ? parsed.attendanceRecords : DEFAULT_STATE.attendanceRecords,
      payments: Array.isArray(parsed.payments) ? parsed.payments : DEFAULT_STATE.payments,
    }
  } catch {
    return DEFAULT_STATE
  }
}

function periodKey(dateValue) {
  const date = new Date(dateValue)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function periodLabel(dateValue) {
  const date = new Date(dateValue)
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

function payrollCycleKey(dateValue) {
  const date = new Date(dateValue)
  const cycle = date.getDate() <= 15 ? '1' : '2'
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${cycle}`
}

function payrollCycleLabel(dateValue) {
  const date = new Date(dateValue)
  const day = date.getDate() <= 15 ? '1-15' : '16-end'
  return `${date.toLocaleString('en-US', { month: 'long', year: 'numeric' })} • ${day}`
}

function formatDateTime(dateValue) {
  return new Date(dateValue).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function QRProvider({ children }) {
  const initialState = loadState()
  const [departmentRequests, setDepartmentRequests] = useState(initialState.departmentRequests)
  const [attendanceRecords, setAttendanceRecords] = useState(initialState.attendanceRecords)
  const [payments, setPayments] = useState(initialState.payments || [])
  const [leaveRequests, setLeaveRequests] = useState(initialState.leaveRequests || [])
  const [syncPending, setSyncPending] = useState(0)

  // device id for offline records
  useEffect(() => {
    if (typeof window === 'undefined') return
    let did = window.localStorage.getItem('tagum_device_id')
    if (!did) {
      did = `DEV-${Math.random().toString(36).slice(2, 9)}`
      window.localStorage.setItem('tagum_device_id', did)
    }
  }, [])

  async function refreshPendingCount() {
    try {
      const c = await pendingCount()
      setSyncPending(c)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    refreshPendingCount()
    function onlineHandler() {
      // try to sync when back online
      trySyncOnce().then(() => refreshPendingCount())
    }
    window.addEventListener('online', onlineHandler)
    const interval = setInterval(() => trySyncOnce().then(() => refreshPendingCount()), 1000 * 60)
    return () => {
      window.removeEventListener('online', onlineHandler)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ departmentRequests, attendanceRecords, payments, leaveRequests }))
  }, [departmentRequests, attendanceRecords, payments, leaveRequests])

  function submitDepartmentRequest(record) {
    const id = `REQ-${Date.now()}`
    const payload = {
      id,
      ...record,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    }
    setDepartmentRequests((current) => [payload, ...current])
    return id
  }

  function approveDepartmentRequest(id, leadmanId) {
    setDepartmentRequests((current) => current.map((request) => (
      request.id === id
        ? { ...request, status: 'approved', leadmanId, leadmanAt: new Date().toISOString() }
        : request
    )))
  }

  function recordAttendanceScan(record) {
    const departmentRate = DEPARTMENT_RATES[record.department] ?? 70
    const id = `ATD-${Date.now()}`
    const payload = {
      id,
      ...record,
      status: 'leadman_verified',
      leadmanVerifiedAt: new Date().toISOString(),
      rate: record.rate ?? departmentRate,
      amount: Number(record.loggedHours || 0) * Number(record.rate ?? departmentRate),
    }
    setAttendanceRecords((current) => [payload, ...current])
    // enqueue for offline sync
    try {
      const deviceId = window.localStorage.getItem('tagum_device_id')
      enqueueScan({ id: payload.id, leadmanId: payload.leadmanId, raw: null, meta: payload, scannedAt: payload.leadmanVerifiedAt, deviceId })
        .then(() => refreshPendingCount())
        .catch(() => {})
    } catch (e) {
      // ignore in non-browser
    }
    return id
  }

  function approveAttendanceByHead(id, headId) {
    setAttendanceRecords((current) => current.map((record) => (
      record.id === id
        ? { ...record, status: 'head_verified', headId, headVerifiedAt: new Date().toISOString() }
        : record
    )))
  }

  function submitScan(record) {
    const id = recordAttendanceScan(record)
    // try immediate sync if online
    try {
      trySyncOnce().then(() => refreshPendingCount())
    } catch {}
    return id
  }

  function approveByLeadman(id, leadmanId) {
    approveDepartmentRequest(id, leadmanId)
  }

  function approveByHead(id, headId) {
    approveAttendanceByHead(id, headId)
  }

  function clearAll() {
    setDepartmentRequests([])
    setAttendanceRecords([])
    setPayments([])
    setLeaveRequests([])
  }

  function getEmployeeDepartment(employeeId) {
    const approvedRequests = departmentRequests
      .filter((request) => request.employeeId === employeeId && request.status === 'approved')
      .sort((a, b) => new Date(b.leadmanAt || b.requestedAt) - new Date(a.leadmanAt || a.requestedAt))
    return approvedRequests[0]?.requestedDepartment || null
  }

  function getEmployeeDepartmentRequests(employeeId) {
    return departmentRequests.filter((request) => request.employeeId === employeeId)
  }

  function getEmployeeLeaveRequests(employeeId) {
    return leaveRequests.filter((r) => r.employeeId === employeeId)
  }

  function submitLeaveRequest(record) {
    const id = `LEAVE-${Date.now()}`
    const payload = {
      id,
      ...record,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    }
    setLeaveRequests((cur) => [payload, ...cur])
    return id
  }

  function getLeadmanDepartmentRequests(department) {
    return departmentRequests.filter((request) => request.status === 'pending' && request.requestedDepartment === department)
  }

  function getEmployeeAttendance(employeeId) {
    return attendanceRecords.filter((record) => record.employeeId === employeeId)
  }

  function getLeadmanAttendance(department) {
    return attendanceRecords.filter((record) => record.department === department && record.status !== 'head_verified')
  }

  function getHeadPendingAttendance() {
    return attendanceRecords.filter((record) => record.status === 'leadman_verified')
  }

  function getFinanceAttendance() {
    return attendanceRecords.filter((record) => record.status === 'head_verified')
  }

  function getFinanceRecords() {
    return getFinanceAttendance().slice().sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt))
  }

  function getFinanceEmployees() {
    const employees = getFinanceAttendance().reduce((accumulator, record) => {
      if (!accumulator[record.employeeId]) {
        accumulator[record.employeeId] = {
          employeeId: record.employeeId,
          employeeName: record.employeeName,
        }
      }
      return accumulator
    }, {})

    return Object.values(employees).sort((a, b) => a.employeeName.localeCompare(b.employeeName))
  }

  function getFinanceEmployeeHistory(employeeId) {
    return getFinanceRecords().filter((record) => record.employeeId === employeeId)
  }

  function getFinancePayrollCycles() {
    const grouped = getFinanceAttendance().reduce((accumulator, record) => {
      const key = payrollCycleKey(record.scannedAt)
      if (!accumulator[key]) {
        accumulator[key] = {
          key,
          label: payrollCycleLabel(record.scannedAt),
          records: [],
        }
      }
      accumulator[key].records.push(record)
      return accumulator
    }, {})

    return Object.values(grouped)
      .map((cycle) => ({
        ...cycle,
        totalHours: cycle.records.reduce((sum, record) => sum + Number(record.loggedHours || 0), 0),
        totalAmount: cycle.records.reduce((sum, record) => sum + Number(record.amount || 0), 0),
        employeeCount: new Set(cycle.records.map((record) => record.employeeId)).size,
        latestDate: cycle.records[0]?.scannedAt,
      }))
      .sort((a, b) => new Date(b.latestDate || 0) - new Date(a.latestDate || 0))
  }

  function getFinancePayrollCycle(key) {
    const records = getFinanceAttendance().filter((record) => payrollCycleKey(record.scannedAt) === key)
    return {
      key,
      records: records.slice().sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt)),
      totalHours: records.reduce((sum, record) => sum + Number(record.loggedHours || 0), 0),
      totalAmount: records.reduce((sum, record) => sum + Number(record.amount || 0), 0),
      employeeCount: new Set(records.map((record) => record.employeeId)).size,
    }
  }

  function getPayslipPeriods(employeeId) {
    const records = getEmployeeAttendance(employeeId).filter((record) => record.status === 'head_verified')
    const grouped = records.reduce((accumulator, record) => {
      const key = payrollCycleKey(record.scannedAt)
      if (!accumulator[key]) {
        accumulator[key] = { key, label: payrollCycleLabel(record.scannedAt), records: [] }
      }
      accumulator[key].records.push(record)
      return accumulator
    }, {})

    return Object.values(grouped)
      .map((period) => {
        const totalHours = period.records.reduce((sum, record) => sum + Number(record.loggedHours || 0), 0)
        const totalAmount = period.records.reduce((sum, record) => sum + Number(record.amount || 0), 0)
        return {
          ...period,
          totalHours,
          totalAmount,
          recordCount: period.records.length,
          latestDate: period.records[0]?.scannedAt,
        }
      })
      .sort((a, b) => new Date(b.latestDate || 0) - new Date(a.latestDate || 0))
  }

  function markPayslipReleased(employeeId, periodCycleKey, financeId) {
    const period = getPayslipPeriod(employeeId, periodCycleKey)
    const amount = period.totalAmount || 0
    const id = `PAY-${Date.now()}`
    const payload = {
      id,
      employeeId,
      period: periodCycleKey,
      amount,
      releasedAt: new Date().toISOString(),
      releasedBy: financeId,
    }
    setPayments((cur) => [payload, ...cur])
    return id
  }

  function isPayslipReleased(employeeId, periodCycleKey) {
    return payments.some((p) => p.employeeId === employeeId && p.period === periodCycleKey)
  }

  function getEmployeePayments(employeeId) {
    return payments.filter((p) => p.employeeId === employeeId)
  }

  function getFinancePayments() {
    return payments.slice().sort((a, b) => new Date(b.releasedAt) - new Date(a.releasedAt))
  }

  function getPayslipPeriod(employeeId, period) {
    const records = getEmployeeAttendance(employeeId).filter((record) => record.status === 'head_verified' && payrollCycleKey(record.scannedAt) === period)
    return {
      records,
      totalHours: records.reduce((sum, record) => sum + Number(record.loggedHours || 0), 0),
      totalAmount: records.reduce((sum, record) => sum + Number(record.amount || 0), 0),
    }
  }

  function getEmployeeTotals(employeeId) {
    const approvedAttendance = getEmployeeAttendance(employeeId).filter((record) => record.status === 'head_verified')
    const totalHours = approvedAttendance.reduce((sum, record) => sum + Number(record.loggedHours || 0), 0)
    const totalAmount = approvedAttendance.reduce((sum, record) => sum + Number(record.amount || 0), 0)
    const latestRecord = approvedAttendance[0] || null
    return {
      totalHours,
      totalAmount,
      latestRecord,
      currentDepartment: getEmployeeDepartment(employeeId),
      records: approvedAttendance,
    }
  }

  return (
    <QRContext.Provider
      value={{
        departmentRequests,
        attendanceRecords,
        leaveRequests,
        submitDepartmentRequest,
        approveDepartmentRequest,
        submitLeaveRequest,
        recordAttendanceScan,
        approveAttendanceByHead,
        submitScan,
        approveByLeadman,
        approveByHead,
        clearAll,
        getEmployeeDepartment,
        getEmployeeDepartmentRequests,
        getEmployeeLeaveRequests,
        getLeadmanDepartmentRequests,
        getEmployeeAttendance,
        getLeadmanAttendance,
        getHeadPendingAttendance,
        getFinanceAttendance,
        getFinanceRecords,
        getFinanceEmployees,
        getFinanceEmployeeHistory,
        getFinancePayrollCycles,
        getFinancePayrollCycle,
        getPayslipPeriods,
        getPayslipPeriod,
        getEmployeeTotals,
        payments,
        markPayslipReleased,
        isPayslipReleased,
        getEmployeePayments,
        getFinancePayments,
        syncPending,
        syncNow: async () => { const r = await trySyncOnce(); await refreshPendingCount(); return r },
        formatDateTime,
        periodLabel,
        periodKey,
        payrollCycleKey,
        payrollCycleLabel,
        DEPARTMENTS,
        DEPARTMENT_RATES,
      }}
    >
      {children}
    </QRContext.Provider>
  )
}

export default QRProvider
