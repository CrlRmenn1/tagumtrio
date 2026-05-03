import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "admin" | "production_head" | "hr" | "finance" | "employee" | null;

interface User {
  id: string;
  name: string;
  role: Role;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: Role) => {
    switch (role) {
      case "admin":
        setUser({ id: "ADM-001", name: "System Admin", role: "admin" });
        break;
      case "production_head":
        setUser({ id: "PRD-HEAD", name: "John Doe", role: "production_head", department: "Production" });
        break;
      case "hr":
        setUser({ id: "HR-001", name: "Maria Clara", role: "hr", department: "Human Resources" });
        break;
      case "finance":
        setUser({ id: "FIN-001", name: "Andres Bonifacio", role: "finance", department: "Finance" });
        break;
      case "employee":
        setUser({ id: "EMP-001", name: "Juan Dela Cruz", role: "employee", department: "Production" });
        break;
      default:
        setUser(null);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
