import { useState } from "react";
import { User, Role } from "../types";
import { Loader2, ShieldCheck, Mail, Lock } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";
import Register from "./Register";

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<Role>("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username,
          password 
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        // Client side validation that role matches what they picked
        if (userData.role !== role) {
           setError(`Account is registered as ${userData.role}, not ${role}`);
           setLoading(false);
           return;
        }
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

  if (mode === "register") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <AnimatedBackground />
        <Register 
          onBack={() => setMode("login")} 
          onSuccess={() => {
            setMode("login");
            setError("");
          }} 
        />
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <AnimatedBackground />
        <div className="w-full max-w-[450px] bg-white rounded-[20px] shadow-2xl p-10 relative z-10">
          <h2 className="text-[28px] font-bold text-black mb-4">Reset Password</h2>
          <p className="text-slate-500 mb-6">Contact the administration office with your student ID to reset your credentials.</p>
          <button 
            onClick={() => setMode("login")}
            className="w-full py-3 bg-slate-200 text-slate-700 font-bold rounded-xl"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-[450px] bg-white rounded-[20px] shadow-2xl p-10 relative z-10 backdrop-blur-sm bg-white/95"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-indigo-50 rounded-2xl mb-4">
            <ShieldCheck className="w-10 h-10 text-[#6b84e3]" />
          </div>
          <h2 className="text-[32px] font-bold text-black">Campus Issue Radar</h2>
          <p className="text-slate-500 mt-2 font-medium italic">Empowering students through accountability</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-100 p-1 rounded-xl flex mb-6">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                role === "student" ? "bg-white text-[#6b84e3] shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                role === "admin" ? "bg-white text-[#6b84e3] shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Admin
            </button>
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#6b84e3] transition-colors" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] transition-all bg-slate-50/50"
              placeholder={role === "student" ? "Registration No / ID" : "Admin ID"}
              required
            />
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#6b84e3] transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] transition-all bg-slate-50/50"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex justify-end px-1">
              <button 
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs font-bold text-[#6b84e3] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-4 px-4 rounded-[12px] font-bold text-white transition-all bg-[#6b84e3] hover:bg-[#5a73d2] active:scale-[0.98] shadow-lg shadow-[#6b84e3]/30 mt-2",
              loading && "opacity-70 cursor-not-allowed"
            )}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4 text-center">
          <p className="text-[10px] text-slate-400">
            Demo Credentials:<br />
            Student IDs: <span className="font-mono text-slate-600">241FA04505 (Ganesh), 241FA04535 (Dhanush)</span><br />
            Password: <span className="font-mono text-slate-600">password</span><br />
            Admin: <span className="font-mono text-slate-600">admin / password</span>
          </p>
          
          <p className="text-sm text-slate-500">
            Don't have an account?{" "}
            <button 
              onClick={() => setMode("register")}
              className="text-[#6b84e3] font-bold hover:underline"
            >
              Register now?
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          backgroundColor: ["#6b84e3", "#8e7ae3", "#a870e3", "#6b84e3"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[20%] -left-[20%] w-[100%] h-[100%] rounded-full opacity-20 blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
          backgroundColor: ["#a870e3", "#6b84e3", "#8e7ae3", "#a870e3"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[20%] -right-[20%] w-[100%] h-[100%] rounded-full opacity-20 blur-[100px]"
      />
      <div className="absolute inset-0 bg-[#f1f4fd]" />
    </div>
  );
}

