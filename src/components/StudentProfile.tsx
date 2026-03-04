import { User } from "../types";

interface StudentProfileProps {
  user: User;
  onBack: () => void;
}

export default function StudentProfile({ user, onBack }: StudentProfileProps) {
  return (
    <div className="flex flex-col items-center py-10">
      <div className="w-full max-w-[450px] bg-white rounded-[20px] shadow-xl p-10 text-center space-y-6">
        <h3 className="text-[32px] font-bold text-black">Student Profile</h3>
        
        <div className="space-y-4 text-left">
          <div className="flex justify-center gap-2 text-[24px]">
            <span className="font-bold">Name:</span>
            <span>{user.username}</span>
          </div>
          
          <div className="flex justify-center gap-2 text-[24px]">
            <span className="font-bold">Reg No:</span>
            <span>{user.register_no}</span>
          </div>
          
          <div className="flex justify-center gap-2 text-[24px]">
            <span className="font-bold">Department:</span>
            <span>{user.department}</span>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={onBack}
            className="px-10 py-2 bg-[#6b84e3] text-white font-bold rounded-[10px] shadow-lg shadow-[#6b84e3]/30 hover:bg-[#5a73d2] transition-all"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
