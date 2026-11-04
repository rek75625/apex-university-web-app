import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { X, CheckCircle2, GraduationCap, Send, Search } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedProgramId?: string;
}

export const OnlineAdmissionModal: React.FC<Props> = ({ isOpen, onClose, preselectedProgramId }) => {
  const { programs, submitApplication, applications } = useUniversity();

  const [activeTab, setActiveTab] = useState<'apply' | 'track'>('apply');
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [programId, setProgramId] = useState(preselectedProgramId || programs[0]?.id || '');
  const [previousDegree, setPreviousDegree] = useState('High School Diploma / FSC / A-Levels');
  const [cgpaOrScore, setCgpaOrScore] = useState('');
  const [passedYear, setPassedYear] = useState('2026');
  const [submittedTrackingNo, setSubmittedTrackingNo] = useState<string | null>(null);

  // Tracking query state
  const [trackQuery, setTrackQuery] = useState('');
  const [searchedApp, setSearchedApp] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !email || !phone || !cgpaOrScore) return;

    const prog = programs.find((p) => p.id === programId);
    const trackingNo = submitApplication({
      applicant_name: applicantName,
      email,
      phone,
      program_id: programId,
      program_name: prog ? prog.name : 'Undergraduate Degree',
      previous_degree: previousDegree,
      cgpa_or_percentage: cgpaOrScore,
      passed_year: parseInt(passedYear) || 2026,
    });

    setSubmittedTrackingNo(trackingNo);
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = applications.find(
      (a) => a.tracking_no.toLowerCase() === trackQuery.trim().toLowerCase()
    );
    setSearchedApp(found || 'NOT_FOUND');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-serif text-lg font-semibold text-stone-900">
              Apex University Admissions Portal
            </h3>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Spring / Fall 2027 Academic Year Application
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-md hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-100/60">
          <button
            onClick={() => { setActiveTab('apply'); setSubmittedTrackingNo(null); }}
            className={`py-2.5 text-xs font-medium border-b-2 mr-6 transition-colors ${
              activeTab === 'apply'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Submit Application
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`py-2.5 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'track'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Track Application Status
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'apply' ? (
            submittedTrackingNo ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-semibold text-stone-900 mb-2">
                  Application Submitted Successfully
                </h4>
                <p className="text-sm text-stone-600 max-w-md mx-auto mb-6">
                  Your admission file has been logged in the university admissions registry. Please note your official application tracking number:
                </p>

                <div className="inline-block bg-stone-100 border border-stone-300 rounded-lg px-6 py-3 font-mono text-lg font-bold text-stone-900 mb-6">
                  {submittedTrackingNo}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setTrackQuery(submittedTrackingNo);
                      setActiveTab('track');
                      const found = applications.find((a) => a.tracking_no === submittedTrackingNo);
                      setSearchedApp(found);
                    }}
                    className="px-4 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                  >
                    View Status in Tracker
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Applicant Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Zainab Qureshi"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="applicant@domain.com"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Contact Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Target Degree Program *
                    </label>
                    <select
                      value={programId}
                      onChange={(e) => setProgramId(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                    >
                      {programs.map((prog) => (
                        <option key={prog.id} value={prog.id}>
                          {prog.code} — {prog.name} ({prog.level})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Prior Degree / School Qualification
                    </label>
                    <input
                      type="text"
                      required
                      value={previousDegree}
                      onChange={(e) => setPreviousDegree(e.target.value)}
                      placeholder="A-Levels / FSC Pre-Eng / High School"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Academic Score / GPA / Percentage *
                    </label>
                    <input
                      type="text"
                      required
                      value={cgpaOrScore}
                      onChange={(e) => setCgpaOrScore(e.target.value)}
                      placeholder="e.g. 3.85 GPA or 88%"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5 font-medium text-stone-800 mb-1">
                    <GraduationCap className="w-3.5 h-3.5 text-stone-700" />
                    <span>Admissions Office Verification Notice</span>
                  </div>
                  <p>
                    All applicants will be reviewed within 5 business days. Shortlisted candidates for Computer Science and Artificial Intelligence will receive an aptitude evaluation invite via email.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Official Application</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleTrackSearch} className="flex gap-2">
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="Enter Tracking No. e.g. ADM-2026-9018"
                  className="flex-1 text-xs px-3 py-2 border border-stone-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </form>

              {searchedApp === 'NOT_FOUND' && (
                <div className="p-4 bg-stone-100 rounded-lg text-xs text-stone-600 text-center">
                  No admission record found matching tracking query "{trackQuery}". Please double check your tracking code or submit an application.
                </div>
              )}

              {searchedApp && searchedApp !== 'NOT_FOUND' && (
                <div className="border border-stone-200 rounded-lg p-4 bg-stone-50 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <div>
                      <span className="font-mono text-[11px] text-stone-500">Tracking Code</span>
                      <p className="font-mono font-bold text-stone-900 text-sm">{searchedApp.tracking_no}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[11px] text-stone-500">Status</span>
                      <p className={`font-semibold ${
                        searchedApp.status === 'Approved' ? 'text-emerald-700' :
                        searchedApp.status === 'Rejected' ? 'text-rose-700' :
                        searchedApp.status === 'Under Review' ? 'text-amber-700' : 'text-stone-700'
                      }`}>
                        {searchedApp.status}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-stone-500">Applicant:</span>
                      <p className="font-medium text-stone-900">{searchedApp.applicant_name}</p>
                    </div>
                    <div>
                      <span className="text-stone-500">Degree Program:</span>
                      <p className="font-medium text-stone-900">{searchedApp.program_name}</p>
                    </div>
                    <div>
                      <span className="text-stone-500">Submitted Date:</span>
                      <p className="font-mono text-stone-800">{searchedApp.submitted_at}</p>
                    </div>
                    <div>
                      <span className="text-stone-500">Assigned Reg Number:</span>
                      <p className="font-mono font-semibold text-stone-900">
                        {searchedApp.assigned_reg_no || 'Pending Final Approval'}
                      </p>
                    </div>
                  </div>

                  {searchedApp.review_notes && (
                    <div className="p-2.5 bg-stone-100 rounded text-stone-700 border border-stone-200/60">
                      <span className="font-medium text-stone-900 block mb-0.5">Admissions Committee Notes:</span>
                      {searchedApp.review_notes}
                    </div>
                  )}
                </div>
              )}

              {/* Sample codes to test */}
              <div className="pt-2">
                <span className="text-[11px] text-stone-500 block mb-1">Try testing with existing applicant codes:</span>
                <div className="flex flex-wrap gap-2">
                  {applications.slice(0, 3).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        setTrackQuery(a.tracking_no);
                        setSearchedApp(a);
                      }}
                      className="font-mono text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300 text-stone-800"
                    >
                      {a.tracking_no} ({a.applicant_name} · {a.status})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
