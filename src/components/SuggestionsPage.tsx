import { useState } from "react";
import { User } from "../types";

interface SuggestionsPageProps {
  user: User;
  onBack: () => void;
}

export default function SuggestionsPage({ user, onBack }: SuggestionsPageProps) {
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, we just simulate success
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-10">
        <div className="w-full max-w-[450px] bg-white rounded-[20px] shadow-xl p-10 text-center">
          <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
          <p className="text-slate-600 mb-6">Your suggestion has been recorded.</p>
          <button onClick={onBack} className="px-8 py-2 bg-[#6b84e3] text-white rounded-lg">Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-full max-w-[500px] bg-white rounded-[20px] shadow-xl p-10 space-y-6">
        <h3 className="text-[32px] font-bold text-black text-center">Suggestions</h3>
        <p className="text-slate-500 text-center">Help us improve the campus by sharing your ideas.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Your Suggestion</label>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] min-h-[150px]"
              placeholder="What would you like to see changed or improved?"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#6b84e3] text-white font-bold rounded-[10px] shadow-lg shadow-[#6b84e3]/30"
          >
            Submit Suggestion
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
