import { useState } from "react";
import { User } from "../types";

interface FeedbackPageProps {
  user: User;
  onBack: () => void;
}

export default function FeedbackPage({ user, onBack }: FeedbackPageProps) {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, message, rating }),
      });
      if (response.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-10">
        <div className="w-full max-w-[450px] bg-white rounded-[20px] shadow-xl p-10 text-center">
          <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
          <p className="text-slate-600 mb-6">Your feedback helps us improve.</p>
          <button onClick={onBack} className="px-8 py-2 bg-[#6b84e3] text-white rounded-lg">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-full max-w-[450px] bg-white rounded-[20px] shadow-xl p-10 space-y-6">
        <h3 className="text-[32px] font-bold text-black text-center">Feedback</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Rating (1-5)</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${rating === r ? 'bg-[#6b84e3] text-white' : 'bg-slate-100 text-slate-400'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] min-h-[120px]"
              placeholder="Tell us what you think..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#6b84e3] text-white font-bold rounded-[10px] shadow-lg shadow-[#6b84e3]/30"
          >
            Submit Feedback
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 bg-slate-200 text-slate-700 font-bold rounded-[10px]"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}
