import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import QRProvider from './context/qr-provider'
import LeadmanDashboard from './pages/leadman/LeadmanDashboard'
import LeadmanProduction from './pages/leadman/LeadmanProduction'
import MainLayout from './components/layout/MainLayout'
import Login from './pages/Login'
import RoleDashboard from './pages/RoleDashboard'
import Dashboard from './pages/admin/Dashboard'
import ProductionDashboard from './pages/production/ProductionDashboard'
import PayrollReview from './pages/finance/PayrollReview'
import Commissions from './pages/finance/Commissions'
import EmployeeDirectory from './pages/HR/EmployeeDirectory'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import EmployeePortal from './pages/converted/EmployeePortal'
import MyAttendance from './pages/employee/MyAttendance'
import MyPayslips from './pages/employee/MyPayslips'
import ViewPayslip from './pages/employee/ViewPayslip'
import FigmaDemo from './components/ui/FigmaDemo'

export default function App() {
  return (
    <AuthProvider>
      <QRProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RoleDashboard />} />

          <Route path="/app/*" element={<MainLayout />}>
            <Route index element={<RoleDashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="production" element={<ProductionDashboard />} />
            <Route path="payroll" element={<PayrollReview />} />
            <Route path="payroll/commissions" element={<Commissions />} />
            <Route path="employees" element={<EmployeeDirectory />} />
            <Route path="requests" element={<MyAttendance />} />
            <Route path="portal" element={<EmployeePortal />} />
            <Route path="portal/leaves" element={<MyAttendance />} />
            <Route path="portal/payslips" element={<MyPayslips />} />
            <Route path="portal/payslips/:id" element={<ViewPayslip />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          <Route path="/app/leadman" element={<MainLayout />}>
            <Route index element={<LeadmanProduction />} />
          </Route>

          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/production" element={<Navigate to="/app/production" replace />} />
          <Route path="/payroll" element={<Navigate to="/app/payroll" replace />} />
          <Route path="/employees" element={<Navigate to="/app/employees" replace />} />
          <Route path="/requests" element={<Navigate to="/app/requests" replace />} />
          <Route path="/portal" element={<Navigate to="/app/portal" replace />} />
          <Route path="/portal/leaves" element={<Navigate to="/app/portal/leaves" replace />} />
          <Route path="/portal/payslips" element={<Navigate to="/app/portal/payslips" replace />} />

          <Route path="/figma-demo" element={<FigmaDemo />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
      </QRProvider>
    </AuthProvider>
  )
}
