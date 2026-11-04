import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { DocumentModal, DocumentType } from './DocumentModal';
import { 
  User, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  CreditCard, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Download, 
  Clock, 
  MapPin, 
  Search,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const {
    activeStudent,
    setActiveStudentId,
    studentsList,
    courses,
    enrollments,
    enrollCourse,
    dropCourse,
    timetable,
    attendanceRecords,
    results,
    feeRecords,
    payFee,
    addStudent,
  } = useUniversity();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'enrollment' | 'timetable' | 'attendance' | 'results' | 'fees' | 'documents'>('dashboard');

  // Document modal state
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('admit_card');

  // Student registration modal / form
  const [showRegisterStudent, setShowRegisterStudent] = useState(false);
  const [newRegName, setNewRegName] = useState('');
  const [newRegEmail, setNewRegEmail] = useState('');
  const [newRegPhone, setNewRegPhone] = useState('');
  const [newRegDept, setNewRegDept] = useState('dept-1');
  const [newRegProg, setNewRegProg] = useState('prog-1');

  // Filtered data for active student
  const studentEnrollments = enrollments.filter(
    (e) => e.student_id === activeStudent.id && e.status === 'Enrolled'
  );
  const currentTotalCredits = studentEnrollments.reduce((sum, e) => sum + e.credit_hours, 0);

  const studentAttendance = attendanceRecords.filter((a) => a.student_id === activeStudent.id);
  const studentResults = results.filter((r) => r.student_id === activeStudent.id);
  const studentFees = feeRecords.filter((f) => f.student_id === activeStudent.id);

  // Calculate per-course attendance stats
  const attendanceByCourse = studentEnrollments.map((enr) => {
    const records = studentAttendance.filter((a) => a.course_id === enr.course_id);
    const totalSessions = records.length;
    const presentCount = records.filter((a) => a.status === 'Present' || a.status === 'Late').length;
    const absentCount = records.filter((a) => a.status === 'Absent').length;
    const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 100;
    return {
      courseId: enr.course_id,
      courseCode: enr.course_code,
      courseTitle: enr.course_title,
      totalSessions,
      presentCount,
      absentCount,
      percentage,
      isAtRisk: percentage < 75,
    };
  });

  const handleOpenDoc = (type: DocumentType) => {
    setSelectedDocType(type);
    setDocModalOpen(true);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegName || !newRegEmail) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regNo = `CS-2026-${randomSuffix}`;

    addStudent({
      reg_no: regNo,
      full_name: newRegName,
      email: newRegEmail,
      phone: newRegPhone || '+1 (555) 728-0000',
      department_id: newRegDept,
      department_name: newRegDept === 'dept-1' ? 'Computer Science & Engineering' : 'School of Business',
      program_id: newRegProg,
      program_name: 'BS Computer Science',
      current_semester: 1,
      admission_date: new Date().toISOString().split('T')[0],
      status: 'Active',
      advisor_name: 'Prof. Dr. Julian Vance',
      address: 'Cambridge Student Residence',
      blood_group: 'B+',
      emergency_contact: 'Family (+1 555-000-0000)',
    });

    setNewRegName('');
    setNewRegEmail('');
    setNewRegPhone('');
    setShowRegisterStudent(false);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-20">
      
      {/* Student Portal Header Strip */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-lg font-bold shrink-0">
                {activeStudent.full_name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-xl font-bold text-stone-950">
                    {activeStudent.full_name}
                  </h1>
                  <span className="font-mono text-xs px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-stone-700">
                    {activeStudent.reg_no}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  {activeStudent.program_name} · Semester {activeStudent.current_semester} · CGPA {activeStudent.cgpa}
                </p>
              </div>
            </div>

            {/* Quick Demo Switcher / Register account */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <span className="font-medium text-stone-700">Switch Student:</span>
                <select
                  value={activeStudent.id}
                  onChange={(e) => setActiveStudentId(e.target.value)}
                  className="text-xs bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium text-stone-900 focus:outline-none"
                >
                  {studentsList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.full_name} ({st.reg_no})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowRegisterStudent(true)}
                className="px-3 py-1.5 text-xs font-medium border border-stone-300 rounded-lg bg-white hover:bg-stone-50 text-stone-800 transition-colors"
              >
                + Register New
              </button>
            </div>

          </div>

          {/* Student Sub Navigation Tabs */}
          <div className="flex items-center gap-1 mt-6 border-b border-stone-200 -mb-5 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Overview & Profile', icon: <User className="w-3.5 h-3.5" /> },
              { id: 'enrollment', label: 'Course Enrollment', icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: 'timetable', label: 'Weekly Timetable', icon: <Calendar className="w-3.5 h-3.5" /> },
              { id: 'attendance', label: 'Attendance Records', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
              { id: 'results', label: 'Results & Grades', icon: <GraduationCap className="w-3.5 h-3.5" /> },
              { id: 'fees', label: 'Fee Records & Pay', icon: <CreditCard className="w-3.5 h-3.5" /> },
              { id: 'documents', label: 'Official Documents', icon: <FileText className="w-3.5 h-3.5" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-3.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors shrink-0 ${
                    isActive
                      ? 'border-stone-900 text-stone-900 font-semibold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* 1. OVERVIEW & PROFILE TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Quick KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 block uppercase">Cumulative GPA</span>
                <span className="font-serif text-2xl font-bold text-stone-900">{activeStudent.cgpa}</span>
                <span className="text-[10px] text-stone-400 font-mono block mt-0.5">Scale: 4.00</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 block uppercase">Credits Completed</span>
                <span className="font-serif text-2xl font-bold text-stone-900">{activeStudent.credit_completed}</span>
                <span className="text-[10px] text-stone-400 font-mono block mt-0.5">of 132 Required</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 block uppercase">Current Enrolled</span>
                <span className="font-serif text-2xl font-bold text-stone-900">{studentEnrollments.length} Courses</span>
                <span className="font-mono text-[10px] text-stone-400 block mt-0.5">{currentTotalCredits} Credit Hours</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 block uppercase">Standing & Status</span>
                <span className="font-serif text-xl font-bold text-emerald-800">{activeStudent.status}</span>
                <span className="text-[10px] text-stone-400 font-mono block mt-0.5">Good Standing</span>
              </div>
            </div>

            {/* Profile Information Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2 bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
                <h3 className="font-serif text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                  Academic & Personal Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="text-stone-500 font-mono text-[11px] block">Full Name</span>
                    <span className="font-medium text-stone-900 text-sm">{activeStudent.full_name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono text-[11px] block">Registration Number</span>
                    <span className="font-mono font-bold text-stone-900 text-sm">{activeStudent.reg_no}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono text-[11px] block">Department</span>
                    <span className="font-medium text-stone-900">{activeStudent.department_name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono text-[11px] block">Degree Program</span>
                    <span className="font-medium text-stone-900">{activeStudent.program_name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono text-[11px] block">Current Semester</span>
                    <span className="font-medium text-stone-900">Semester {activeStudent.current_semester} (Fall 2026)</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono text-[11px] block">Academic Advisor</span>
                    <span className="font-medium text-stone-900">{activeStudent.advisor_name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono text-[11px] block">Official Email</span>
                    <span className="font-mono text-stone-800">{activeStudent.email}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono text-[11px] block">Contact Phone</span>
                    <span className="font-mono text-stone-800">{activeStudent.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono text-[11px] block">Campus Address</span>
                    <span className="text-stone-800">{activeStudent.address}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-mono text-[11px] block">Emergency Contact</span>
                    <span className="text-stone-800">{activeStudent.emergency_contact}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Documents Sidebar */}
              <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                    Official Certificates & Records
                  </h3>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => handleOpenDoc('admit_card')}
                      className="w-full text-left p-3 rounded-lg border border-stone-200 hover:border-stone-400 bg-stone-50 transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-medium text-stone-900 block">Examination Admit Card</span>
                        <span className="text-[11px] text-stone-500 font-mono">Fall 2026 Finals with QR code</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>

                    <button
                      onClick={() => handleOpenDoc('bonafide')}
                      className="w-full text-left p-3 rounded-lg border border-stone-200 hover:border-stone-400 bg-stone-50 transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-medium text-stone-900 block">Bonafide Student Certificate</span>
                        <span className="text-[11px] text-stone-500 font-mono">For Visa / Internship / Bank</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>

                    <button
                      onClick={() => handleOpenDoc('transcript')}
                      className="w-full text-left p-3 rounded-lg border border-stone-200 hover:border-stone-400 bg-stone-50 transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-medium text-stone-900 block">Academic Transcript</span>
                        <span className="text-[11px] text-stone-500 font-mono">Full Course & CGPA Breakdown</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>

                    <button
                      onClick={() => handleOpenDoc('fee_receipt')}
                      className="w-full text-left p-3 rounded-lg border border-stone-200 hover:border-stone-400 bg-stone-50 transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-medium text-stone-900 block">Bursar Fee Receipt</span>
                        <span className="text-[11px] text-stone-500 font-mono">Cleared Transaction Proof</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 text-stone-500 text-[11px] font-mono">
                  All documents are generated with digital verification hashes for registrar authenticity.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. COURSE ENROLLMENT TAB */}
        {activeTab === 'enrollment' && (
          <div className="space-y-6">
            
            {/* Enrollment Summary Banner */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Fall 2026 Semester Registration
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Registration Window Open · Maximum Credit Cap: 18.0 Credits
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Registered Credits:</span>
                  <span className={`font-mono font-bold text-base ${currentTotalCredits > 18 ? 'text-rose-600' : 'text-stone-900'}`}>
                    {currentTotalCredits} / 18 Credits
                  </span>
                </div>
                <div className="w-32 bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${currentTotalCredits >= 18 ? 'bg-amber-600' : 'bg-stone-900'}`}
                    style={{ width: `${Math.min(100, (currentTotalCredits / 18) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Currently Enrolled Courses */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <h4 className="font-serif text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                Your Registered Courses ({studentEnrollments.length})
              </h4>

              {studentEnrollments.length === 0 ? (
                <p className="text-xs text-stone-500 py-4">You have not registered for any courses this semester.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                        <th className="py-2.5">Course Code</th>
                        <th className="py-2.5">Course Title</th>
                        <th className="py-2.5">Credits</th>
                        <th className="py-2.5">Instructor</th>
                        <th className="py-2.5">Semester</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {studentEnrollments.map((enr) => (
                        <tr key={enr.id} className="hover:bg-stone-50/80">
                          <td className="py-3 font-mono font-bold text-stone-900">{enr.course_code}</td>
                          <td className="py-3 font-medium text-stone-900">{enr.course_title}</td>
                          <td className="py-3 font-mono">{enr.credit_hours} Cr</td>
                          <td className="py-3 text-stone-600">{enr.instructor_name}</td>
                          <td className="py-3 font-mono text-stone-500">{enr.semester_name}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => dropCourse(enr.course_id)}
                              className="px-2.5 py-1 text-[11px] font-medium text-rose-700 hover:text-white hover:bg-rose-700 border border-rose-300 rounded transition-colors"
                            >
                              Drop Course
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Available Courses Catalog to Enroll */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <h4 className="font-serif text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                Available Departmental Courses for Enrollment
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((crs) => {
                  const isEnrolled = studentEnrollments.some((e) => e.course_id === crs.id);
                  return (
                    <div
                      key={crs.id}
                      className="p-4 rounded-lg border border-stone-200 bg-stone-50 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 bg-stone-200 rounded text-stone-900">
                            {crs.course_code}
                          </span>
                          <span className="font-mono text-xs text-stone-500">
                            {crs.credit_hours} Credit Hours
                          </span>
                        </div>

                        <h5 className="font-serif font-semibold text-sm text-stone-900 mb-1">
                          {crs.title}
                        </h5>

                        <p className="text-xs text-stone-600 mb-3 line-clamp-2">
                          {crs.description}
                        </p>

                        <div className="text-[11px] text-stone-600 font-mono space-y-1 mb-3">
                          <div>Instructor: <span className="font-medium text-stone-900">{crs.instructor_name}</span></div>
                          <div>Schedule: {crs.schedule} ({crs.room})</div>
                          <div>Prerequisite: {crs.prerequisites}</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-stone-500">
                          Capacity: {crs.enrolled_count}/{crs.capacity}
                        </span>
                        {isEnrolled ? (
                          <span className="px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded">
                            ✓ Registered
                          </span>
                        ) : (
                          <button
                            onClick={() => enrollCourse(crs.id)}
                            className="px-3 py-1 text-xs font-medium bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors"
                          >
                            + Add Course
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* 3. WEEKLY TIMETABLE TAB */}
        {activeTab === 'timetable' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Weekly Class Timetable & Schedule
                </h3>
                <p className="text-xs text-stone-500 font-mono">Fall 2026 Semester Schedule</p>
              </div>
              <span className="text-xs font-mono bg-stone-100 px-3 py-1 rounded text-stone-700">
                Cambridge Main Campus
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map((day) => {
                const daySlots = timetable.filter((s) => s.day === day);
                return (
                  <div key={day} className="bg-stone-50 rounded-lg p-3 border border-stone-200">
                    <div className="font-serif font-bold text-xs uppercase tracking-wider text-stone-900 pb-2 mb-3 border-b border-stone-200 text-center">
                      {day}
                    </div>

                    {daySlots.length === 0 ? (
                      <p className="text-[11px] text-stone-400 text-center py-6">No scheduled classes</p>
                    ) : (
                      <div className="space-y-3">
                        {daySlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="p-3 bg-white border border-stone-200 rounded shadow-xs text-xs"
                          >
                            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-1">
                              <span>{slot.time_start} - {slot.time_end}</span>
                              <span className="font-bold text-stone-800">{slot.type}</span>
                            </div>

                            <p className="font-mono font-bold text-stone-900">{slot.course_code}</p>
                            <p className="text-stone-700 text-[11px] font-medium leading-tight mb-2">
                              {slot.course_title}
                            </p>

                            <div className="text-[10px] text-stone-500 font-mono pt-1.5 border-t border-stone-100">
                              <p>Room: {slot.room}</p>
                              <p className="truncate">{slot.instructor}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. ATTENDANCE RECORDS TAB */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            
            {/* Attendance Alert Bar */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-stone-700 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-stone-900 block">75% Mandatory Attendance Rule</span>
                <span className="text-stone-600">
                  The University Academic Council strictly enforces a minimum 75% attendance threshold to appear in semester final examinations.
                </span>
              </div>
            </div>

            {/* Course-wise summary */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <h4 className="font-serif text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                Course-Wise Attendance Statistics
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attendanceByCourse.map((c) => (
                  <div
                    key={c.courseId}
                    className={`p-4 rounded-xl border ${
                      c.isAtRisk ? 'border-rose-300 bg-rose-50/40' : 'border-stone-200 bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-xs text-stone-900">{c.courseCode}</span>
                      <span className={`font-mono font-bold text-sm ${c.isAtRisk ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {c.percentage}% Attendance
                      </span>
                    </div>

                    <p className="font-medium text-xs text-stone-800 mb-3">{c.courseTitle}</p>

                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full ${c.isAtRisk ? 'bg-rose-600' : 'bg-emerald-600'}`}
                        style={{ width: `${c.percentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-600">
                      <span>Total Sessions: {c.totalSessions}</span>
                      <span>Attended: {c.presentCount}</span>
                      <span>Absences: {c.absentCount}</span>
                    </div>

                    {c.isAtRisk && (
                      <div className="mt-3 p-2 bg-rose-100 text-rose-800 rounded text-[11px] font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Warning: Attendance below 75% exam cutoff threshold.</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Attendance Session Log */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <h4 className="font-serif text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                Recent Lecture Attendance Logs
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Course Code</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {studentAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-stone-50">
                        <td className="py-2.5 font-mono text-stone-700">{rec.session_date}</td>
                        <td className="py-2.5 font-mono font-bold text-stone-900">{rec.course_code}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                            rec.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                            rec.status === 'Late' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-stone-500 text-[11px]">{rec.remarks || 'Regular biometric log'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 5. RESULTS & GRADES TAB */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Fall 2026 Semester Gradebook
                </h3>
                <p className="text-xs text-stone-500 font-mono">Published Academic Marks & GPA Record</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[11px] text-stone-500 uppercase font-mono block">Semester GPA</span>
                  <span className="font-serif font-bold text-xl text-stone-900">3.88</span>
                </div>
                <div className="text-right border-l border-stone-200 pl-6">
                  <span className="text-[11px] text-stone-500 uppercase font-mono block">Cumulative CGPA</span>
                  <span className="font-serif font-bold text-xl text-emerald-800">{activeStudent.cgpa}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                      <th className="py-2.5">Course</th>
                      <th className="py-2.5 text-center">Midterm (30)</th>
                      <th className="py-2.5 text-center">Final (50)</th>
                      <th className="py-2.5 text-center">Asg (10)</th>
                      <th className="py-2.5 text-center">Quiz (10)</th>
                      <th className="py-2.5 text-center">Total (100)</th>
                      <th className="py-2.5 text-center">Grade</th>
                      <th className="py-2.5 text-center">GP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {studentResults.map((r) => (
                      <tr key={r.id} className="hover:bg-stone-50">
                        <td className="py-3 font-semibold text-stone-900">
                          {r.course_code}
                          <span className="block font-normal text-stone-500 text-[11px]">{r.course_title}</span>
                        </td>
                        <td className="py-3 text-center font-mono">{r.midterm_marks}</td>
                        <td className="py-3 text-center font-mono">{r.final_marks}</td>
                        <td className="py-3 text-center font-mono">{r.assignment_marks}</td>
                        <td className="py-3 text-center font-mono">{r.quiz_marks}</td>
                        <td className="py-3 text-center font-mono font-bold text-stone-900">{r.total_marks}</td>
                        <td className="py-3 text-center">
                          <span className="font-serif font-bold text-sm px-2 py-0.5 rounded bg-stone-100 text-stone-900">
                            {r.grade}
                          </span>
                        </td>
                        <td className="py-3 text-center font-mono font-semibold text-stone-800">{r.grade_point.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Official grading scale conforms to HEC and international university GPA metrics.
                </span>
                <button
                  onClick={() => handleOpenDoc('transcript')}
                  className="px-3.5 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Unofficial Transcript</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* 6. FEE RECORDS & ONLINE PAY TAB */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Student Fee Ledger & Online Clearance
                </h3>
                <p className="text-xs text-stone-500 font-mono">Bursar Office · Challans & Receipts</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenDoc('fee_receipt')}
                  className="px-3 py-1.5 text-xs font-medium border border-stone-300 rounded-lg hover:bg-stone-50 text-stone-800 transition-colors"
                >
                  View Cleared Receipt
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentFees.map((fee) => (
                <div
                  key={fee.id}
                  className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded">
                        {fee.challan_no}
                      </span>
                      <span className={`font-mono text-xs px-2.5 py-0.5 rounded font-bold ${
                        fee.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {fee.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-semibold text-stone-900 mb-1">
                      {fee.semester_name}
                    </h4>

                    <div className="text-xs text-stone-600 font-mono space-y-1 mb-4">
                      <div>Issued: {fee.issue_date} · Due Date: {fee.due_date}</div>
                    </div>

                    <div className="bg-stone-50 rounded-lg p-3 text-xs space-y-1.5 border border-stone-200/80 mb-4">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Tuition Fee:</span>
                        <span className="font-mono">${fee.tuition_fee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Laboratory Fee:</span>
                        <span className="font-mono">${fee.lab_fee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Library & IT Access:</span>
                        <span className="font-mono">${fee.library_fee.toLocaleString()}</span>
                      </div>
                      {fee.discount > 0 && (
                        <div className="flex justify-between text-emerald-800 font-medium">
                          <span>Academic Merit Scholarship:</span>
                          <span className="font-mono">-${fee.discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                        <span>Net Payable:</span>
                        <span className="font-mono">${fee.total_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    {fee.status === 'Paid' ? (
                      <div className="text-[11px] font-mono text-stone-500">
                        Paid on {fee.paid_at} via {fee.payment_method}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full justify-end">
                        <button
                          onClick={() => payFee(fee.id, 'Credit Card (Mastercard ···· 8192)')}
                          className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                        >
                          Simulate Instant Online Payment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 7. OFFICIAL DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Official University Downloadable Records & Letters
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Digitally authenticated documents with registrar verification
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-semibold text-sm text-stone-900">Semester Final Admit Card</h4>
                  <p className="text-xs text-stone-600 mt-0.5">Required for exam hall entry with QR biometric tag</p>
                </div>
                <button
                  onClick={() => handleOpenDoc('admit_card')}
                  className="px-3.5 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  View & Print
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-semibold text-sm text-stone-900">Bonafide Student Certificate</h4>
                  <p className="text-xs text-stone-600 mt-0.5">Official letter of student enrollment and standing</p>
                </div>
                <button
                  onClick={() => handleOpenDoc('bonafide')}
                  className="px-3.5 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  View & Print
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-semibold text-sm text-stone-900">Bursar Clearance Fee Receipt</h4>
                  <p className="text-xs text-stone-600 mt-0.5">Detailed breakdown of tuition and clearance</p>
                </div>
                <button
                  onClick={() => handleOpenDoc('fee_receipt')}
                  className="px-3.5 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  View & Print
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-semibold text-sm text-stone-900">Cumulative Academic Transcript</h4>
                  <p className="text-xs text-stone-600 mt-0.5">Complete record of courses, letter grades & CGPA</p>
                </div>
                <button
                  onClick={() => handleOpenDoc('transcript')}
                  className="px-3.5 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  View & Print
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Document Print & Download Modal */}
      <DocumentModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        docType={selectedDocType}
        student={activeStudent}
        enrollments={enrollments}
        results={results}
        feeRecords={feeRecords}
      />

      {/* Register New Student Modal */}
      {showRegisterStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-md w-full p-6">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">Register Student Profile</h3>
            <p className="text-xs text-stone-500 mb-4">Create a new student record to test multi-student views.</p>
            
            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newRegName}
                  onChange={(e) => setNewRegName(e.target.value)}
                  placeholder="e.g. Kenneth Clarke"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newRegEmail}
                  onChange={(e) => setNewRegEmail(e.target.value)}
                  placeholder="k.clarke@apex.edu"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newRegPhone}
                  onChange={(e) => setNewRegPhone(e.target.value)}
                  placeholder="+1 (555) 728-9900"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowRegisterStudent(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
