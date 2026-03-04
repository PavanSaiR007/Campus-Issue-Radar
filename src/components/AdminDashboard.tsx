import { useState, useEffect } from "react";
import { User, Complaint, RadarStat } from "../types";
import ComplaintList from "./ComplaintList";
import RadarChartComponent from "./RadarChart";
import { ShieldCheck, RefreshCw, LogOut, CheckCircle2, Clock } from "lucide-react";
import { motion } from "motion/react";

interface AdminDashboardProps {
  user: User;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [radarData, setRadarData] = useState<RadarStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showList, setShowList] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [compRes, radarRes] = await Promise.all([
        fetch(`/api/complaints?role=admin`),
        fetch(`/api/radar`)
      ]);
      
      if (compRes.ok && radarRes.ok) {
        const compData = await compRes.json();
        const radData = await radarRes.json();
        setComplaints(compData);
        setRadarData(radData);
      }
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: status as any } : c));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'in-progress').length;

  return (
    <div className="min-h-screen bg-[#f1f4fd] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-[32px] font-bold text-black mb-8">Admin Command Center</h2>
        </div>

        {/* Issue Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[20px] shadow-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Resolved</p>
              <p className="text-3xl font-bold text-slate-900">{resolvedCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[20px] shadow-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending</p>
              <p className="text-3xl font-bold text-slate-900">{pendingCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[20px] shadow-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">In Progress</p>
              <p className="text-3xl font-bold text-slate-900">{inProgressCount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="bg-white p-8 rounded-[20px] shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-black mb-6 text-center">Issue Radar</h3>
            <div className="h-[300px] w-full">
              <RadarChartComponent data={radarData} />
            </div>
          </div>

          {/* Summary Table */}
          <div className="bg-white rounded-[20px] shadow-xl overflow-hidden border border-slate-200">
            <h3 className="text-xl font-bold text-black p-6 text-center border-b">Category Summary</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#6b84e3] text-white">
                  <th className="py-4 px-6 font-bold border-r border-white/20 text-center">Category</th>
                  <th className="py-4 px-6 font-bold text-center">Complaints</th>
                </tr>
              </thead>
              <tbody>
                {radarData.length > 0 ? (
                  radarData.map((stat, idx) => (
                    <tr key={stat.category} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="py-4 px-6 border-r border-slate-200 text-center text-slate-700">{stat.category}</td>
                      <td className="py-4 px-6 text-center text-slate-700 font-medium">{stat.count}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-10 text-center text-slate-400 italic">No data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setShowList(!showList)}
            className="px-8 py-2 bg-[#6b84e3] text-white font-bold rounded-[10px] shadow-lg shadow-[#6b84e3]/30 hover:bg-[#5a73d2] transition-all"
          >
            {showList ? "Hide Detailed List" : "View Detailed List"}
          </button>

          {showList && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-4"
            >
              <ComplaintList 
                complaints={complaints} 
                loading={loading} 
                isAdmin={true} 
                onStatusUpdate={handleStatusUpdate}
              />
            </motion.div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-2 bg-slate-200 text-slate-700 font-bold rounded-[10px] hover:bg-slate-300 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}


