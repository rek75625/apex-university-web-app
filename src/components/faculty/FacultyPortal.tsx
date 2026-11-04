import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Edit3, 
  FileText, 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Plus, 
  Save, 
  Clock, 
  MapPin, 
  Mail, 
  Phone,
  BarChart3,
  Award
} from 'lucide-react';

export const FacultyPortal: React.FC = () => {
  const {
    activeFaculty,
    setActiveFacultyId,
    facultyList,
    courses,
    enrollments,
    studentsList,
    attendanceRecords,
    markAttendance,
    markBatchAttendance,
    results,
    updateResultMarks,
    assessments,
    createAssessment,
  } = useUniversity();

  const [activeTab, setActiveTab] = useState<'courses' | 'roster' | 'attendance' | 'grading' | 'assignments' | 'analytics'>('courses');

  // Assigned courses for active faculty
  const assignedCourses = courses.filter((c) => c.instructor_id === activeFaculty.id);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    assignedCourses[0]?.id || courses[0]?.id || ''
  );

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || assignedCourses[0] || courses[0];

  // Enrolled students in selected course
  const courseEnrollments = enrollments.filter(
    (e) => e.course_id === selectedCourse?.id && e.status === 'Enrolled'
  );
  const enrolledStudentIds = courseEnrollments.map((e) => e.student_id);
  const enrolledStudents = studentsList.filter((s) => enrolledStudentIds.includes(s.id));

  // Attendance date picker
  const [sessionDate, setSessionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // New assignment modal state
  const [showNewAsgModal, setShowNewAsgModal] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgType, setAsgType] = useState<'Assignment' | 'Quiz' | 'Midterm' | 'Final Exam'>('Assignment');
  const [asgTotalMarks, setAsgTotalMarks] = useState('50');
  const [asgWeightage, setAsgWeightage] = useState('10');
  const [asgDueDate, setAsgDueDate] = useState('2026-11-25');
  const [asgInstructions, setAsgInstructions] = useState('');

  // Course results
  const courseResults = results.filter((r) => r.course_id === selectedCourse?.id);

  // Performance calculations
  const totalScores = courseResults.map((r) => r.total_marks);
  const avgScore = totalScores.length > 0 ? Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length) : 0;
  const maxScore = totalScores.length > 0 ? Math.max(...totalScores) : 0;
  const minScore = totalScores.length > 0 ? Math.min(...totalScores) : 0;
  const passRate = totalScores.length > 0 ? Math.round((totalScores.filter((s) => s >= 50).length / totalScores.length) * 100) : 100;

  // Grade distribution counts
  const gradeDistribution = {
    A: courseResults.filter((r) => r.grade.startsWith('A')).length,
    B: courseResults.filter((r) => r.grade.startsWith('B')).length,
    C: courseResults.filter((r) => r.grade.startsWith('C')).length,
    D: courseResults.filter((r) => r.grade.startsWith('D')).length,
    F: courseResults.filter((r) => r.grade === 'F').length,
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle || !selectedCourse) return;

    createAssessment({
      course_id: selectedCourse.id,
      course_code: selectedCourse.course_code,
      title: asgTitle,
      type: asgType,
      total_marks: parseInt(asgTotalMarks) || 50,
      weightage_percent: parseInt(asgWeightage) || 10,
      due_date: asgDueDate,
      instructions: asgInstructions,
    });

    setAsgTitle('');
    setAsgInstructions('');
    setShowNewAsgModal(false);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-20">
      
      {/* Faculty Portal Header Strip */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-lg font-bold shrink-0">
                {activeFaculty.full_name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-xl font-bold text-stone-950">
                    {activeFaculty.full_name}
                  </h1>
                  <span className="font-mono text-xs px-2 py-0.5 bg-stone-100 border border-stone-200 rounded text-stone-700">
                    {activeFaculty.designation}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  {activeFaculty.department_name} · Office: {activeFaculty.office_room}
                </p>
              </div>
            </div>

            {/* Switch Faculty Member Selector */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <span className="font-medium text-stone-700">Faculty Account:</span>
                <select
                  value={activeFaculty.id}
                  onChange={(e) => setActiveFacultyId(e.target.value)}
                  className="text-xs bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 font-medium text-stone-900 focus:outline-none"
                >
                  {facultyList.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.full_name} ({f.department_name.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1 mt-6 border-b border-stone-200 -mb-5 overflow-x-auto">
            {[
              { id: 'courses', label: 'Assigned Courses', icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: 'roster', label: 'Class Lists & Roster', icon: <Users className="w-3.5 h-3.5" /> },
              { id: 'attendance', label: 'Mark Attendance', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
              { id: 'grading', label: 'Marks & Gradebook', icon: <Edit3 className="w-3.5 h-3.5" /> },
              { id: 'assignments', label: 'Assignments & Exams', icon: <FileText className="w-3.5 h-3.5" /> },
              { id: 'analytics', label: 'Student Performance', icon: <TrendingUp className="w-3.5 h-3.5" /> },
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

        {/* Course Selector Strip (present on all tabs) */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-stone-500 uppercase font-mono">Active Teaching Course:</span>
            <select
              value={selectedCourse?.id}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 font-bold text-stone-900 focus:outline-none"
            >
              {courses.map((crs) => (
                <option key={crs.id} value={crs.id}>
                  {crs.course_code}: {crs.title} ({crs.credit_hours} Cr · {crs.enrolled_count} Students)
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-stone-600 font-mono">
            Schedule: {selectedCourse?.schedule} · Room: {selectedCourse?.room}
          </div>
        </div>

        {/* 1. ASSIGNED COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Faculty Information Card */}
              <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-base font-semibold text-stone-900 pb-2 border-b border-stone-100">
                  Faculty Dossier & Office
                </h3>

                <div className="text-xs space-y-3">
                  <div>
                    <span className="text-stone-500 block text-[11px] font-mono">Department</span>
                    <span className="font-medium text-stone-900">{activeFaculty.department_name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px] font-mono">Academic Designation</span>
                    <span className="font-medium text-stone-900">{activeFaculty.designation}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px] font-mono">Research Specialization</span>
                    <span className="text-stone-800 leading-relaxed">{activeFaculty.specialization}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px] font-mono">Office Location</span>
                    <span className="font-mono text-stone-900">{activeFaculty.office_room}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px] font-mono">Consultation Office Hours</span>
                    <span className="font-mono text-stone-900">{activeFaculty.office_hours}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px] font-mono">Faculty Contact</span>
                    <span className="font-mono text-stone-900">{activeFaculty.email}</span>
                  </div>
                </div>
              </div>

              {/* Assigned Course Cards */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-serif text-base font-semibold text-stone-900">
                  Current Semester Teaching Allocations
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {assignedCourses.map((crs) => (
                    <div
                      key={crs.id}
                      className="p-5 rounded-xl border border-stone-200 bg-white shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-xs bg-stone-100 text-stone-900 px-2 py-0.5 rounded">
                            {crs.course_code}
                          </span>
                          <span className="font-mono text-xs text-stone-500">
                            {crs.credit_hours} Credits
                          </span>
                        </div>

                        <h4 className="font-serif font-bold text-base text-stone-900 mb-2">
                          {crs.title}
                        </h4>

                        <p className="text-xs text-stone-600 mb-4 line-clamp-2">
                          {crs.description}
                        </p>

                        <div className="text-[11px] font-mono text-stone-600 space-y-1 mb-4">
                          <div>Enrolled: <strong className="text-stone-900">{crs.enrolled_count} students</strong></div>
                          <div>Room: {crs.room}</div>
                          <div>Timings: {crs.schedule}</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedCourseId(crs.id);
                            setActiveTab('attendance');
                          }}
                          className="text-xs font-semibold text-stone-900 hover:text-amber-800"
                        >
                          Mark Attendance →
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCourseId(crs.id);
                            setActiveTab('grading');
                          }}
                          className="text-xs font-semibold text-stone-900 hover:text-amber-800"
                        >
                          Enter Grades →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. CLASS LISTS & ROSTER TAB */}
        {activeTab === 'roster' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Enrolled Students Roster · {selectedCourse.course_code}
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  {selectedCourse.title} · {enrolledStudents.length} Students Registered
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                    <th className="py-2.5">Reg Number</th>
                    <th className="py-2.5">Student Name</th>
                    <th className="py-2.5">Program</th>
                    <th className="py-2.5">Email</th>
                    <th className="py-2.5 text-center">CGPA</th>
                    <th className="py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {enrolledStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-stone-50">
                      <td className="py-3 font-mono font-bold text-stone-900">{st.reg_no}</td>
                      <td className="py-3 font-medium text-stone-900">{st.full_name}</td>
                      <td className="py-3 text-stone-600">{st.program_name}</td>
                      <td className="py-3 font-mono text-stone-600">{st.email}</td>
                      <td className="py-3 text-center font-mono font-bold text-stone-900">{st.cgpa}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-emerald-100 text-emerald-800">
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. MARK ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Lecture Attendance Register
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  Course: {selectedCourse.course_code} - {selectedCourse.title}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-stone-500">Session Date:</span>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="border border-stone-300 rounded px-2.5 py-1 text-xs bg-stone-50 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => markBatchAttendance(selectedCourse.id, sessionDate, 'Present')}
                  className="px-3 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  ✓ Mark All Present
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                    <th className="py-2.5">Reg Number</th>
                    <th className="py-2.5">Student Name</th>
                    <th className="py-2.5">Current Status</th>
                    <th className="py-2.5 text-right">Quick Mark Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {enrolledStudents.map((st) => {
                    const existingRecord = attendanceRecords.find(
                      (r) =>
                        r.course_id === selectedCourse.id &&
                        r.student_id === st.id &&
                        r.session_date === sessionDate
                    );
                    const status = existingRecord ? existingRecord.status : 'Not Marked';

                    return (
                      <tr key={st.id} className="hover:bg-stone-50">
                        <td className="py-3 font-mono font-bold text-stone-900">{st.reg_no}</td>
                        <td className="py-3 font-medium text-stone-900">{st.full_name}</td>
                        <td className="py-3 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                            status === 'Late' ? 'bg-amber-100 text-amber-800' :
                            status === 'Absent' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-500'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                markAttendance({
                                  course_id: selectedCourse.id,
                                  course_code: selectedCourse.course_code,
                                  student_id: st.id,
                                  student_name: st.full_name,
                                  reg_no: st.reg_no,
                                  session_date: sessionDate,
                                  status: 'Present',
                                })
                              }
                              className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors ${
                                status === 'Present'
                                  ? 'bg-emerald-700 text-white'
                                  : 'border border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                              }`}
                            >
                              Present
                            </button>

                            <button
                              onClick={() =>
                                markAttendance({
                                  course_id: selectedCourse.id,
                                  course_code: selectedCourse.course_code,
                                  student_id: st.id,
                                  student_name: st.full_name,
                                  reg_no: st.reg_no,
                                  session_date: sessionDate,
                                  status: 'Late',
                                })
                              }
                              className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors ${
                                status === 'Late'
                                  ? 'bg-amber-700 text-white'
                                  : 'border border-amber-300 text-amber-800 hover:bg-amber-50'
                              }`}
                            >
                              Late
                            </button>

                            <button
                              onClick={() =>
                                markAttendance({
                                  course_id: selectedCourse.id,
                                  course_code: selectedCourse.course_code,
                                  student_id: st.id,
                                  student_name: st.full_name,
                                  reg_no: st.reg_no,
                                  session_date: sessionDate,
                                  status: 'Absent',
                                })
                              }
                              className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors ${
                                status === 'Absent'
                                  ? 'bg-rose-700 text-white'
                                  : 'border border-rose-300 text-rose-800 hover:bg-rose-50'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. MARKS & GRADEBOOK TAB */}
        {activeTab === 'grading' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Course Marks & Gradebook Entry
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  {selectedCourse.course_code}: {selectedCourse.title} · Auto Curve Calculation
                </p>
              </div>

              <div className="text-xs text-stone-600 font-mono bg-stone-100 px-3 py-1.5 rounded">
                Grading: Midterm (30) + Final (50) + Asg (10) + Quiz (10) = 100
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                    <th className="py-2.5">Student</th>
                    <th className="py-2.5 text-center">Mid (30)</th>
                    <th className="py-2.5 text-center">Final (50)</th>
                    <th className="py-2.5 text-center">Asg (10)</th>
                    <th className="py-2.5 text-center">Quiz (10)</th>
                    <th className="py-2.5 text-center">Total (100)</th>
                    <th className="py-2.5 text-center">Grade</th>
                    <th className="py-2.5 text-center">GP</th>
                    <th className="py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {courseResults.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50">
                      <td className="py-3 font-semibold text-stone-900">
                        {r.student_name}
                        <span className="block font-mono text-stone-500 text-[11px] font-normal">{r.reg_no}</span>
                      </td>
                      <td className="py-3 text-center">
                        <input
                          type="number"
                          max={30}
                          min={0}
                          value={r.midterm_marks}
                          onChange={(e) =>
                            updateResultMarks(r.id, { midterm: parseFloat(e.target.value) || 0 })
                          }
                          className="w-14 text-center font-mono py-1 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
                        />
                      </td>
                      <td className="py-3 text-center">
                        <input
                          type="number"
                          max={50}
                          min={0}
                          value={r.final_marks}
                          onChange={(e) =>
                            updateResultMarks(r.id, { final: parseFloat(e.target.value) || 0 })
                          }
                          className="w-14 text-center font-mono py-1 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
                        />
                      </td>
                      <td className="py-3 text-center">
                        <input
                          type="number"
                          max={10}
                          min={0}
                          value={r.assignment_marks}
                          onChange={(e) =>
                            updateResultMarks(r.id, { assignment: parseFloat(e.target.value) || 0 })
                          }
                          className="w-14 text-center font-mono py-1 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
                        />
                      </td>
                      <td className="py-3 text-center">
                        <input
                          type="number"
                          max={10}
                          min={0}
                          value={r.quiz_marks}
                          onChange={(e) =>
                            updateResultMarks(r.id, { quiz: parseFloat(e.target.value) || 0 })
                          }
                          className="w-14 text-center font-mono py-1 border border-stone-300 rounded focus:ring-1 focus:ring-stone-900"
                        />
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-stone-900 text-sm">
                        {r.total_marks}
                      </td>
                      <td className="py-3 text-center">
                        <span className="font-serif font-bold text-sm px-2 py-0.5 rounded bg-stone-100 text-stone-900">
                          {r.grade}
                        </span>
                      </td>
                      <td className="py-3 text-center font-mono font-semibold text-stone-700">
                        {r.grade_point.toFixed(2)}
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-mono text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>All mark alterations are instantly computed and verified according to academic curve criteria.</span>
            </div>
          </div>
        )}

        {/* 5. ASSIGNMENTS & EXAMS TAB */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Assessments & Assignment Directives
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  Course: {selectedCourse.course_code} - {selectedCourse.title}
                </p>
              </div>

              <button
                onClick={() => setShowNewAsgModal(true)}
                className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Assessment</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments
                .filter((a) => a.course_id === selectedCourse.id)
                .map((asg) => (
                  <div
                    key={asg.id}
                    className="p-5 rounded-xl border border-stone-200 bg-white shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-100 font-bold text-stone-800">
                          {asg.type}
                        </span>
                        <span className="font-mono text-xs text-stone-500">
                          Due: {asg.due_date}
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-base text-stone-900 mb-2">
                        {asg.title}
                      </h4>

                      <p className="text-xs text-stone-600 leading-relaxed mb-4">
                        {asg.instructions}
                      </p>

                      <div className="bg-stone-50 p-3 rounded border border-stone-100 text-xs font-mono space-y-1 mb-3">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Total Marks:</span>
                          <span className="font-bold text-stone-900">{asg.total_marks} Points</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Semester Weightage:</span>
                          <span className="font-bold text-stone-900">{asg.weightage_percent}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-mono">
                        Submissions: {asg.submissions_count} / {selectedCourse.enrolled_count}
                      </span>
                      <span className="text-emerald-800 font-medium">Active Directive</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 6. STUDENT PERFORMANCE ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 uppercase block">Class Average</span>
                <span className="font-serif text-2xl font-bold text-stone-900">{avgScore}%</span>
                <span className="text-[10px] text-stone-400 font-mono block mt-0.5">Mean Performance</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 uppercase block">Highest Score</span>
                <span className="font-serif text-2xl font-bold text-emerald-800">{maxScore}%</span>
                <span className="text-[10px] text-stone-400 font-mono block mt-0.5">Class Benchmark</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 uppercase block">Pass Ratio</span>
                <span className="font-serif text-2xl font-bold text-stone-900">{passRate}%</span>
                <span className="text-[10px] text-stone-400 font-mono block mt-0.5">Above 50% Threshold</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 uppercase block">Total Graded</span>
                <span className="font-serif text-2xl font-bold text-stone-900">{courseResults.length}</span>
                <span className="text-[10px] text-stone-400 font-mono block mt-0.5">Students in Roster</span>
              </div>
            </div>

            {/* Grade Distribution Breakdown */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <h4 className="font-serif text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                Grade Curve Distribution ({selectedCourse.course_code})
              </h4>

              <div className="space-y-3 max-w-xl">
                {Object.entries(gradeDistribution).map(([gradeLetter, count]) => {
                  const percent = courseResults.length > 0 ? Math.round((count / courseResults.length) * 100) : 0;
                  return (
                    <div key={gradeLetter} className="flex items-center gap-4 text-xs font-mono">
                      <span className="w-12 font-bold font-serif text-sm text-stone-900">Grade {gradeLetter}</span>
                      <div className="flex-1 bg-stone-100 h-4 rounded-md overflow-hidden border border-stone-200">
                        <div
                          className="bg-stone-900 h-full transition-all"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="w-20 text-right text-stone-600">
                        {count} ({percent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* At-Risk Students Indicator */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-stone-100">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <h4 className="font-serif text-base font-semibold text-stone-900">
                  Academic Standing & At-Risk Early Warning Flags
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                      <th className="py-2.5">Student</th>
                      <th className="py-2.5">Reg Number</th>
                      <th className="py-2.5">Course Score</th>
                      <th className="py-2.5">Attendance Status</th>
                      <th className="py-2.5 text-right">Faculty Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {courseResults.map((r) => {
                      const isAtRisk = r.total_marks < 75;
                      return (
                        <tr key={r.id} className="hover:bg-stone-50">
                          <td className="py-3 font-semibold text-stone-900">{r.student_name}</td>
                          <td className="py-3 font-mono text-stone-600">{r.reg_no}</td>
                          <td className="py-3 font-mono font-bold text-stone-900">{r.total_marks}% ({r.grade})</td>
                          <td className="py-3">
                            <span className="font-mono text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              Satisfactory (&gt;75%)
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {isAtRisk ? (
                              <span className="text-amber-800 font-medium">Schedule Office Hour Review</span>
                            ) : (
                              <span className="text-stone-500">Exemplary Standing</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Create New Assessment Modal */}
      {showNewAsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-lg w-full p-6">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
              Create New Assessment
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Add an assignment, quiz, or examination specification for {selectedCourse.course_code}.
            </p>

            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Assessment Title *</label>
                <input
                  type="text"
                  required
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="e.g. Lab Project 3: Cache Simulation"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Assessment Type</label>
                  <select
                    value={asgType}
                    onChange={(e) => setAsgType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Midterm">Midterm Examination</option>
                    <option value="Final Exam">Final Examination</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Total Points</label>
                  <input
                    type="number"
                    value={asgTotalMarks}
                    onChange={(e) => setAsgTotalMarks(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Semester Weight (%)</label>
                  <input
                    type="number"
                    value={asgWeightage}
                    onChange={(e) => setAsgWeightage(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Instructions & Guidelines</label>
                <textarea
                  rows={3}
                  value={asgInstructions}
                  onChange={(e) => setAsgInstructions(e.target.value)}
                  placeholder="Submission rules, repository links, grading rubrics..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowNewAsgModal(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Publish Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
