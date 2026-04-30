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
  "Canteen/Food",
  "Transportation",
  "Library",
  "Classroom/Infrastructure",
  "Safety & Security",
  "IT Services",
  "Medical/Health",
  "Sports/Gym",
  "Other"
];

export default function ComplaintForm({ user, onSuccess, onBack }: ComplaintFormProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subTopic, setSubTopic] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: user.id,
          title: subTopic || category,
          description,
          category,
          location,
          urgency,
          images
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] bg-white text-slate-700"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Urgency</label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] bg-white text-slate-700"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subject / Sub-topic</label>
        <input
          type="text"
          value={subTopic}
          onChange={(e) => setSubTopic(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3]"
          placeholder="Brief summary of the issue (e.g., Broken fan, Leaking tap)"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3]"
          placeholder="Where did this happen? (e.g., Block A, Library)"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#6b84e3] min-h-[120px] font-mono text-sm"
          placeholder="Describe your issue..."
          required
        />
      </div>

      <div className="space-y-4">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-[#6b84e3] hover:bg-slate-50 transition-all cursor-pointer group"
        >
          <Camera className="w-8 h-8 text-slate-400 group-hover:text-[#6b84e3]" />
          <p className="text-sm font-bold text-slate-500">Add an image</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

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
