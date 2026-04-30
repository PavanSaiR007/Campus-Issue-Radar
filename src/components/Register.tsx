import { useState } from "react";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

interface RegisterProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function Register({ onBack, onSuccess }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerNo, setRegisterNo] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, register_no: registerNo, department }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] bg-white rounded-[20px] shadow-2xl p-10 relative z-10 transition-all">
      <button 
        onClick={onBack}
        className="absolute left-6 top-6 p-2 text-slate-400 hover:text-[#6b84e3] hover:bg-slate-50 rounded-full transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-indigo-50 rounded-2xl mb-4">
          <ShieldCheck className="w-8 h-8 text-[#6b84e3]" />
        </div>
        <h2 className="text-[28px] font-bold text-black">Join Campus Radar</h2>
        <p className="text-slate-500 text-sm mt-1">Create your student account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] bg-slate-50/50"
            placeholder="Choose a username"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">College Registration No</label>
          <input
            type="text"
            value={registerNo}
            onChange={(e) => setRegisterNo(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] bg-slate-50/50"
            placeholder="e.g. 241FA045##"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] bg-slate-50/50"
          >
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">Mechanical</option>
            <option value="IT">IT</option>
            <option value="Civil">Civil</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] bg-slate-50/50"
            placeholder="********"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full py-4 px-4 rounded-[12px] font-bold text-white transition-all bg-[#6b84e3] hover:bg-[#5a73d2] shadow-lg shadow-[#6b84e3]/30 mt-4",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Registering...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
}
