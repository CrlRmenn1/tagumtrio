import { useAuth } from "../context/AuthContext";
import { Dashboard } from "./Dashboard";
import { EmployeePortal } from "./EmployeePortal";
import { Production } from "./Production";
import { Payroll } from "./Payroll";
import { Employees } from "./Employees";
import { Requests } from "./Requests";
import { Navigate } from "react-router";

export function RoleDashboard() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "employee") {
    return <Navigate to="/portal" replace />;
  }
  
  if (user.role === "finance") {
    return <Navigate to="/payroll" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
