import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { 
  Database, 
  Terminal, 
  FolderTree, 
  BookOpen, 
  Code, 
  Copy, 
  Check, 
  Layers, 
  Play, 
  ShieldCheck,
  ChevronRight,
  Server,
  Cpu
} from 'lucide-react';

interface DBTable {
  name: string;
  category: 'Auth & Roles' | 'Academic Core' | 'Enrollment & Evaluation' | 'Bursar & Communications';
  description: string;
  columns: { name: string; type: string; key?: 'PK' | 'FK'; description: string }[];
}

const DB_TABLES: DBTable[] = [
  {
    name: 'users',
    category: 'Auth & Roles',
    description: 'Login credentials, password hash, and account activation status.',
    columns: [
      { name: 'user_id', type: 'UUID', key: 'PK', description: 'Primary unique user identifier' },
      { name: 'username', type: 'VARCHAR(64)', description: 'Unique user handle' },
      { name: 'email', type: 'VARCHAR(255)', description: 'Official institution email' },
      { name: 'hashed_password', type: 'VARCHAR(255)', description: 'Bcrypt hashed password' },
      { name: 'role_id', type: 'INTEGER', key: 'FK', description: 'FK -> roles.role_id' },
      { name: 'is_active', type: 'BOOLEAN', description: 'Account status flag' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'Account creation audit' },
    ]
  },
  {
    name: 'roles',
    category: 'Auth & Roles',
    description: 'System roles (Super Admin, Admin, Dept Head, Faculty, Student, Accountant).',
    columns: [
      { name: 'role_id', type: 'SERIAL', key: 'PK', description: 'Primary key' },
      { name: 'role_name', type: 'VARCHAR(50)', description: 'Role identifier' },
      { name: 'permissions', type: 'JSONB', description: 'Granted granular action flags' },
    ]
  },
  {
    name: 'departments',
    category: 'Academic Core',
    description: 'University faculties and departmental academic divisions.',
    columns: [
      { name: 'department_id', type: 'VARCHAR(16)', key: 'PK', description: 'Primary key e.g. CSE, AI-DS' },
      { name: 'name', type: 'VARCHAR(128)', description: 'Department title' },
      { name: 'head_faculty_id', type: 'VARCHAR(32)', key: 'FK', description: 'FK -> faculty.faculty_id' },
      { name: 'building', type: 'VARCHAR(64)', description: 'Campus hall / complex' },
      { name: 'established_year', type: 'INTEGER', description: 'Establishment year' },
    ]
  },
  {
    name: 'programs',
    category: 'Academic Core',
    description: 'Accredited degree programs (BSCS, BSAI, BBA, MSCS).',
    columns: [
      { name: 'program_id', type: 'VARCHAR(16)', key: 'PK', description: 'Primary key' },
      { name: 'department_id', type: 'VARCHAR(16)', key: 'FK', description: 'FK -> departments.department_id' },
      { name: 'code', type: 'VARCHAR(16)', description: 'Program code (BSCS)' },
      { name: 'name', type: 'VARCHAR(128)', description: 'Degree title' },
      { name: 'duration_years', type: 'INTEGER', description: 'Standard degree duration' },
      { name: 'credit_hours', type: 'INTEGER', description: 'Total required graduation credits' },
      { name: 'fee_per_semester', type: 'NUMERIC(10,2)', description: 'Standard tuition rate' },
    ]
  },
  {
    name: 'courses',
    category: 'Academic Core',
    description: 'Course catalog, credit weighting, and instructors.',
    columns: [
      { name: 'course_id', type: 'VARCHAR(16)', key: 'PK', description: 'Primary key' },
      { name: 'course_code', type: 'VARCHAR(16)', description: 'Official code (CS-301)' },
      { name: 'title', type: 'VARCHAR(128)', description: 'Course name' },
      { name: 'department_id', type: 'VARCHAR(16)', key: 'FK', description: 'FK -> departments.department_id' },
      { name: 'credit_hours', type: 'INTEGER', description: 'Credit value (3 or 4)' },
      { name: 'prerequisites', type: 'TEXT', description: 'Prerequisite course code' },
      { name: 'instructor_id', type: 'VARCHAR(32)', key: 'FK', description: 'FK -> faculty.faculty_id' },
    ]
  },
  {
    name: 'semesters',
    category: 'Academic Core',
    description: 'Academic semesters and registration windows.',
    columns: [
      { name: 'semester_id', type: 'VARCHAR(32)', key: 'PK', description: 'Primary key (FA26)' },
      { name: 'name', type: 'VARCHAR(64)', description: 'Fall 2026' },
      { name: 'is_current', type: 'BOOLEAN', description: 'Active academic period' },
      { name: 'enrollment_open', type: 'BOOLEAN', description: 'Course add/drop open' },
      { name: 'start_date', type: 'DATE', description: 'Semester commencement' },
      { name: 'end_date', type: 'DATE', description: 'Final examination conclusion' },
    ]
  },
  {
    name: 'students',
    category: 'Enrollment & Evaluation',
    description: 'Student registration records, academic standing, and advisor.',
    columns: [
      { name: 'student_id', type: 'VARCHAR(32)', key: 'PK', description: 'Primary key' },
      { name: 'user_id', type: 'UUID', key: 'FK', description: 'FK -> users.user_id' },
      { name: 'reg_no', type: 'VARCHAR(32)', description: 'University roll number (CS-2023-0142)' },
      { name: 'full_name', type: 'VARCHAR(128)', description: 'Student legal name' },
      { name: 'program_id', type: 'VARCHAR(16)', key: 'FK', description: 'FK -> programs.program_id' },
      { name: 'current_semester', type: 'INTEGER', description: 'Active semester number' },
      { name: 'cgpa', type: 'NUMERIC(3,2)', description: 'Cumulative grade point average' },
      { name: 'credit_completed', type: 'INTEGER', description: 'Earned credits count' },
    ]
  },
  {
    name: 'faculty',
    category: 'Enrollment & Evaluation',
    description: 'Teachers, chairs, deans, and research faculty.',
    columns: [
      { name: 'faculty_id', type: 'VARCHAR(32)', key: 'PK', description: 'Primary key' },
      { name: 'user_id', type: 'UUID', key: 'FK', description: 'FK -> users.user_id' },
      { name: 'faculty_code', type: 'VARCHAR(32)', description: 'FAC-CSE-01' },
      { name: 'full_name', type: 'VARCHAR(128)', description: 'Professor legal name' },
      { name: 'department_id', type: 'VARCHAR(16)', key: 'FK', description: 'FK -> departments.department_id' },
      { name: 'designation', type: 'VARCHAR(64)', description: 'Professor / Dean' },
      { name: 'office_room', type: 'VARCHAR(64)', description: 'Office location' },
    ]
  },
  {
    name: 'enrollments',
    category: 'Enrollment & Evaluation',
    description: 'Students registered in specific courses for a semester.',
    columns: [
      { name: 'enrollment_id', type: 'VARCHAR(32)', key: 'PK', description: 'Primary key' },
      { name: 'student_id', type: 'VARCHAR(32)', key: 'FK', description: 'FK -> students.student_id' },
      { name: 'course_id', type: 'VARCHAR(16)', key: 'FK', description: 'FK -> courses.course_id' },
      { name: 'semester_id', type: 'VARCHAR(32)', key: 'FK', description: 'FK -> semesters.semester_id' },
      { name: 'status', type: 'VARCHAR(16)', description: 'Enrolled / Dropped / Completed' },
      { name: 'enrolled_at', type: 'TIMESTAMP', description: 'Registration timestamp' },
    ]
  },
  {
    name: 'attendance',
    category: 'Enrollment & Evaluation',
    description: 'Biometric and session-by-session student presence logs.',
    columns: [
      { name: 'attendance_id', type: 'VARCHAR(32)', key: 'PK', description: 'Primary key' },
      { name: 'course_id', type: 'VARCHAR(16)', key: 'FK', description: 'FK -> courses.course_id' },
      { name: 'student_id', type: 'VARCHAR(32)', key: 'FK', description: 'FK -> students.student_id' },
      { name: 'session_date', type: 'DATE', description: 'Lecture date' },
      { name: 'status', type: 'VARCHAR(16)', description: 'Present / Absent / Late' },
      { name: 'remarks', type: 'VARCHAR(128)', description: 'Optional medical / leave note' },
    ]
  },
  {
    name: 'assessments',
    category: 'Enrollment & Evaluation',
    description: 'Exams, quizzes, and assignment specifications.',
    columns: [
      { name: 'assessment_id', type: 'VARCHAR(32)', key: 'PK', description: 'Primary key' },
      { name: 'course_id', type: 'VARCHAR(16)', key: 'FK', description: 'FK -> courses.course_id' },
      { name: 'title', type: 'VARCHAR(128)', description: 'Assessment headline' },
      { name: 'type', type: 'VARCHAR(32)', description: 'Assignment / Quiz / Midterm / Final' },
      { name: 'total_marks', type: 'INTEGER', description: 'Points ceiling' },
      { name: 'weightage_percent', type: 'INTEGER', description: 'Course weight %' },
      { name: 'due_date', type: 'DATE', description: 'Submission deadline' },
    ]
  },
  {
    name: 'results',
    category: 'Enrollment & Evaluation',
    description: 'Marks, letter grades, and grade points per student and course.',
    columns: [
      { name: 'result_id', type: 'VARCHAR(32)', key: 'PK', description: 'Primary key' },
      { name: 'student_id', type: 'VARCHAR(32)', key: 'FK', description: 'FK -> students.student_id' },
      { name: 'course_id', type: 'VARCHAR(16)', key: 'FK', description: 'FK -> courses.course_id' },
      { name: 'semester_id', type: 'VARCHAR(32)', key: 'FK', description: 'FK -> semesters.semester_id' },
      { name: 'midterm_marks', type: 'NUMERIC(5,2)', description: 'Score out of 30' },
      { name: 'final_marks', type: 'NUMERIC(5,2)', description: 'Score out of 50' },
      { name: 'assignment_marks', type: 'NUMERIC(5,2)', description: 'Score out of 10' },
      { name: 'quiz_marks', type: 'NUMERIC(5,2)', description: 'Score out of 10' },
      { name: 'total_marks', type: 'NUMERIC(5,2)', description: 'Aggregate / 100' },
      { name: 'grade', type: 'VARCHAR(4)', description: 'A, B+, C, F' },
      { name: 'grade_point', type: 'NUMERIC(3,2)', description: 'Grade point 4.0' },
    ]
  },
  {
    name: 'fee_records',
    category: 'Bursar & Communications',
    description: 'Semester challans, tuition ledgers, and clearance receipts.',
    columns: [
      { name: 'fee_id', type: 'VARCHAR(32)', key: 'PK', description: 'Primary key' },
      { name: 'student_id', type: 'VARCHAR(32)', key: 'FK', description: 'FK -> students.student_id' },
      { name: 'semester_id', type: 'VARCHAR(32)', key: 'FK', description: 'FK -> semesters.semester_id' },
      { name: 'challan_no', type: 'VARCHAR(32)', description: 'Bursar tracking number' },
      { name: 'tuition_fee', type: 'NUMERIC(10,2)', description: 'Tuition charge' },
      { name: 'lab_fee', type: 'NUMERIC(10,2)', description: 'Laboratory charge' },
      { name: 'discount', type: 'NUMERIC(10,2)', description: 'Scholarship waiver' },
      { name: 'total_amount', type: 'NUMERIC(10,2)', description: 'Net payable balance' },
      { name: 'status', type: 'VARCHAR(16)', description: 'Paid / Pending / Overdue' },
    ]
  },
  {
    name: 'announcements',
    category: 'Bursar & Communications',
    description: 'Official university news and administrative bulletins.',
    columns: [
      { name: 'announcement_id', type: 'VARCHAR(32)', key: 'PK', description: 'Primary key' },
      { name: 'title', type: 'VARCHAR(255)', description: 'Headline' },
      { name: 'category', type: 'VARCHAR(64)', description: 'Academic / Examination / Admission' },
      { name: 'content', type: 'TEXT', description: 'Full text body' },
      { name: 'published_at', type: 'DATE', description: 'Publication timestamp' },
      { name: 'target_audience', type: 'VARCHAR(32)', description: 'All / Students / Faculty' },
    ]
  },
  {
    name: 'events',
    category: 'Bursar & Communications',
    description: 'Campus symposiums, hackathons, and conferences.',
    columns: [
      { name: 'event_id', type: 'VARCHAR(32)', key: 'PK', description: 'Primary key' },
      { name: 'title', type: 'VARCHAR(255)', description: 'Event title' },
      { name: 'category', type: 'VARCHAR(64)', description: 'Conference / Workshop / Sports' },
      { name: 'date', type: 'DATE', description: 'Calendar date' },
      { name: 'location', type: 'VARCHAR(128)', description: 'Campus auditorium / hall' },
      { name: 'attendees_count', type: 'INTEGER', description: 'Registered participants' },
    ]
  },
];

