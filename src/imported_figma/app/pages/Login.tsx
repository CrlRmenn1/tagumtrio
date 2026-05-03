import { useState } from "react";
import { useNavigate } from "react-router";
import { QrCode, Lock, User as UserIcon } from "lucide-react";
import { useAuth, type Role } from "../context/AuthContext";

export function Login() {
  const [role, setRole] = useState<Role>("admin");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role) {
      login(role);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500 p-3 rounded-xl shadow-lg shadow-emerald-500/20 mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">TriOPS System</h1>
          <p className="text-slate-400 text-sm mt-1">Tagum Trio Lumber Corporation</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Select Role for Demo</label>
            <div className="relative">
              <select
                value={role || ""}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg pl-4 pr-10 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="admin">Administrator</option>
                <option value="production_head">Production Head</option>
                <option value="hr">HR Manager</option>
                <option value="finance">Finance Officer</option>
                <option value="employee">Employee (Self-Service)</option>
              </select>
              <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <input
                type="password"
                value="demo-password-123"
                readOnly
                className="w-full bg-slate-950/50 border border-slate-800 text-slate-500 rounded-lg pl-4 pr-10 py-3 focus:outline-none"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex gap-1 items-center">
              * Password is automatically filled for demo purposes.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20 mt-4"
          >
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
