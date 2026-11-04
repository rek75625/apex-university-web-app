import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Department,
  DegreeProgram,
  Course,
  Semester,
  Student,
  Faculty,
  Enrollment,
  AttendanceRecord,
  Assessment,
  ResultRecord,
  FeeRecord,
  Announcement,
  UniversityEvent,
  AdmissionApplication,
  TimetableSlot,
  UserRole
} from '../types/university';

import {
  INITIAL_DEPARTMENTS,
  INITIAL_PROGRAMS,
  INITIAL_COURSES,
  INITIAL_SEMESTERS,
  INITIAL_FACULTY,
  INITIAL_STUDENTS,
  INITIAL_ENROLLMENTS,
  INITIAL_ATTENDANCE,
  INITIAL_ASSESSMENTS,
  INITIAL_RESULTS,
  INITIAL_FEES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EVENTS,
  INITIAL_APPLICATIONS,
  INITIAL_TIMETABLE
} from '../data/seedData';

export type ActivePortal = 'public' | 'student' | 'faculty' | 'admin' | 'architecture';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UniversityContextType {
  activePortal: ActivePortal;
  setActivePortal: (portal: ActivePortal) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Selected entities for simulated portal views
  activeStudent: Student;
  setActiveStudentId: (id: string) => void;
  activeFaculty: Faculty;
  setActiveFacultyId: (id: string) => void;

  // University Data
  departments: Department[];
  programs: DegreeProgram[];
  courses: Course[];
  semesters: Semester[];
  facultyList: Faculty[];
  studentsList: Student[];
  enrollments: Enrollment[];
  attendanceRecords: AttendanceRecord[];
  assessments: Assessment[];
  results: ResultRecord[];
  feeRecords: FeeRecord[];
  announcements: Announcement[];
  events: UniversityEvent[];
  applications: AdmissionApplication[];
  timetable: TimetableSlot[];

  // Student Actions
  enrollCourse: (courseId: string) => { success: boolean; message: string };
  dropCourse: (courseId: string) => { success: boolean; message: string };
  payFee: (feeId: string, paymentMethod: string) => void;

  // Faculty Actions
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  markBatchAttendance: (courseId: string, sessionDate: string, status: 'Present' | 'Absent' | 'Late') => void;
  updateResultMarks: (resultId: string, marks: { midterm?: number; final?: number; assignment?: number; quiz?: number }) => void;
  createAssessment: (assessment: Omit<Assessment, 'id' | 'submissions_count'>) => void;

  // Admin Actions
  submitApplication: (appData: Omit<AdmissionApplication, 'id' | 'tracking_no' | 'submitted_at' | 'status'>) => string;
  updateApplicationStatus: (appId: string, status: AdmissionApplication['status'], reviewNotes?: string) => void;
  addCourse: (courseData: Omit<Course, 'id' | 'enrolled_count'>) => void;
  addStudent: (studentData: Omit<Student, 'id' | 'user_id' | 'cgpa' | 'credit_completed'>) => void;
  addFaculty: (facultyData: Omit<Faculty, 'id' | 'user_id' | 'assigned_course_ids'>) => void;
  addDepartment: (deptData: Omit<Department, 'id' | 'faculty_count' | 'student_count'>) => void;
  addProgram: (progData: Omit<DegreeProgram, 'id'>) => void;
  createAnnouncement: (notice: Omit<Announcement, 'id' | 'published_at'>) => void;
  toggleEventRsvp: (eventId: string) => void;
  createFeeChallan: (studentId: string, semesterId: string, tuition: number, lab: number, lib: number, discount: number) => void;
  resetAllData: () => void;

  // Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

const STORAGE_PREFIX = 'apex_univ_v2_';

function getStoredOrDefault<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export const UniversityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePortal, setActivePortal] = useState<ActivePortal>('public');
  const [userRole, setUserRole] = useState<UserRole>('Student');

  const [departments, setDepartments] = useState<Department[]>(() => getStoredOrDefault('departments', INITIAL_DEPARTMENTS));
  const [programs, setPrograms] = useState<DegreeProgram[]>(() => getStoredOrDefault('programs', INITIAL_PROGRAMS));
  const [courses, setCourses] = useState<Course[]>(() => getStoredOrDefault('courses', INITIAL_COURSES));
  const [semesters] = useState<Semester[]>(INITIAL_SEMESTERS);
  const [facultyList, setFacultyList] = useState<Faculty[]>(() => getStoredOrDefault('faculty', INITIAL_FACULTY));
  const [studentsList, setStudentsList] = useState<Student[]>(() => getStoredOrDefault('students', INITIAL_STUDENTS));
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => getStoredOrDefault('enrollments', INITIAL_ENROLLMENTS));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => getStoredOrDefault('attendance', INITIAL_ATTENDANCE));
  const [assessments, setAssessments] = useState<Assessment[]>(() => getStoredOrDefault('assessments', INITIAL_ASSESSMENTS));
  const [results, setResults] = useState<ResultRecord[]>(() => getStoredOrDefault('results', INITIAL_RESULTS));
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(() => getStoredOrDefault('fees', INITIAL_FEES));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getStoredOrDefault('announcements', INITIAL_ANNOUNCEMENTS));
  const [events, setEvents] = useState<UniversityEvent[]>(() => getStoredOrDefault('events', INITIAL_EVENTS));
  const [applications, setApplications] = useState<AdmissionApplication[]>(() => getStoredOrDefault('applications', INITIAL_APPLICATIONS));
  const [timetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);

  const [activeStudentId, setActiveStudentId] = useState<string>('stu-1');
  const [activeFacultyId, setActiveFacultyId] = useState<string>('fac-1');

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'departments', JSON.stringify(departments));
    localStorage.setItem(STORAGE_PREFIX + 'programs', JSON.stringify(programs));
    localStorage.setItem(STORAGE_PREFIX + 'courses', JSON.stringify(courses));
    localStorage.setItem(STORAGE_PREFIX + 'faculty', JSON.stringify(facultyList));
    localStorage.setItem(STORAGE_PREFIX + 'students', JSON.stringify(studentsList));
    localStorage.setItem(STORAGE_PREFIX + 'enrollments', JSON.stringify(enrollments));
    localStorage.setItem(STORAGE_PREFIX + 'attendance', JSON.stringify(attendanceRecords));
    localStorage.setItem(STORAGE_PREFIX + 'assessments', JSON.stringify(assessments));
    localStorage.setItem(STORAGE_PREFIX + 'results', JSON.stringify(results));
    localStorage.setItem(STORAGE_PREFIX + 'fees', JSON.stringify(feeRecords));
    localStorage.setItem(STORAGE_PREFIX + 'announcements', JSON.stringify(announcements));
    localStorage.setItem(STORAGE_PREFIX + 'events', JSON.stringify(events));
    localStorage.setItem(STORAGE_PREFIX + 'applications', JSON.stringify(applications));
  }, [
    departments,
    programs,
    courses,
    facultyList,
    studentsList,
    enrollments,
    attendanceRecords,
    assessments,
    results,
    feeRecords,
    announcements,
    events,
    applications,
  ]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activeStudent = studentsList.find((s) => s.id === activeStudentId) || studentsList[0];
  const activeFaculty = facultyList.find((f) => f.id === activeFacultyId) || facultyList[0];

  // Helper for grade calculation
  const calculateGrade = (total: number): { grade: string; grade_point: number } => {
    if (total >= 90) return { grade: 'A', grade_point: 4.0 };
    if (total >= 85) return { grade: 'A-', grade_point: 3.7 };
    if (total >= 80) return { grade: 'B+', grade_point: 3.3 };
    if (total >= 75) return { grade: 'B', grade_point: 3.0 };
    if (total >= 70) return { grade: 'B-', grade_point: 2.7 };
    if (total >= 65) return { grade: 'C+', grade_point: 2.3 };
    if (total >= 60) return { grade: 'C', grade_point: 2.0 };
    if (total >= 50) return { grade: 'D', grade_point: 1.0 };
    return { grade: 'F', grade_point: 0.0 };
  };

  // Student Actions
  const enrollCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return { success: false, message: 'Course not found' };

    const studentEnrollments = enrollments.filter(
      (e) => e.student_id === activeStudent.id && e.status === 'Enrolled'
    );

    const alreadyEnrolled = studentEnrollments.some((e) => e.course_id === courseId);
    if (alreadyEnrolled) {
      return { success: false, message: 'Already enrolled in this course.' };
    }

    const currentTotalCredits = studentEnrollments.reduce((sum, e) => sum + e.credit_hours, 0);
    if (currentTotalCredits + course.credit_hours > 18) {
      return {
        success: false,
        message: `Credit cap exceeded. Maximum 18 credits allowed per semester. Current: ${currentTotalCredits} credits.`,
      };
    }

    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      student_id: activeStudent.id,
      course_id: course.id,
      course_code: course.course_code,
      course_title: course.title,
      credit_hours: course.credit_hours,
      semester_id: 'sem-2026-fall',
      semester_name: 'Fall 2026',
      instructor_name: course.instructor_name,
      status: 'Enrolled',
      enrolled_at: new Date().toISOString().split('T')[0],
    };

    setEnrollments((prev) => [...prev, newEnrollment]);
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolled_count: c.enrolled_count + 1 } : c))
    );

    showToast(`Successfully registered in ${course.course_code}: ${course.title} (${course.credit_hours} Credits)`, 'success');
    return { success: true, message: 'Successfully enrolled' };
  };

  const dropCourse = (courseId: string) => {
    const enrollment = enrollments.find(
      (e) => e.student_id === activeStudent.id && e.course_id === courseId && e.status === 'Enrolled'
    );
    if (!enrollment) return { success: false, message: 'Enrollment record not found' };

    setEnrollments((prev) =>
      prev.map((e) => (e.id === enrollment.id ? { ...e, status: 'Dropped' } : e))
    );
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, enrolled_count: Math.max(0, c.enrolled_count - 1) } : c))
    );

    showToast(`Dropped course ${enrollment.course_code}`, 'info');
    return { success: true, message: 'Course dropped' };
  };

  const payFee = (feeId: string, paymentMethod: string) => {
    const txnRef = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;

    setFeeRecords((prev) =>
      prev.map((f) =>
        f.id === feeId
          ? {
              ...f,
              status: 'Paid',
              paid_at: formattedDate,
              payment_method: paymentMethod,
              transaction_ref: txnRef,
            }
          : f
      )
    );
    showToast(`Payment processed successfully! Reference: ${txnRef}`, 'success');
  };

  // Faculty Actions
  const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    setAttendanceRecords((prev) => {
      const existingIndex = prev.findIndex(
        (r) =>
          r.course_id === record.course_id &&
          r.student_id === record.student_id &&
          r.session_date === record.session_date
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...record };
        return updated;
      }
      return [...prev, { ...record, id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` }];
    });
  };

  const markBatchAttendance = (courseId: string, sessionDate: string, status: 'Present' | 'Absent' | 'Late') => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    // Find students enrolled in this course
    const enrolledStudents = enrollments
      .filter((e) => e.course_id === courseId && e.status === 'Enrolled')
      .map((e) => studentsList.find((s) => s.id === e.student_id))
      .filter((s): s is Student => !!s);

    setAttendanceRecords((prev) => {
      let updated = [...prev];
      for (const st of enrolledStudents) {
        const idx = updated.findIndex(
          (r) => r.course_id === courseId && r.student_id === st.id && r.session_date === sessionDate
        );
        const record: AttendanceRecord = {
          id: idx >= 0 ? updated[idx].id : `att-${Date.now()}-${st.id}`,
          course_id: courseId,
          course_code: course.course_code,
          student_id: st.id,
          student_name: st.full_name,
          reg_no: st.reg_no,
          session_date: sessionDate,
          status: status,
        };
        if (idx >= 0) {
          updated[idx] = record;
        } else {
          updated.push(record);
        }
      }
      return updated;
    });

    showToast(`Marked ${enrolledStudents.length} students as ${status} for ${course.course_code} on ${sessionDate}`, 'success');
  };

  const updateResultMarks = (
    resultId: string,
    marks: { midterm?: number; final?: number; assignment?: number; quiz?: number }
  ) => {
    setResults((prev) =>
      prev.map((res) => {
        if (res.id !== resultId) return res;

        const midterm = marks.midterm !== undefined ? marks.midterm : res.midterm_marks;
        const final = marks.final !== undefined ? marks.final : res.final_marks;
        const assignment = marks.assignment !== undefined ? marks.assignment : res.assignment_marks;
        const quiz = marks.quiz !== undefined ? marks.quiz : res.quiz_marks;

        const total = Math.min(100, Math.round(midterm + final + assignment + quiz));
        const { grade, grade_point } = calculateGrade(total);

        return {
          ...res,
          midterm_marks: midterm,
          final_marks: final,
          assignment_marks: assignment,
          quiz_marks: quiz,
          total_marks: total,
          grade,
          grade_point,
          status: 'Submitted',
        };
      })
    );
    showToast('Marks and grade calculated and updated', 'success');
  };

  const createAssessment = (assessmentData: Omit<Assessment, 'id' | 'submissions_count'>) => {
    const newAssessment: Assessment = {
      ...assessmentData,
      id: `asg-${Date.now()}`,
      submissions_count: 0,
    };
    setAssessments((prev) => [newAssessment, ...prev]);
    showToast(`Created assessment "${assessmentData.title}" for ${assessmentData.course_code}`, 'success');
  };

  // Admin Actions
  const submitApplication = (appData: Omit<AdmissionApplication, 'id' | 'tracking_no' | 'submitted_at' | 'status'>): string => {
    const trackingNo = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: AdmissionApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      tracking_no: trackingNo,
      submitted_at: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setApplications((prev) => [newApp, ...prev]);
    showToast(`Application submitted! Tracking number: ${trackingNo}`, 'success');
    return trackingNo;
  };

  const updateApplicationStatus = (
    appId: string,
    status: AdmissionApplication['status'],
    reviewNotes?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        let assignedReg: string | undefined = app.assigned_reg_no;
        if (status === 'Approved' && !assignedReg) {
          const prog = programs.find((p) => p.id === app.program_id);
          const prefix = prog ? prog.code : 'GEN';
          assignedReg = `${prefix}-2027-${Math.floor(1000 + Math.random() * 9000)}`;
        }
        return {
          ...app,
          status,
          review_notes: reviewNotes || app.review_notes,
          assigned_reg_no: assignedReg,
        };
      })
    );
    showToast(`Application marked as ${status}`, 'info');
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'enrolled_count'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `crs-${Date.now()}`,
      enrolled_count: 0,
    };
    setCourses((prev) => [...prev, newCourse]);
    showToast(`Course ${newCourse.course_code} successfully added`, 'success');
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'user_id' | 'cgpa' | 'credit_completed'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      user_id: `user-${Date.now()}`,
      cgpa: 0.0,
      credit_completed: 0,
    };
    setStudentsList((prev) => [...prev, newStudent]);
    showToast(`Student ${newStudent.full_name} (${newStudent.reg_no}) registered`, 'success');
  };

  const addFaculty = (facultyData: Omit<Faculty, 'id' | 'user_id' | 'assigned_course_ids'>) => {
    const newFac: Faculty = {
      ...facultyData,
      id: `fac-${Date.now()}`,
      user_id: `user-${Date.now()}`,
      assigned_course_ids: [],
    };
    setFacultyList((prev) => [...prev, newFac]);
    showToast(`Faculty member ${newFac.full_name} added to department`, 'success');
  };

  const addDepartment = (deptData: Omit<Department, 'id' | 'faculty_count' | 'student_count'>) => {
    const newDept: Department = {
      ...deptData,
      id: `dept-${Date.now()}`,
      faculty_count: 0,
      student_count: 0,
    };
    setDepartments((prev) => [...prev, newDept]);
    showToast(`Department "${newDept.name}" created`, 'success');
  };

  const addProgram = (progData: Omit<DegreeProgram, 'id'>) => {
    const newProg: DegreeProgram = {
      ...progData,
      id: `prog-${Date.now()}`,
    };
    setPrograms((prev) => [...prev, newProg]);
    showToast(`Degree program "${newProg.name}" created`, 'success');
  };

  const createAnnouncement = (notice: Omit<Announcement, 'id' | 'published_at'>) => {
    const newNotice: Announcement = {
      ...notice,
      id: `anc-${Date.now()}`,
      published_at: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newNotice, ...prev]);
    showToast(`Notice "${notice.title}" published!`, 'success');
  };

  const toggleEventRsvp = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const nextState = !e.is_registered;
        return {
          ...e,
          is_registered: nextState,
          attendees_count: nextState ? e.attendees_count + 1 : Math.max(0, e.attendees_count - 1),
        };
      })
    );
    showToast('Event registration updated', 'info');
  };

  const createFeeChallan = (
    studentId: string,
    semesterId: string,
    tuition: number,
    lab: number,
    lib: number,
    discount: number
  ) => {
    const student = studentsList.find((s) => s.id === studentId);
    const semester = semesters.find((s) => s.id === semesterId);
    if (!student || !semester) return;

    const challanNo = `CH-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0];

    const newFee: FeeRecord = {
      id: `fee-${Date.now()}`,
      student_id: student.id,
      student_name: student.full_name,
      reg_no: student.reg_no,
      semester_id: semester.id,
      semester_name: semester.name,
      challan_no: challanNo,
      issue_date: today,
      due_date: dueDate,
      tuition_fee: tuition,
      lab_fee: lab,
      library_fee: lib,
      discount: discount,
      total_amount: tuition + lab + lib - discount,
      status: 'Pending',
    };

    setFeeRecords((prev) => [newFee, ...prev]);
    showToast(`Fee challan ${challanNo} issued to ${student.full_name}`, 'success');
  };

  const resetAllData = () => {
    localStorage.clear();
    setDepartments(INITIAL_DEPARTMENTS);
    setPrograms(INITIAL_PROGRAMS);
    setCourses(INITIAL_COURSES);
    setFacultyList(INITIAL_FACULTY);
    setStudentsList(INITIAL_STUDENTS);
    setEnrollments(INITIAL_ENROLLMENTS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setAssessments(INITIAL_ASSESSMENTS);
    setResults(INITIAL_RESULTS);
    setFeeRecords(INITIAL_FEES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setEvents(INITIAL_EVENTS);
    setApplications(INITIAL_APPLICATIONS);
    setActiveStudentId('stu-1');
    setActiveFacultyId('fac-1');
    showToast('Reset all database tables to initial seed records', 'info');
  };

  return (
    <UniversityContext.Provider
      value={{
        activePortal,
        setActivePortal,
        userRole,
        setUserRole,
        activeStudent,
        setActiveStudentId,
        activeFaculty,
        setActiveFacultyId,
        departments,
        programs,
        courses,
        semesters,
        facultyList,
        studentsList,
        enrollments,
        attendanceRecords,
        assessments,
        results,
        feeRecords,
        announcements,
        events,
        applications,
        timetable,
        enrollCourse,
        dropCourse,
        payFee,
        markAttendance,
        markBatchAttendance,
        updateResultMarks,
        createAssessment,
        submitApplication,
        updateApplicationStatus,
        addCourse,
        addStudent,
        addFaculty,
        addDepartment,
        addProgram,
        createAnnouncement,
        toggleEventRsvp,
        createFeeChallan,
        resetAllData,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
};

export const useUniversity = () => {
  const context = useContext(UniversityContext);
  if (!context) {
    throw new Error('useUniversity must be used within a UniversityProvider');
  }
  return context;
};
