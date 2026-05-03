import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Production } from "./pages/Production";
import { Payroll } from "./pages/Payroll";
import { Employees } from "./pages/Employees";
import { Requests } from "./pages/Requests";
import { EmployeePortal } from "./pages/EmployeePortal";
import { EmployeeLeaves } from "./pages/EmployeeLeaves";
import { EmployeePayslips } from "./pages/EmployeePayslips";
import { Login } from "./pages/Login";
import { RoleDashboard } from "./pages/RoleDashboard";

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: RoleDashboard },
      { path: "production", Component: Production },
      { path: "payroll", Component: Payroll },
      { path: "employees", Component: Employees },
      { path: "requests", Component: Requests },
      { path: "portal", Component: EmployeePortal },
      { path: "portal/leaves", Component: EmployeeLeaves },
      { path: "portal/payslips", Component: EmployeePayslips },
      { path: "dashboard", Component: Dashboard },
    ],
  },
]);
