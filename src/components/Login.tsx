import { useState } from "react";
import { User, Role } from "../types";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<Role>("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // In a real app, we'd validate the role on the server too
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: role === "student" ? username : "admin", // Simple mapping for demo
          password 
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        onLogin(userData);
      } else {
        const data = await response.json();
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#6b84e3] via-[#8e7ae3] to-[#a870e3]">
      <div className="w-full max-w-[450px] bg-white rounded-[20px] shadow-2xl p-10">
        <div className="text-center mb-10">
          <h2 className="text-[32px] font-bold text-black">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] bg-white text-slate-700 appearance-none cursor-pointer"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {role === "student" ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3]"
              placeholder="Student ID"
              required
            />
          ) : (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3]"
              placeholder="Admin ID"
              required
            />
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3]"
            placeholder={role === "student" ? "Password" : "Passcode"}
            required
          />

          {error && (
            <div className="text-red-500 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-3 px-4 rounded-[10px] font-bold text-white transition-all bg-[#6b84e3] hover:bg-[#5a73d2] active:scale-[0.98] shadow-lg shadow-[#6b84e3]/30",
              loading && "opacity-70 cursor-not-allowed"
            )}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Login...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[10px] text-center text-slate-400">
            Demo Credentials:<br />
            Student 1: <span className="font-mono text-slate-600">student1 / password</span><br />
            Student 2: <span className="font-mono text-slate-600">student2 / password</span><br />
            Student 3: <span className="font-mono text-slate-600">student3 / password</span><br />
            Admin: <span className="font-mono text-slate-600">admin / password</span>
          </p>
        </div>
      </div>
    </div>
  );
}

