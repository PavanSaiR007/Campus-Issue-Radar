import { useState, useRef } from "react";
import { User } from "../types";
import { Camera, X, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

interface ComplaintFormProps {
  user: User;
  onSuccess: () => void;
  onBack: () => void;
}

const CATEGORIES = [
  "Electricity",
  "Water",
  "Internet",
  "Hostel",
  "Cleanliness",
  "Other"
];

export default function ComplaintForm({ user, onSuccess, onBack }: ComplaintFormProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: user.id,
          title: category, // Using category as title for simplicity as per image
          description,
          category,
          images: [] // Simplified for this view
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Submitted!</h3>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] bg-white"
      >
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] min-h-[150px] font-mono text-sm"
        placeholder="Describe your issue..."
        required
      />

      <div className="space-y-4">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full py-3 px-4 rounded-[10px] font-bold text-white transition-all bg-[#6b84e3] hover:bg-[#5a73d2] shadow-lg shadow-[#6b84e3]/30",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
        
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3 px-4 rounded-[10px] font-bold text-white transition-all bg-[#6b84e3] hover:bg-[#5a73d2] shadow-lg shadow-[#6b84e3]/30"
        >
          Back
        </button>
      </div>
    </form>
  );
}
