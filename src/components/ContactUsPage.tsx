interface ContactUsPageProps {
  onBack: () => void;
}

export default function ContactUsPage({ onBack }: ContactUsPageProps) {
  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-full max-w-[450px] bg-white rounded-[20px] shadow-xl p-10 space-y-8 text-center">
        <h3 className="text-[32px] font-bold text-black">Contact Us</h3>
        
        <div className="space-y-6 text-left">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-[#6b84e3]">Email</h4>
            <p className="text-slate-600">support@campusradar.edu</p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-[#6b84e3]">Phone</h4>
            <p className="text-slate-600">+1 (555) 123-4567</p>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-[#6b84e3]">Office</h4>
            <p className="text-slate-600">Student Affairs Building, Room 204</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full py-3 bg-[#6b84e3] text-white font-bold rounded-[10px] shadow-lg shadow-[#6b84e3]/30 hover:bg-[#5a73d2] transition-all"
        >
          Back
        </button>
      </div>
    </div>
  );
}
