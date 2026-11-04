export type UserRole = 
  | 'Super Admin'
  | 'Admin'
  | 'Department Head'
  | 'Faculty'
  | 'Student'
  | 'Accountant';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive' | 'Suspended';
  avatar?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  head_faculty_id: string;
  head_faculty_name: string;
  description: string;
  established_year: number;
  building: string;
  faculty_count: number;
  student_count: number;
}

export interface DegreeProgram {
  id: string;
  department_id: string;
  department_name: string;
  code: string;
  name: string;
  level: 'BS' | 'MS' | 'PhD' | 'Diploma';
  duration_years: number;
  credit_hours: number;
  fee_per_semester: number;
  eligibility: string;
  overview: string;
  careers: string[];
}

export interface Course {
  id: string;
  course_code: string;
  title: string;
  department_id: string;
  department_name: string;
  credit_hours: number;
  prerequisites: string;
  description: string;
  instructor_id: string;
  instructor_name: string;
  semester_offered: number;
  schedule: string;
  room: string;
  capacity: number;
  enrolled_count: number;
}

export interface Semester {
  id: string;
  code: string;
  name: string;
  is_current: boolean;
  enrollment_open: boolean;
  start_date: string;
  end_date: string;
}

export interface Student {
  id: string;
  user_id: string;
  reg_no: string;
  full_name: string;
  email: string;
  phone: string;
  department_id: string;
  department_name: string;
  program_id: string;
  program_name: string;
  current_semester: number;
  cgpa: number;
  credit_completed: number;
  admission_date: string;
  status: 'Active' | 'Probation' | 'Graduated' | 'On Leave';
  advisor_name: string;
  address: string;
  blood_group: string;
  emergency_contact: string;
}

export interface Faculty {
  id: string;
  user_id: string;
  faculty_code: string;
  full_name: string;
  email: string;
  phone: string;
  department_id: string;
  department_name: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer' | 'Dean';
  specialization: string;
  office_room: string;
  office_hours: string;
  assigned_course_ids: string[];
  status: 'Active' | 'On Sabbatical' | 'Retired';
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  course_code: string;
  course_title: string;
  credit_hours: number;
  semester_id: string;
  semester_name: string;
  instructor_name: string;
  status: 'Enrolled' | 'Dropped' | 'Completed';
  enrolled_at: string;
  grade_letter?: string;
  grade_points?: number;
}

export interface AttendanceRecord {
  id: string;
  course_id: string;
  course_code: string;
  student_id: string;
  student_name: string;
  reg_no: string;
  session_date: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
}

export interface Assessment {
  id: string;
  course_id: string;
  course_code: string;
  title: string;
  type: 'Assignment' | 'Quiz' | 'Midterm' | 'Final Exam';
  total_marks: number;
  weightage_percent: number;
  due_date: string;
  instructions: string;
  submissions_count: number;
}

export interface ResultRecord {
  id: string;
  student_id: string;
  student_name: string;
  reg_no: string;
  course_id: string;
  course_code: string;
  course_title: string;
  credit_hours: number;
  semester_id: string;
  semester_name: string;
  midterm_marks: number; // max 30
  final_marks: number;   // max 50
  assignment_marks: number; // max 10
  quiz_marks: number;    // max 10
  total_marks: number;   // 100
  grade: string;         // A, A-, B+, B, C, F
  grade_point: number;   // 4.0, 3.7, 3.3, 3.0, 2.0, 0.0
  status: 'Draft' | 'Submitted' | 'Published';
}

export interface FeeRecord {
  id: string;
  student_id: string;
  student_name: string;
  reg_no: string;
  semester_id: string;
  semester_name: string;
  challan_no: string;
  issue_date: string;
  due_date: string;
  tuition_fee: number;
  lab_fee: number;
  library_fee: number;
  discount: number;
  total_amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paid_at?: string;
  payment_method?: string;
  transaction_ref?: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Academic' | 'Admissions' | 'Examination' | 'Campus Life' | 'Research';
  content: string;
  published_at: string;
  author_name: string;
  author_role: string;
  is_pinned: boolean;
  target_audience: 'All' | 'Students' | 'Faculty' | 'Public';
}

export interface UniversityEvent {
  id: string;
  title: string;
  category: 'Seminar' | 'Sports' | 'Conference' | 'Workshop' | 'Cultural';
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  attendees_count: number;
  is_registered?: boolean;
}

export interface AdmissionApplication {
  id: string;
  tracking_no: string;
  applicant_name: string;
  email: string;
  phone: string;
  program_id: string;
  program_name: string;
  previous_degree: string;
  cgpa_or_percentage: string;
  passed_year: number;
  submitted_at: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  review_notes?: string;
  assigned_reg_no?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time_start: string;
  time_end: string;
  course_code: string;
  course_title: string;
  instructor: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}
