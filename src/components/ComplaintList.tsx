import { Complaint } from "../types";
import { Calendar, Tag, Clock, CheckCircle2, AlertCircle, ChevronRight, Image as ImageIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface ComplaintListProps {
  complaints: Complaint[];
  loading: boolean;
  onStatusUpdate?: (id: number, status: string) => void;
  isAdmin?: boolean;
}

export default function ComplaintList({ complaints, loading, onStatusUpdate, isAdmin }: ComplaintListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-slate-100 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No issues found</h3>
        <p className="text-slate-500 mt-1">Everything seems to be in order!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint, idx) => (
        <motion.div
          key={complaint.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
                    complaint.status === 'pending' && "bg-amber-100 text-amber-700",
                    complaint.status === 'in-progress' && "bg-blue-100 text-blue-700",
                    complaint.status === 'resolved' && "bg-emerald-100 text-emerald-700"
                  )}>
                    {complaint.status.replace('-', ' ')}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Tag className="w-3 h-3" />
                    {complaint.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </span>
                  {isAdmin && (
                    <span className="text-xs font-bold text-indigo-600">
                      By: {complaint.student_name}
                    </span>
                  )}
                </div>

                <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {complaint.title}
                </h4>
                
                <p className="text-slate-600 text-sm line-clamp-2">
                  {complaint.description}
                </p>

                {complaint.images && complaint.images.length > 0 && (
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex -space-x-2 overflow-hidden">
                      {complaint.images.slice(0, 3).map((img, i) => (
                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-slate-100">
                          <img src={img} alt="Attachment" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                    {complaint.images.length > 3 && (
                      <span className="text-xs font-medium text-slate-500">
                        +{complaint.images.length - 3} more
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-400 ml-2">
                      <ImageIcon className="w-3 h-3" />
                      {complaint.images.length} Photos
                    </span>
                  </div>
                )}
              </div>

              {isAdmin && (
                <div className="flex flex-col gap-2 min-w-[140px]">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Update Status</p>
                  <select
                    value={complaint.status}
                    onChange={(e) => onStatusUpdate?.(complaint.id, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