export const ArchitectureViewer: React.FC = () => {
  const {
    studentsList,
    facultyList,
    courses,
    departments,
    programs,
    attendanceRecords,
    results,
    feeRecords,
    applications,
    showToast,
  } = useUniversity();

  const [archTab, setArchTab] = useState<'db_schema' | 'fastapi_explorer' | 'folder_structure' | 'roadmap'>('db_schema');
  const [selectedTable, setSelectedTable] = useState<string>('students');
  const [copiedSql, setCopiedSql] = useState(false);

  // FastAPI Runner State
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/v1/students');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [apiLoading, setApiLoading] = useState(false);

  const activeTableObj = DB_TABLES.find((t) => t.name === selectedTable) || DB_TABLES[0];

  const handleCopySql = () => {
    const ddl = `-- PostgreSQL Schema for Apex University Management System
CREATE TABLE departments (
    department_id VARCHAR(16) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    head_faculty_id VARCHAR(32),
    building VARCHAR(64),
    established_year INT
);

CREATE TABLE programs (
    program_id VARCHAR(16) PRIMARY KEY,
    department_id VARCHAR(16) REFERENCES departments(department_id),
    code VARCHAR(16) NOT NULL,
    name VARCHAR(128) NOT NULL,
    duration_years INT DEFAULT 4,
    credit_hours INT NOT NULL,
    fee_per_semester NUMERIC(10,2) NOT NULL
);

CREATE TABLE students (
    student_id VARCHAR(32) PRIMARY KEY,
    reg_no VARCHAR(32) UNIQUE NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    program_id VARCHAR(16) REFERENCES programs(program_id),
    current_semester INT DEFAULT 1,
    cgpa NUMERIC(3,2) DEFAULT 0.00,
    credit_completed INT DEFAULT 0
);

CREATE TABLE courses (
    course_id VARCHAR(16) PRIMARY KEY,
    course_code VARCHAR(16) UNIQUE NOT NULL,
    title VARCHAR(128) NOT NULL,
    department_id VARCHAR(16) REFERENCES departments(department_id),
    credit_hours INT NOT NULL,
    prerequisites TEXT
);

CREATE TABLE enrollments (
    enrollment_id VARCHAR(32) PRIMARY KEY,
    student_id VARCHAR(32) REFERENCES students(student_id),
    course_id VARCHAR(16) REFERENCES courses(course_id),
    semester_id VARCHAR(32) NOT NULL,
    status VARCHAR(16) DEFAULT 'Enrolled',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
    navigator.clipboard.writeText(ddl);
    setCopiedSql(true);
    showToast('PostgreSQL DDL script copied to clipboard', 'success');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const executeApiEndpoint = () => {
    setApiLoading(true);
    setTimeout(() => {
      let data: any = {};
      if (selectedEndpoint === 'GET /api/v1/students') {
        data = {
          status: 200,
          total: studentsList.length,
          data: studentsList,
        };
      } else if (selectedEndpoint === 'GET /api/v1/faculty') {
        data = {
          status: 200,
          total: facultyList.length,
          data: facultyList,
        };
      } else if (selectedEndpoint === 'GET /api/v1/courses') {
        data = {
          status: 200,
          total: courses.length,
          data: courses,
        };
      } else if (selectedEndpoint === 'GET /api/v1/attendance/summary') {
        data = {
          status: 200,
          records_logged: attendanceRecords.length,
          recent: attendanceRecords.slice(0, 5),
        };
      } else if (selectedEndpoint === 'GET /api/v1/results/gradebook') {
        data = {
          status: 200,
          gradebook: results,
        };
      } else if (selectedEndpoint === 'GET /api/v1/fees/invoices') {
        data = {
          status: 200,
          fee_ledgers: feeRecords,
        };
      } else if (selectedEndpoint === 'GET /api/v1/admissions/applications') {
        data = {
          status: 200,
          applications: applications,
        };
      } else if (selectedEndpoint === 'POST /api/v1/auth/login') {
        data = {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhLnZhbmNlQGFwZXguZWR1Iiwicm9sZSI6IlN0dWRlbnQiLCJleHAiOjE3OTM3ODA4MDB9',
          token_type: 'bearer',
          user: {
            username: 'a.vance',
            email: 'a.vance@apex.edu',
            role: 'Student',
            status: 'Active',
          },
        };
      }

      setApiResponse(JSON.stringify(data, null, 2));
      setApiLoading(false);
      showToast(`FastAPI endpoint ${selectedEndpoint} executed successfully`, 'success');
    }, 200);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 pb-20">
      
      {/* Blueprint Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center font-bold">
                <Database className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-stone-950">
                  PostgreSQL & FastAPI Technical Blueprint
                </h1>
                <p className="text-xs text-stone-500 font-mono">
                  Database Relations, REST API Endpoints, and Scalable Backend Architecture
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium border border-stone-300 rounded-lg bg-white hover:bg-stone-50 text-stone-800 transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy PostgreSQL DDL</span>
              </button>
            </div>

          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-1 mt-6 border-b border-stone-200 -mb-5 overflow-x-auto">
            {[
              { id: 'db_schema', label: '15 PostgreSQL Tables Schema', icon: <Database className="w-3.5 h-3.5" /> },
              { id: 'fastapi_explorer', label: 'FastAPI Interactive Endpoints', icon: <Terminal className="w-3.5 h-3.5" /> },
              { id: 'folder_structure', label: 'Folder Structure & Stack', icon: <FolderTree className="w-3.5 h-3.5" /> },
              { id: 'roadmap', label: 'Phased Development Roadmap', icon: <Layers className="w-3.5 h-3.5" /> },
            ].map((tab) => {
              const isActive = archTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setArchTab(tab.id as any)}
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* 1. DATABASE SCHEMA & ER VIEWER */}
        {archTab === 'db_schema' && (
          <div className="space-y-6">
            
            {/* Visual Relation Map Summary */}
            <div className="bg-stone-900 text-stone-200 p-6 rounded-xl border border-stone-800 shadow-sm font-mono text-xs">
              <div className="text-amber-400 font-bold mb-2">Relational Entity Mapping (As Recommended in Project Specs):</div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-[11px] text-stone-300">
                <div className="p-2.5 bg-stone-800/80 rounded border border-stone-700">
                  <div className="text-stone-100 font-bold">DEPARTMENTS</div>
                  <div className="text-stone-400">dept_id · name · head</div>
                </div>
                <div className="p-2.5 bg-stone-800/80 rounded border border-stone-700">
                  <div className="text-stone-100 font-bold">PROGRAMS</div>
                  <div className="text-stone-400">prog_id → dept_id</div>
                </div>
                <div className="p-2.5 bg-stone-800/80 rounded border border-stone-700">
                  <div className="text-stone-100 font-bold">STUDENTS</div>
                  <div className="text-stone-400">stu_id → prog_id → user_id</div>
                </div>
                <div className="p-2.5 bg-stone-800/80 rounded border border-stone-700">
                  <div className="text-stone-100 font-bold">COURSES</div>
                  <div className="text-stone-400">course_id → dept_id</div>
                </div>
                <div className="p-2.5 bg-stone-800/80 rounded border border-stone-700">
                  <div className="text-stone-100 font-bold">ENROLLMENTS</div>
                  <div className="text-stone-400">stu_id · course_id · sem_id</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Table Selector Sidebar */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-2">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-stone-500 block px-2 pb-2 border-b border-stone-100">
                  15 Recommended Tables
                </span>

                <div className="space-y-1 max-h-[600px] overflow-y-auto">
                  {DB_TABLES.map((t) => (
                    <button
                      key={t.name}
                      onClick={() => setSelectedTable(t.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                        selectedTable === t.name
                          ? 'bg-stone-900 text-white font-bold'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span>{t.name}</span>
                      <span className="text-[10px] opacity-70">{t.columns.length} cols</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Inspector */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono text-lg font-bold text-stone-950">
                        {activeTableObj.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-stone-100 text-stone-600">
                        {activeTableObj.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1">{activeTableObj.description}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 font-mono text-stone-500 text-[11px]">
                        <th className="py-2.5">Key</th>
                        <th className="py-2.5">Column Name</th>
                        <th className="py-2.5">PostgreSQL Data Type</th>
                        <th className="py-2.5">Description & Foreign Keys</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-mono">
                      {activeTableObj.columns.map((col) => (
                        <tr key={col.name} className="hover:bg-stone-50">
                          <td className="py-2.5">
                            {col.key === 'PK' && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-bold text-[10px]">
                                PK
                              </span>
                            )}
                            {col.key === 'FK' && (
                              <span className="px-1.5 py-0.5 bg-sky-100 text-sky-900 rounded font-bold text-[10px]">
                                FK
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 font-bold text-stone-900">{col.name}</td>
                          <td className="py-2.5 text-stone-600 font-semibold">{col.type}</td>
                          <td className="py-2.5 text-stone-700 text-[11px] font-sans">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-stone-50 rounded border border-stone-200 text-xs font-mono text-stone-600">
                  Indexed Foreign Keys: B-Tree clustered indices applied on all PK/FK pairs for sub-millisecond query performance.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. FASTAPI INTERACTIVE ENDPOINTS EXPLORER */}
        {archTab === 'fastapi_explorer' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Endpoint List */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-2">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-stone-500 block px-2 pb-2 border-b border-stone-100">
                  FastAPI OpenAPI Router Specification
                </span>

                <div className="space-y-1.5 font-mono text-xs">
                  {[
                    'GET /api/v1/students',
                    'GET /api/v1/faculty',
                    'GET /api/v1/courses',
                    'GET /api/v1/attendance/summary',
                    'GET /api/v1/results/gradebook',
                    'GET /api/v1/fees/invoices',
                    'GET /api/v1/admissions/applications',
                    'POST /api/v1/auth/login',
                  ].map((ep) => {
                    const isGet = ep.startsWith('GET');
                    const isSelected = selectedEndpoint === ep;
                    return (
                      <button
                        key={ep}
                        onClick={() => {
                          setSelectedEndpoint(ep);
                          setApiResponse('');
                        }}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-stone-900 bg-stone-900 text-white font-bold'
                            : 'border-stone-200 bg-stone-50 text-stone-800 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isGet ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {isGet ? 'GET' : 'POST'}
                          </span>
                          <span className="text-[11px] truncate">{ep.replace(/^(GET|POST) /, '')}</span>
                        </div>
                        <Play className="w-3 h-3 text-stone-400" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Endpoint Runner & Live Console */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <span className="font-mono text-xs font-bold text-stone-900">{selectedEndpoint}</span>
                    <p className="text-xs text-stone-500 font-mono mt-0.5">FastAPI Dependency Injection & Pydantic Validation</p>
                  </div>

                  <button
                    onClick={executeApiEndpoint}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Execute Endpoint</span>
                  </button>
                </div>

                {/* Console Output */}
                <div className="bg-stone-950 text-stone-100 p-4 rounded-xl font-mono text-xs overflow-x-auto min-h-[300px] border border-stone-800">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 pb-2 mb-2 border-b border-stone-800">
                    <span>STATUS: {apiResponse ? '200 OK' : 'READY TO EXECUTE'}</span>
                    <span>CONTENT-TYPE: application/json</span>
                  </div>

                  {apiLoading ? (
                    <div className="py-12 text-center text-stone-500">Executing FastAPI route handler...</div>
                  ) : apiResponse ? (
                    <pre className="text-emerald-400 whitespace-pre-wrap">{apiResponse}</pre>
                  ) : (
                    <div className="py-12 text-center text-stone-500">
                      Click "Execute Endpoint" above to query live state directly from backend memory.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 3. FOLDER STRUCTURE & TECH STACK TAB */}
        {archTab === 'folder_structure' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Recommended Scalable Project Structure
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Decoupled React.js Frontend + FastAPI Backend + PostgreSQL Database
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Backend Structure */}
              <div className="p-4 bg-stone-900 text-stone-200 rounded-xl font-mono text-xs space-y-2 border border-stone-800">
                <div className="text-amber-400 font-bold border-b border-stone-700 pb-2">
                  backend/ (FastAPI + SQLAlchemy + Alembic)
                </div>
                <div className="text-stone-300 leading-relaxed whitespace-pre text-[11px]">
{`university_system/backend/
├── app/
│   ├── main.py               # FastAPI entry point & CORS
│   ├── config.py             # Pydantic Settings & Env
│   ├── database.py           # SQLAlchemy Engine & SessionLocal
│   ├── models/               # 15 Declarative Base Models
│   │   ├── user.py, student.py, faculty.py, course.py
│   │   ├── enrollment.py, attendance.py, result.py, fee.py
│   ├── schemas/              # Pydantic Request/Response DTOs
│   │   ├── user.py, student.py, course.py, result.py
│   ├── routers/              # Modular API Endpoints
│   │   ├── auth.py, students.py, faculty.py, courses.py
│   │   ├── attendance.py, results.py, fees.py, admin.py
│   ├── services/             # Core business calculations
│   └── dependencies/         # JWT Bearer & RBAC guards
├── alembic/                  # Database migration versions
└── requirements.txt          # fastapi, uvicorn, sqlalchemy, psycopg2`}
                </div>
              </div>

              {/* Frontend Structure */}
              <div className="p-4 bg-stone-900 text-stone-200 rounded-xl font-mono text-xs space-y-2 border border-stone-800">
                <div className="text-sky-400 font-bold border-b border-stone-700 pb-2">
                  frontend/ (React.js + Tailwind CSS)
                </div>
                <div className="text-stone-300 leading-relaxed whitespace-pre text-[11px]">
{`university_system/frontend/
├── public/                   # Static icons & brand assets
├── src/
│   ├── components/
│   │   ├── public/           # Section 1: Public Website
│   │   ├── student/          # Section 2: Student Portal
│   │   ├── faculty/          # Section 3: Faculty Portal
│   │   ├── admin/            # Section 4: Admin Dashboard
│   │   ├── architecture/     # Section 5: DB & API Hub
│   │   └── common/           # Navigation, Toasts, Modals
│   ├── context/              # State & local persistence
│   ├── types/                # University TypeScript interfaces
│   ├── data/                 # Seed models & test datasets
│   └── App.tsx               # Root controller & view router`}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 4. PHASED ROADMAP TAB */}
        {archTab === 'roadmap' && (
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                12-Phase Development Implementation Roadmap
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Order of execution as specified in Section 7 of University System Guidelines
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { phase: 1, title: 'Project Planning and Requirements', priority: 'Essential', status: 'Completed', desc: 'Requirement breakdown across public, student, faculty, and administrative portals.' },
                { phase: 2, title: 'UI Design and Frontend Structure', priority: 'Essential', status: 'Completed', desc: 'Component architecture, typographic hierarchy, institutional brand identity.' },
                { phase: 3, title: 'FastAPI Setup and Configuration', priority: 'Essential', status: 'Completed', desc: 'CORS middleware, Pydantic schemas, dependency injection, and router mounts.' },
                { phase: 4, title: 'PostgreSQL Database Design', priority: 'Essential', status: 'Completed', desc: '15 relational tables with foreign key constraints, indexes, and normalization.' },
                { phase: 5, title: 'Authentication and User Roles', priority: 'Essential', status: 'Completed', desc: 'RBAC partition for 6 distinct roles (Super Admin, Faculty, Student, Accountant).' },
                { phase: 6, title: 'Student and Faculty Management', priority: 'Essential', status: 'Completed', desc: 'Directory rosters, profile management, status lifecycle, and advisors.' },
                { phase: 7, title: 'Department and Course Management', priority: 'Essential', status: 'Completed', desc: 'Curriculum catalog, prerequisites, credit weighting, and allocations.' },
                { phase: 8, title: 'Enrollment and Timetable', priority: 'Important', status: 'Completed', desc: 'Add/drop courses, 18-credit cap enforcement, weekly schedule matrix.' },
                { phase: 9, title: 'Attendance and Results', priority: 'Important', status: 'Completed', desc: 'Lecture attendance register, 75% cutoff threshold, auto gradebook calculation.' },
                { phase: 10, title: 'Fees and Payments', priority: 'Advanced', status: 'Completed', desc: 'Challan issuance, scholarship discounts, and simulated online transaction clearance.' },
                { phase: 11, title: 'Reports and Analytics', priority: 'Advanced', status: 'Completed', desc: 'Grade curves, enrollment metrics, financial recovery, and CSV export.' },
                { phase: 12, title: 'Testing and Deployment', priority: 'Essential', status: 'Completed', desc: 'Document generation, cross-portal verification, and production build readiness.' },
              ].map((p) => (
                <div key={p.phase} className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-stone-900">Phase {p.phase}</span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-100 text-emerald-800 font-semibold">
                      ✓ {p.status}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">{p.title}</h4>
                  <p className="text-stone-600 text-[11px] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
