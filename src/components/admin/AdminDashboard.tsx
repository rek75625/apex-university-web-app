import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { ROLE_PERMISSIONS_MATRIX } from '../../data/seedData';
import { 
  Users, 
  Building2, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  Check, 
  X, 
  Download, 
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    studentsList,
    facultyList,
    departments,
    programs,
    courses,
    semesters,
    applications,
    updateApplicationStatus,
    feeRecords,
    createFeeChallan,
    announcements,
    createAnnouncement,
    events,
    addCourse,
    addStudent,
    addFaculty,
    addDepartment,
    addProgram,
    showToast
  } = useUniversity();

  const [activeTab, setActiveTab] = useState<'overview' | 'students_faculty' | 'departments_programs' | 'courses' | 'admissions' | 'fees' | 'notices' | 'roles' | 'reports'>('overview');

  // Search & filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [facultySearch, setFacultySearch] = useState('');
  const [appFilter, setAppFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  // Modals
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDept, setNewCourseDept] = useState(departments[0]?.id || '');
  const [newCourseCredits, setNewCourseCredits] = useState('3');
  const [newCourseInstructor, setNewCourseInstructor] = useState(facultyList[0]?.id || '');
  const [newCourseSchedule, setNewCourseSchedule] = useState('Mon, Wed 10:00 - 11:30');
  const [newCourseRoom, setNewCourseRoom] = useState('Hall 201');

  // New Notice Modal
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCat, setNoticeCat] = useState<'Academic' | 'Admissions' | 'Examination' | 'Campus Life' | 'Research'>('Academic');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<'All' | 'Students' | 'Faculty' | 'Public'>('All');

  // New Challan Modal
  const [showChallanModal, setShowChallanModal] = useState(false);
  const [challanStudentId, setChallanStudentId] = useState(studentsList[0]?.id || '');
  const [challanTuition, setChallanTuition] = useState('2450');
  const [challanLab, setChallanLab] = useState('300');
  const [challanLib, setChallanLib] = useState('120');
  const [challanDiscount, setChallanDiscount] = useState('0');

  // Filtered applications
  const filteredApps = applications.filter((a) => {
    if (appFilter === 'All') return true;
    return a.status === appFilter;
  });

  // Analytics summary
  const totalStudentsCount = studentsList.length;
  const totalFacultyCount = facultyList.length;
  const totalCoursesCount = courses.length;
  const pendingAppsCount = applications.filter((a) => a.status === 'Pending').length;
  const totalRevenueCollected = feeRecords
    .filter((f) => f.status === 'Paid')
    .reduce((sum, f) => sum + f.total_amount, 0);
  const totalPendingFees = feeRecords
    .filter((f) => f.status !== 'Paid')
    .reduce((sum, f) => sum + f.total_amount, 0);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseTitle) return;

    const dept = departments.find((d) => d.id === newCourseDept);
    const inst = facultyList.find((f) => f.id === newCourseInstructor);

    addCourse({
      course_code: newCourseCode,
      title: newCourseTitle,
      department_id: newCourseDept,
      department_name: dept ? dept.name : 'Engineering',
      credit_hours: parseInt(newCourseCredits) || 3,
      prerequisites: 'Foundations of Computer Science',
      description: 'Comprehensive university course offering with theory and laboratory sessions.',
      instructor_id: newCourseInstructor,
      instructor_name: inst ? inst.full_name : 'Staff Instructor',
      semester_offered: 6,
      schedule: newCourseSchedule,
      room: newCourseRoom,
      capacity: 50,
    });

    setNewCourseCode('');
    setNewCourseTitle('');
    setShowAddCourseModal(false);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    createAnnouncement({
      title: noticeTitle,
      category: noticeCat,
      content: noticeContent,
      author_name: 'System Registrar',
      author_role: 'University Central Secretariat',
      is_pinned: false,
      target_audience: noticeAudience,
    });

    setNoticeTitle('');
    setNoticeContent('');
    setShowNoticeModal(false);
  };

  const handleIssueChallan = (e: React.FormEvent) => {
    e.preventDefault();
    createFeeChallan(
      challanStudentId,
      'sem-2026-fall',
      parseFloat(challanTuition) || 0,
      parseFloat(challanLab) || 0,
      parseFloat(challanLib) || 0,
      parseFloat(challanDiscount) || 0
    );
    setShowChallanModal(false);
  };

  // Export CSV Helper
  const exportStudentsCSV = () => {
    const headers = ['Registration Number', 'Full Name', 'Email', 'Program', 'Department', 'Semester', 'CGPA', 'Status'];
    const rows = studentsList.map((s) => [
      s.reg_no,
      `"${s.full_name}"`,
      s.email,
      `"${s.program_name}"`,
      `"${s.department_name}"`,
      s.current_semester,
      s.cgpa,
      s.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_students_roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported student roster as CSV file', 'success');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-20">
      
      {/* Admin Header Strip */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-stone-950">
                  Apex University Administration Console
                </h1>
                <p className="text-xs text-stone-500 font-mono">
                  Root Academic, Registrar, and Financial Command Center
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportStudentsCSV}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium border border-stone-300 rounded-lg bg-white hover:bg-stone-50 text-stone-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Students CSV</span>
              </button>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-6 border-b border-stone-200 -mb-5 overflow-x-auto">
            {[
              { id: 'overview', label: 'Console Overview', icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { id: 'students_faculty', label: 'Students & Faculty', icon: <Users className="w-3.5 h-3.5" /> },
              { id: 'departments_programs', label: 'Departments & Degrees', icon: <Building2 className="w-3.5 h-3.5" /> },
              { id: 'courses', label: 'Courses & Semesters', icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: 'admissions', label: 'Admissions Queue', icon: <GraduationCap className="w-3.5 h-3.5" />, badge: pendingAppsCount },
              { id: 'fees', label: 'Fee Management', icon: <CreditCard className="w-3.5 h-3.5" /> },
              { id: 'notices', label: 'Notices & Events', icon: <Bell className="w-3.5 h-3.5" /> },
              { id: 'roles', label: 'Roles & Permissions', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
              { id: 'reports', label: 'Reports & Analytics', icon: <TrendingUp className="w-3.5 h-3.5" /> },
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
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 uppercase block">Total Students</span>
                <span className="font-serif text-3xl font-bold text-stone-900">{totalStudentsCount}</span>
                <span className="text-[11px] text-stone-500 font-mono block mt-1">Across 4 Departments</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 uppercase block">Active Faculty</span>
                <span className="font-serif text-3xl font-bold text-stone-900">{totalFacultyCount}</span>
                <span className="text-[11px] text-stone-500 font-mono block mt-1">Teaching & Research</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 uppercase block">Admissions Pending</span>
                <span className="font-serif text-3xl font-bold text-amber-700">{pendingAppsCount}</span>
                <span className="text-[11px] text-stone-500 font-mono block mt-1">Awaiting Committee Review</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
                <span className="text-[11px] font-mono text-stone-500 uppercase block">Collected Revenue</span>
                <span className="font-serif text-3xl font-bold text-emerald-800">${totalRevenueCollected.toLocaleString()}</span>
                <span className="text-[11px] text-stone-500 font-mono block mt-1">Pending: ${totalPendingFees.toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2 bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
                <h3 className="font-serif text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                  Recent Admission Applications Queue
                </h3>

                <div className="space-y-3">
                  {applications.slice(0, 4).map((app) => (
                    <div
                      key={app.id}
                      className="p-3 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{app.applicant_name}</span>
                          <span className="font-mono text-[11px] text-stone-500">{app.tracking_no}</span>
                        </div>
                        <p className="text-stone-600 font-mono text-[11px] mt-0.5">
                          {app.program_name} · Score: {app.cgpa_or_percentage}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                          app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {app.status}
                        </span>
                        <button
                          onClick={() => setActiveTab('admissions')}
                          className="text-stone-700 hover:text-stone-900 font-medium ml-2"
                        >
                          Review →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Administrative Quick Actions */}
              <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                    Administrator Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowAddCourseModal(true)}
                      className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-900 flex items-center justify-between"
                    >
                      <span>+ Create New Course</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                    <button
                      onClick={() => setShowNoticeModal(true)}
                      className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-900 flex items-center justify-between"
                    >
                      <span>+ Publish University Notice</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                    <button
                      onClick={() => setShowChallanModal(true)}
                      className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-900 flex items-center justify-between"
                    >
                      <span>+ Issue Semester Fee Challan</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                    <button
                      onClick={() => setActiveTab('roles')}
                      className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-900 flex items-center justify-between"
                    >
                      <span>Inspect RBAC Roles Matrix</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 text-[11px] font-mono text-stone-500">
                  Apex Management v2.4 · PostgreSQL Schema In Sync
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. STUDENTS & FACULTY MANAGEMENT TAB */}
        {activeTab === 'students_faculty' && (
          <div className="space-y-6">
            
            {/* Students Table */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-stone-900">
                    Master Student Directory
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Total {studentsList.length} enrolled academic scholars
                  </p>
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by name, reg no..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                      <th className="py-2.5">Reg Number</th>
                      <th className="py-2.5">Full Name</th>
                      <th className="py-2.5">Program</th>
                      <th className="py-2.5">Department</th>
                      <th className="py-2.5 text-center">Semester</th>
                      <th className="py-2.5 text-center">CGPA</th>
                      <th className="py-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {studentsList
                      .filter((s) =>
                        s.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        s.reg_no.toLowerCase().includes(studentSearch.toLowerCase())
                      )
                      .map((st) => (
                        <tr key={st.id} className="hover:bg-stone-50">
                          <td className="py-3 font-mono font-bold text-stone-900">{st.reg_no}</td>
                          <td className="py-3 font-semibold text-stone-900">{st.full_name}</td>
                          <td className="py-3 text-stone-600">{st.program_name}</td>
                          <td className="py-3 text-stone-600">{st.department_name}</td>
                          <td className="py-3 text-center font-mono">{st.current_semester}</td>
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

            {/* Faculty Table */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-stone-900">
                    Academic Faculty Directory
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Total {facultyList.length} faculty professors and chairs
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                      <th className="py-2.5">Faculty ID</th>
                      <th className="py-2.5">Name</th>
                      <th className="py-2.5">Department</th>
                      <th className="py-2.5">Designation</th>
                      <th className="py-2.5">Office</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {facultyList.map((f) => (
                      <tr key={f.id} className="hover:bg-stone-50">
                        <td className="py-3 font-mono font-bold text-stone-900">{f.faculty_code}</td>
                        <td className="py-3 font-semibold text-stone-900">
                          {f.full_name}
                          <span className="block font-mono text-stone-500 text-[11px] font-normal">{f.email}</span>
                        </td>
                        <td className="py-3 text-stone-600">{f.department_name}</td>
                        <td className="py-3 font-medium text-stone-800">{f.designation}</td>
                        <td className="py-3 font-mono text-stone-600">{f.office_room}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-emerald-100 text-emerald-800">
                            {f.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 3. DEPARTMENTS & PROGRAMS MANAGEMENT TAB */}
        {activeTab === 'departments_programs' && (
          <div className="space-y-6">
            
            {/* Departments */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-semibold text-stone-900 pb-2 border-b border-stone-100">
                University Academic Departments
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="p-4 rounded-lg border border-stone-200 bg-stone-50 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold bg-stone-200 px-2 py-0.5 rounded text-stone-900">{dept.code}</span>
                      <span className="font-mono text-stone-500">Building: {dept.building}</span>
                    </div>
                    <h4 className="font-serif font-bold text-base text-stone-900 mb-1">{dept.name}</h4>
                    <p className="text-stone-600 mb-3">{dept.description}</p>
                    <div className="pt-2 border-t border-stone-200 flex justify-between text-stone-500 font-mono text-[11px]">
                      <span>Head: <strong>{dept.head_faculty_name}</strong></span>
                      <span>Faculty: {dept.faculty_count} · Students: {dept.student_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Programs */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-semibold text-stone-900 pb-2 border-b border-stone-100">
                Authorized Degree Programs
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                      <th className="py-2.5">Code</th>
                      <th className="py-2.5">Program Name</th>
                      <th className="py-2.5">Department</th>
                      <th className="py-2.5 text-center">Duration</th>
                      <th className="py-2.5 text-center">Credits</th>
                      <th className="py-2.5 text-right">Fee / Sem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {programs.map((prog) => (
                      <tr key={prog.id} className="hover:bg-stone-50">
                        <td className="py-3 font-mono font-bold text-stone-900">{prog.code}</td>
                        <td className="py-3 font-semibold text-stone-900">{prog.name}</td>
                        <td className="py-3 text-stone-600">{prog.department_name}</td>
                        <td className="py-3 text-center font-mono">{prog.duration_years} Years</td>
                        <td className="py-3 text-center font-mono">{prog.credit_hours} Cr</td>
                        <td className="py-3 text-right font-mono font-bold text-stone-900">
                          ${prog.fee_per_semester.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 4. COURSES & SEMESTERS TAB */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Course Catalog & Semester Allocations
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  Current Active Semester: Fall 2026 (FA26)
                </p>
              </div>

              <button
                onClick={() => setShowAddCourseModal(true)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Course</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                    <th className="py-2.5">Course Code</th>
                    <th className="py-2.5">Title</th>
                    <th className="py-2.5">Department</th>
                    <th className="py-2.5 text-center">Credits</th>
                    <th className="py-2.5">Assigned Instructor</th>
                    <th className="py-2.5">Schedule & Room</th>
                    <th className="py-2.5 text-right">Enrollment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {courses.map((crs) => (
                    <tr key={crs.id} className="hover:bg-stone-50">
                      <td className="py-3 font-mono font-bold text-stone-900">{crs.course_code}</td>
                      <td className="py-3 font-medium text-stone-900">{crs.title}</td>
                      <td className="py-3 text-stone-600">{crs.department_name}</td>
                      <td className="py-3 text-center font-mono">{crs.credit_hours} Cr</td>
                      <td className="py-3 text-stone-800">{crs.instructor_name}</td>
                      <td className="py-3 font-mono text-[11px] text-stone-600">{crs.schedule} ({crs.room})</td>
                      <td className="py-3 text-right font-mono font-semibold text-stone-900">
                        {crs.enrolled_count} / {crs.capacity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. ADMISSIONS QUEUE TAB */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Admissions Applications Processing Queue
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  Online applications submitted via Public Portal
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setAppFilter(st)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      appFilter === st
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-xl border border-stone-200 bg-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold bg-stone-200 px-2 py-0.5 rounded text-stone-900">
                        {app.tracking_no}
                      </span>
                      <span className="font-semibold text-stone-900 text-sm">{app.applicant_name}</span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500 font-mono">Submitted: {app.submitted_at}</span>
                    </div>

                    <div className="text-stone-600 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                      <div>Target Program: <strong className="text-stone-900">{app.program_name}</strong></div>
                      <div>Prior Degree: <span className="font-mono">{app.previous_degree}</span></div>
                      <div>Academic Score: <strong className="font-mono text-stone-900">{app.cgpa_or_percentage}</strong></div>
                      <div>Applicant Contact: <span className="font-mono">{app.email} · {app.phone}</span></div>
                    </div>

                    {app.review_notes && (
                      <div className="p-2 bg-stone-100 rounded text-stone-700 text-[11px] border border-stone-200">
                        <strong>Committee Notes:</strong> {app.review_notes}
                      </div>
                    )}

                    {app.assigned_reg_no && (
                      <div className="text-[11px] font-mono text-emerald-800 font-bold">
                        Assigned Registration Number: {app.assigned_reg_no}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {app.status === 'Pending' || app.status === 'Under Review' ? (
                      <>
                        <button
                          onClick={() =>
                            updateApplicationStatus(
                              app.id,
                              'Approved',
                              'Approved by Central Admissions Committee. Merit criteria satisfied.'
                            )
                          }
                          className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors"
                        >
                          ✓ Approve Admission
                        </button>
                        <button
                          onClick={() =>
                            updateApplicationStatus(
                              app.id,
                              'Rejected',
                              'Academic score below departmental threshold for Fall intake.'
                            )
                          }
                          className="px-3.5 py-1.5 text-xs font-medium border border-rose-300 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          ✕ Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 rounded font-mono text-xs font-bold ${
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        STATUS: {app.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. FEE MANAGEMENT TAB */}
        {activeTab === 'fees' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Treasury & Fee Records Ledger
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  University Bursar System & Financial Clearance
                </p>
              </div>

              <button
                onClick={() => setShowChallanModal(true)}
                className="px-3.5 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Issue Fee Challan</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                    <th className="py-2.5">Challan No</th>
                    <th className="py-2.5">Student</th>
                    <th className="py-2.5">Semester</th>
                    <th className="py-2.5">Due Date</th>
                    <th className="py-2.5 text-right">Tuition</th>
                    <th className="py-2.5 text-right">Scholarship</th>
                    <th className="py-2.5 text-right">Total Net</th>
                    <th className="py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {feeRecords.map((f) => (
                    <tr key={f.id} className="hover:bg-stone-50">
                      <td className="py-3 font-mono font-bold text-stone-900">{f.challan_no}</td>
                      <td className="py-3 font-medium text-stone-900">
                        {f.student_name}
                        <span className="block font-mono text-stone-500 text-[11px]">{f.reg_no}</span>
                      </td>
                      <td className="py-3 font-mono text-stone-600">{f.semester_name}</td>
                      <td className="py-3 font-mono text-stone-600">{f.due_date}</td>
                      <td className="py-3 text-right font-mono">${f.tuition_fee.toLocaleString()}</td>
                      <td className="py-3 text-right font-mono text-emerald-700">
                        {f.discount > 0 ? `-$${f.discount.toLocaleString()}` : '$0'}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-stone-900">
                        ${f.total_amount.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                          f.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. NOTICES & EVENTS TAB */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-stone-900">
                    Official Campus Notices & Bulletins
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Published across Public Site and Student Portal
                  </p>
                </div>

                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Notice</span>
                </button>
              </div>

              <div className="space-y-3">
                {announcements.map((anc) => (
                  <div key={anc.id} className="p-4 rounded-lg border border-stone-200 bg-stone-50 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold bg-stone-200 px-2 py-0.5 rounded text-stone-800">
                        {anc.category}
                      </span>
                      <span className="font-mono text-stone-500">{anc.published_at} · Audience: {anc.target_audience}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-stone-900 mb-1">{anc.title}</h4>
                    <p className="text-stone-600 leading-relaxed mb-2">{anc.content}</p>
                    <div className="text-[11px] font-mono text-stone-500">
                      Author: {anc.author_name} ({anc.author_role})
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 8. ROLES & PERMISSIONS MATRIX TAB */}
        {activeTab === 'roles' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Role-Based Access Control (RBAC) Permissions Matrix
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Security partitioning as specified in Section 5 of University Specifications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROLE_PERMISSIONS_MATRIX.map((roleObj) => (
                <div
                  key={roleObj.role}
                  className="p-5 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-base text-stone-950">
                        {roleObj.role}
                      </span>
                      <span className="font-mono text-[10px] uppercase text-stone-500 bg-stone-200 px-2 py-0.5 rounded">
                        Active Role
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                      {roleObj.description}
                    </p>

                    <div className="pt-3 border-t border-stone-200">
                      <span className="text-[11px] font-mono font-semibold uppercase text-stone-700 block mb-2">
                        Granted Permissions:
                      </span>
                      <ul className="space-y-1.5 text-xs text-stone-700">
                        {roleObj.permissions.map((perm, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{perm}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. REPORTS & ANALYTICS TAB */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Institutional Intelligence & Audit Reports
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  Academic Year 2026–2027 Comprehensive Metrics
                </p>
              </div>

              <button
                onClick={exportStudentsCSV}
                className="px-3.5 py-1.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Master Roster (CSV)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="font-serif font-bold text-sm text-stone-900">Departmental Distribution</h4>
                <div className="space-y-2 text-xs font-mono">
                  {departments.map((d) => (
                    <div key={d.id} className="flex justify-between items-center">
                      <span className="truncate max-w-[170px] text-stone-700">{d.code} ({d.name.split(' ')[0]})</span>
                      <span className="font-bold text-stone-900">{d.student_count} Scholars</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="font-serif font-bold text-sm text-stone-900">Financial Clearance Summary</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Settled Receipts:</span>
                    <span className="font-bold text-emerald-800">${totalRevenueCollected.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Pending Receivables:</span>
                    <span className="font-bold text-amber-800">${totalPendingFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Recovery Ratio:</span>
                    <span className="font-bold text-stone-900">
                      {Math.round((totalRevenueCollected / (totalRevenueCollected + totalPendingFees || 1)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="font-serif font-bold text-sm text-stone-900">Admission Funnel Conversion</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Applications Logged:</span>
                    <span className="font-bold text-stone-900">{applications.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Approved Offers:</span>
                    <span className="font-bold text-emerald-800">
                      {applications.filter((a) => a.status === 'Approved').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Pending Evaluation:</span>
                    <span className="font-bold text-amber-800">{pendingAppsCount}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-md w-full p-6">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">Add Academic Course</h3>
            <p className="text-xs text-stone-500 mb-4">Define new curriculum offering and assign faculty instructor.</p>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  placeholder="e.g. CS-450"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus & Blockchain"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Department</label>
                  <select
                    value={newCourseDept}
                    onChange={(e) => setNewCourseDept(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Credit Hours</label>
                  <input
                    type="number"
                    value={newCourseCredits}
                    onChange={(e) => setNewCourseCredits(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Assigned Instructor</label>
                <select
                  value={newCourseInstructor}
                  onChange={(e) => setNewCourseInstructor(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  {facultyList.map((f) => (
                    <option key={f.id} value={f.id}>{f.full_name} ({f.designation})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Add Course to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-md w-full p-6">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">Publish University Notice</h3>
            <p className="text-xs text-stone-500 mb-4">Official announcement visible across university channels.</p>

            <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Convocation 2026 Gown Collection Schedule"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Category</label>
                  <select
                    value={noticeCat}
                    onChange={(e) => setNoticeCat(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Admissions">Admissions</option>
                    <option value="Examination">Examination</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="Research">Research</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Target Audience</label>
                  <select
                    value={noticeAudience}
                    onChange={(e) => setNoticeAudience(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="All">All University</option>
                    <option value="Students">Students Only</option>
                    <option value="Faculty">Faculty Only</option>
                    <option value="Public">Public</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Official notice body..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Fee Challan Modal */}
      {showChallanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-md w-full p-6">
            <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">Issue Semester Fee Challan</h3>
            <p className="text-xs text-stone-500 mb-4">Generate semester invoice for student payment.</p>

            <form onSubmit={handleIssueChallan} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Select Student *</label>
                <select
                  value={challanStudentId}
                  onChange={(e) => setChallanStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white"
                >
                  {studentsList.map((st) => (
                    <option key={st.id} value={st.id}>{st.full_name} ({st.reg_no})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Tuition Fee ($)</label>
                  <input
                    type="number"
                    value={challanTuition}
                    onChange={(e) => setChallanTuition(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Lab Fee ($)</label>
                  <input
                    type="number"
                    value={challanLab}
                    onChange={(e) => setChallanLab(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Library Fee ($)</label>
                  <input
                    type="number"
                    value={challanLib}
                    onChange={(e) => setChallanLib(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Discount / Waiver ($)</label>
                  <input
                    type="number"
                    value={challanDiscount}
                    onChange={(e) => setChallanDiscount(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowChallanModal(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Generate Challan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
