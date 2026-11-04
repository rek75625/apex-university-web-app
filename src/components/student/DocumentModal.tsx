import React from 'react';
import { Student, Enrollment, ResultRecord, FeeRecord } from '../../types/university';
import { X, Printer, Download, CheckCircle, Shield, QrCode } from 'lucide-react';

export type DocumentType = 'admit_card' | 'bonafide' | 'fee_receipt' | 'transcript';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  docType: DocumentType;
  student: Student;
  enrollments: Enrollment[];
  results: ResultRecord[];
  feeRecords: FeeRecord[];
}

export const DocumentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  docType,
  student,
  enrollments,
  results,
  feeRecords,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const studentEnrollments = enrollments.filter(
    (e) => e.student_id === student.id && e.status === 'Enrolled'
  );
  const studentResults = results.filter((r) => r.student_id === student.id);
  const studentPaidFees = feeRecords.filter((f) => f.student_id === student.id && f.status === 'Paid');
  const latestPaidFee = studentPaidFees[0] || feeRecords[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="px-6 py-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50 no-print">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-stone-700" />
            <span className="font-serif font-semibold text-sm text-stone-900">
              Official University Document Viewer
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-8 overflow-y-auto font-sans bg-white text-stone-900 print-page text-xs leading-relaxed">
          
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-stone-900 pb-4 mb-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-stone-900 text-white flex items-center justify-center font-serif font-bold text-xl rounded">
                AU
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold tracking-tight text-stone-950">
                  APEX UNIVERSITY
                </h1>
                <p className="text-[11px] font-mono text-stone-600">
                  Office of Academic Records & University Registrar · Cambridge Campus
                </p>
                <p className="text-[10px] text-stone-500 font-mono">
                  Accreditation: Washington Accord · ABET · AACSB Global
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-stone-600">
              <p>Date: {new Date().toISOString().split('T')[0]}</p>
              <p>Doc Ref: AU-DOC-{student.reg_no.replace(/-/g, '')}-26</p>
            </div>
          </div>

          {/* 1. ADMIT CARD */}
          {docType === 'admit_card' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-stone-900">
                  Semester Final Examination Admit Card
                </h2>
                <p className="text-xs text-stone-500 font-mono">Fall Semester 2026</p>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-stone-50 border border-stone-200 rounded-lg mb-6">
                <div>
                  <span className="text-stone-500 font-mono text-[10px] block">STUDENT NAME</span>
                  <span className="font-bold text-stone-900 text-sm">{student.full_name}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-mono text-[10px] block">REGISTRATION NUMBER</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{student.reg_no}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-mono text-[10px] block">DEGREE PROGRAM</span>
                  <span className="font-medium text-stone-900">{student.program_name}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-mono text-[10px] block">DEPARTMENT</span>
                  <span className="font-medium text-stone-900">{student.department_name}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-mono text-[10px] block">SEMESTER</span>
                  <span className="font-medium text-stone-900">Semester {student.current_semester}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-mono text-[10px] block">ATTENDANCE VERIFICATION</span>
                  <span className="font-mono text-emerald-700 font-semibold">ELIGIBLE (&gt; 75%)</span>
                </div>
              </div>

              <h3 className="font-serif font-semibold text-sm mb-2 text-stone-900">
                Authorized Examination Schedule
              </h3>
              <table className="w-full text-left border border-stone-300 mb-6">
                <thead className="bg-stone-100 font-mono text-[11px] text-stone-700">
                  <tr>
                    <th className="p-2 border border-stone-300">Course Code</th>
                    <th className="p-2 border border-stone-300">Course Title</th>
                    <th className="p-2 border border-stone-300">Exam Date & Time</th>
                    <th className="p-2 border border-stone-300">Examination Hall</th>
                    <th className="p-2 border border-stone-300 text-center">Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody>
                  {studentEnrollments.map((e, idx) => (
                    <tr key={e.id} className="border border-stone-300">
                      <td className="p-2 font-mono font-bold border border-stone-300">{e.course_code}</td>
                      <td className="p-2 border border-stone-300">{e.course_title}</td>
                      <td className="p-2 font-mono border border-stone-300">Dec {12 + idx * 3}, 2026 (09:30 AM)</td>
                      <td className="p-2 font-mono border border-stone-300">Hall {String.fromCharCode(65 + idx)}</td>
                      <td className="p-2 border border-stone-300 text-center text-stone-300">___________</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between pt-6 border-t border-stone-300 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 border-2 border-stone-900 p-1 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-stone-900" />
                  </div>
                  <div className="text-[10px] font-mono text-stone-500">
                    <p>Biometric QR Verification ID</p>
                    <p>{student.reg_no} · FA26</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic font-bold text-sm text-stone-800">Arthur Pendelton</div>
                  <p className="text-[10px] font-mono text-stone-500">Controller of Examinations</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. BONAFIDE CERTIFICATE */}
          {docType === 'bonafide' && (
            <div className="py-6">
              <div className="text-center mb-8">
                <h2 className="font-serif text-xl font-bold uppercase tracking-wider text-stone-900 underline decoration-stone-300 underline-offset-4">
                  Bonafide Student Certificate
                </h2>
                <p className="text-xs text-stone-500 font-mono mt-1">TO WHOM IT MAY CONCERN</p>
              </div>

              <div className="space-y-4 text-stone-800 text-sm leading-relaxed max-w-2xl mx-auto text-justify">
                <p>
                  This is to officially certify that <strong className="font-semibold text-stone-950">{student.full_name}</strong>, bearing University Registration Number <strong className="font-mono text-stone-950">{student.reg_no}</strong>, is a regular, full-time bonafide student of Apex University in the Department of <strong className="text-stone-950">{student.department_name}</strong>.
                </p>

                <p>
                  The candidate is currently enrolled in Semester {student.current_semester} of the <strong className="text-stone-950">{student.program_name}</strong> (4-Year Degree Program). The candidate was admitted on <span className="font-mono">{student.admission_date}</span> and has consistently demonstrated exemplary academic discipline and moral conduct.
                </p>

                <p>
                  As per official academic transcripts, the student has earned <strong className="font-mono">{student.credit_completed} Credit Hours</strong> with a Cumulative Grade Point Average (CGPA) of <strong className="font-mono">{student.cgpa} out of 4.00</strong>.
                </p>

                <p>
                  This certificate is issued upon the student’s specific request for the purpose of scholarship evaluation, visa sponsorship, or internship application, without any financial liability on the part of Apex University.
                </p>
              </div>

              <div className="flex items-end justify-between pt-16 mt-12 border-t border-stone-200">
                <div className="text-center">
                  <div className="w-20 h-20 border-2 border-stone-400 rounded-full flex items-center justify-center font-serif text-[10px] text-stone-500 uppercase tracking-widest text-center mx-auto mb-1">
                    OFFICIAL<br/>SEAL
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">Apex University Registrar</span>
                </div>

                <div className="text-right">
                  <div className="font-serif italic font-bold text-base text-stone-900">Dr. Eleanor Sterling</div>
                  <p className="text-xs text-stone-700 font-medium">Registrar & Dean of Academic Affairs</p>
                  <p className="text-[10px] font-mono text-stone-500">Apex University, Cambridge</p>
                </div>
              </div>
            </div>
          )}

          {/* 3. FEE RECEIPT */}
          {docType === 'fee_receipt' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-stone-900">
                  Official University Fee Clearance Receipt
                </h2>
                <p className="text-xs text-stone-500 font-mono">Bursar & Treasury Department</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-stone-50 border border-stone-200 rounded-lg mb-6">
                <div>
                  <span className="text-stone-500 font-mono text-[10px] block">STUDENT DETAILS</span>
                  <p className="font-bold text-stone-900">{student.full_name}</p>
                  <p className="font-mono text-stone-700">{student.reg_no} · {student.program_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 font-mono text-[10px] block">PAYMENT TRANSACTION</span>
                  <p className="font-mono font-bold text-emerald-700">STATUS: PAID & CLEARED</p>
                  <p className="font-mono text-stone-700">Ref: {latestPaidFee.transaction_ref || 'TXN-90281982'}</p>
                </div>
              </div>

              <table className="w-full text-left border border-stone-300 mb-6 text-xs">
                <thead className="bg-stone-100 font-mono text-stone-700">
                  <tr>
                    <th className="p-2 border border-stone-300">Fee Head Description</th>
                    <th className="p-2 border border-stone-300 text-right">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-stone-300">
                    <td className="p-2 border border-stone-300">Semester Tuition Fee (18 Credits)</td>
                    <td className="p-2 border border-stone-300 text-right font-mono">${latestPaidFee.tuition_fee.toLocaleString()}</td>
                  </tr>
                  <tr className="border border-stone-300">
                    <td className="p-2 border border-stone-300">Computing & Engineering Laboratory Fee</td>
                    <td className="p-2 border border-stone-300 text-right font-mono">${latestPaidFee.lab_fee.toLocaleString()}</td>
                  </tr>
                  <tr className="border border-stone-300">
                    <td className="p-2 border border-stone-300">Library & Research Digital Access</td>
                    <td className="p-2 border border-stone-300 text-right font-mono">${latestPaidFee.library_fee.toLocaleString()}</td>
                  </tr>
                  {latestPaidFee.discount > 0 && (
                    <tr className="border border-stone-300 bg-emerald-50 text-emerald-900">
                      <td className="p-2 border border-stone-300 font-medium">Merit Scholarship / Academic Concession</td>
                      <td className="p-2 border border-stone-300 text-right font-mono">-${latestPaidFee.discount.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-stone-900 font-bold bg-stone-100">
                    <td className="p-2">TOTAL NET AMOUNT RECEIVED</td>
                    <td className="p-2 text-right font-mono text-sm">${latestPaidFee.total_amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-6 border-t border-stone-200">
                <div className="font-mono text-[10px] text-stone-500">
                  <p>Method: {latestPaidFee.payment_method || 'Online Electronic Settlement'}</p>
                  <p>Challan No: {latestPaidFee.challan_no}</p>
                  <p>Settled: {latestPaidFee.paid_at || '2026-09-10'}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-emerald-800 font-bold text-xs border border-emerald-300 bg-emerald-50 px-3 py-1 rounded">
                    PAID IN FULL
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 4. UNOFFICIAL TRANSCRIPT */}
          {docType === 'transcript' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-stone-900">
                  Official Academic Grade Record & Transcript
                </h2>
                <p className="text-xs text-stone-500 font-mono">Cumulative Record up to Fall Semester 2026</p>
              </div>

              <div className="grid grid-cols-4 gap-3 p-3 bg-stone-50 border border-stone-200 rounded-lg mb-6 font-mono text-[11px]">
                <div>
                  <span className="text-stone-500 text-[10px] block">STUDENT</span>
                  <span className="font-bold text-stone-900">{student.full_name}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] block">REG. NO</span>
                  <span className="font-bold text-stone-900">{student.reg_no}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] block">PROGRAM</span>
                  <span className="text-stone-900">{student.program_name}</span>
                </div>
                <div>
                  <span className="text-stone-500 text-[10px] block">CURRENT CGPA</span>
                  <span className="font-bold text-emerald-700 text-sm">{student.cgpa} / 4.00</span>
                </div>
              </div>

              <table className="w-full text-left border border-stone-300 mb-6 text-xs">
                <thead className="bg-stone-100 font-mono text-stone-700 text-[11px]">
                  <tr>
                    <th className="p-2 border border-stone-300">Course Code</th>
                    <th className="p-2 border border-stone-300">Course Title</th>
                    <th className="p-2 border border-stone-300 text-center">Credits</th>
                    <th className="p-2 border border-stone-300 text-center">Score</th>
                    <th className="p-2 border border-stone-300 text-center">Grade</th>
                    <th className="p-2 border border-stone-300 text-center">Grade Point</th>
                  </tr>
                </thead>
                <tbody>
                  {studentResults.map((r) => (
                    <tr key={r.id} className="border border-stone-300">
                      <td className="p-2 font-mono font-semibold border border-stone-300">{r.course_code}</td>
                      <td className="p-2 border border-stone-300">{r.course_title}</td>
                      <td className="p-2 text-center font-mono border border-stone-300">{r.credit_hours}</td>
                      <td className="p-2 text-center font-mono border border-stone-300">{r.total_marks}%</td>
                      <td className="p-2 text-center font-bold border border-stone-300">{r.grade}</td>
                      <td className="p-2 text-center font-mono font-semibold border border-stone-300">{r.grade_point.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded flex justify-between items-center font-mono text-xs">
                <div>
                  Total Credits Attempted: <strong>{student.credit_completed}</strong> · Status: <strong>{student.status}</strong>
                </div>
                <div>
                  Cumulative GPA: <strong className="text-emerald-800 text-sm">{student.cgpa}</strong>
                </div>
              </div>

              <div className="pt-8 flex justify-between items-center text-[10px] text-stone-500 font-mono">
                <div>Grading Scale: A (90-100%, 4.0) · B (75-79%, 3.0) · C (60-64%, 2.0) · F (&lt;50%, 0.0)</div>
                <div>Registrar Examination Wing, Apex University</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
