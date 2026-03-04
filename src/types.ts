export type Role = 'student' | 'admin';

export interface User {
  id: number;
  username: string;
  role: Role;
  register_no?: string;
  department?: string;
}

export interface Complaint {
  id: number;
  student_id: number;
  student_name?: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved';
  created_at: string;
  images: string[];
}

export interface RadarStat {
  category: string;
  count: number;
}
