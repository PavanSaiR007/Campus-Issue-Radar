import { useState, useEffect } from "react";
import { User, Complaint } from "../types";
import ComplaintForm from "./ComplaintForm";
import ComplaintList from "./ComplaintList";
import StudentProfile from "./StudentProfile";
import FeedbackPage from "./FeedbackPage";
import ContactUsPage from "./ContactUsPage";
import SuggestionsPage from "./SuggestionsPage";
import { motion, AnimatePresence } from "motion/react";
import { ListChecks, PlusCircle, MessageSquare } from "lucide-react";

interface StudentDashboardProps {
  user: User;
}

type View = 'home' | 'raise' | 'track' | 'profile' | 'feedback' | 'contact' | 'suggestions';

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const [view, setView] = useState<View>('home');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/complaints?role=student&userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user.id]);

  const handleComplaintSubmitted = () => {
    fetchComplaints();
    setView('track');
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center space-y-8 py-10">
            <h2 className="text-[40px] font-bold text-black flex items-center gap-2">
              Hi Student <span className="animate-bounce">👋</span>
            </h2>
            
            <div className="w-full max-w-[450px] bg-white rounded-[20px] shadow-xl p-10 text-center space-y-4">
              <h3 className="text-[24px] font-bold text-black">Complaint Status</h3>
              <p className="text-[18px] text-slate-700">
                {complaints.filter(c => c.status === 'pending').length} Pending | {complaints.filter(c => c.status === 'resolved').length} Resolved
              </p>
            </div>

            <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => setView('track')}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all text-slate-600 hover:bg-slate-50"
              >
                <ListChecks className="w-4 h-4" />
                Track Issues
              </button>
              <button
                onClick={() => setView('raise')}
                className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all text-slate-600 hover:bg-slate-50"
              >
                <PlusCircle className="w-4 h-4" />
                Raise Complaint
              </button>
            </div>

            <div className="w-full max-w-[450px] bg-white rounded-[20px] shadow-xl p-8 flex justify-center">
              <button
                onClick={() => setView('profile')}
                className="px-12 py-3 bg-[#6b84e3] text-white font-bold rounded-[10px] shadow-lg shadow-[#6b84e3]/30 hover:bg-[#5a73d2] transition-all"
              >
                Profile
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setView('suggestions')}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-[10px] hover:bg-slate-300 transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Suggestions
              </button>
              <button
                onClick={() => setView('feedback')}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-[10px] hover:bg-slate-300 transition-all"
              >
                Feedback
              </button>
              <button
                onClick={() => setView('contact')}
                className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-[10px] hover:bg-slate-300 transition-all"
              >
                Contact Us
              </button>
            </div>
          </div>
        );
      case 'raise':
      case 'track':
        return (
          <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex justify-center mb-8">
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setView('track')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    view === 'track' ? 'bg-[#6b84e3] text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ListChecks className="w-4 h-4" />
                  Track Issues
                </button>
                <button
                  onClick={() => setView('raise')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                    view === 'raise' ? 'bg-[#6b84e3] text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Raise Complaint
                </button>
              </div>
            </div>

            {view === 'raise' ? (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[600px] bg-white rounded-[20px] shadow-xl p-10">
                  <h3 className="text-[32px] font-bold text-black text-center mb-8">Raise Complaint</h3>
                  <ComplaintForm user={user} onSuccess={handleComplaintSubmitted} onBack={() => setView('home')} />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">Track Your Issues</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setView('suggestions')} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Suggestions
                    </button>
                    <button onClick={() => setView('home')} className="px-4 py-2 bg-slate-200 rounded-lg font-bold text-sm">Back</button>
                  </div>
                </div>
                <ComplaintList complaints={complaints} loading={loading} />
              </div>
            )}
          </div>
        );
      case 'profile':
        return <StudentProfile user={user} onBack={() => setView('home')} />;
      case 'feedback':
        return <FeedbackPage user={user} onBack={() => setView('home')} />;
      case 'contact':
        return <ContactUsPage onBack={() => setView('home')} />;
      case 'suggestions':
        return <SuggestionsPage user={user} onBack={() => setView('home')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f4fd]">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}


