import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { UNIVERSITY_IMAGES } from '../../data/seedData';
import { OnlineAdmissionModal } from './OnlineAdmissionModal';
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Calendar, 
  Bell, 
  MapPin, 
  Mail, 
  Phone, 
  ArrowRight, 
  Check, 
  Search, 
  ExternalLink, 
  Sparkles,
  Users,
  Award,
  ChevronRight,
  Clock
} from 'lucide-react';

export const PublicWebsite: React.FC = () => {
  const { 
    departments, 
    programs, 
    facultyList, 
    announcements, 
    events, 
    toggleEventRsvp, 
    setActivePortal, 
    showToast 
  } = useUniversity();

  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [selectedProgramForApply, setSelectedProgramForApply] = useState<string | undefined>(undefined);
  
  // Program filtering
  const [programFilter, setProgramFilter] = useState<'All' | 'BS' | 'MS'>('All');
  const [programSearch, setProgramSearch] = useState('');

  // Announcement category filter
  const [announcementCategory, setAnnouncementCategory] = useState<string>('All');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const filteredPrograms = programs.filter((prog) => {
    const matchesLevel = programFilter === 'All' || prog.level === programFilter;
    const matchesSearch = prog.name.toLowerCase().includes(programSearch.toLowerCase()) ||
                          prog.code.toLowerCase().includes(programSearch.toLowerCase()) ||
                          prog.department_name.toLowerCase().includes(programSearch.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const filteredAnnouncements = announcements.filter((a) => {
    if (announcementCategory === 'All') return true;
    return a.category.toLowerCase() === announcementCategory.toLowerCase();
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSent(true);
    showToast('Your message has been dispatched to the Registrar Information Desk.', 'success');
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      setContactSent(false);
    }, 4000);
  };

  return (
    <div className="bg-stone-50 min-h-screen text-stone-900 pb-20">
      
      {/* 1. Operational Institutional Ribbon */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-mono font-medium">Spring 2027 Admissions Open</span>
            <span aria-hidden="true" className="text-stone-600 hidden sm:inline">·</span>
            <span className="hidden sm:inline">Campus Open Day & Laboratory Tours: Every Friday 14:00 - 17:00</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400 text-[11px] font-mono">
            <span>Inquiries: +1 (555) 392-8800</span>
            <span>admissions@apex.edu</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative border-b border-stone-200 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs uppercase tracking-widest font-mono text-stone-500">
                Pioneering Scientific Excellence & Ethical Leadership · Since 1980
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-950 text-balance leading-[1.12]">
                Architects of Mind, Code, & Culture.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl font-normal">
                Apex University provides rigorous undergraduate and graduate education at the frontiers of Computer Science, Artificial Intelligence, Engineering, and Business Strategy.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedProgramForApply(undefined);
                    setIsAdmissionModalOpen(true);
                  }}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
                >
                  Apply for Admission
                </button>
                <a
                  href="#programs"
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider border border-stone-300 text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Explore Degrees
                </a>
                <button
                  onClick={() => setActivePortal('student')}
                  className="px-5 py-3 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5"
                >
                  <span>Student Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-6 border-t border-stone-100 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">4,200+</div>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">Enrolled Scholars</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">96.4%</div>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">Career Placement</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl sm:text-2xl text-stone-900">1:12</div>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">Faculty Ratio</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-md aspect-[4/3] bg-stone-100">
                <img
                  src={UNIVERSITY_IMAGES.campus}
                  alt="Apex University Main Quad and Collegiate Architecture"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white">
                    <p className="font-serif text-sm font-medium">Alan Turing Memorial Quadrangle</p>
                    <p className="text-[11px] text-stone-300 font-mono">Main Academic Campus · Established 1980</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Section Navigation Rail */}
      <div className="sticky top-16 z-30 bg-stone-100/90 backdrop-blur border-b border-stone-200 py-2.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium text-stone-600">
          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-stone-950 transition-colors">About University</a>
            <a href="#departments" className="hover:text-stone-950 transition-colors">Departments & Faculty</a>
            <a href="#programs" className="hover:text-stone-950 transition-colors">Degree Programs</a>
            <a href="#admissions" className="hover:text-stone-950 transition-colors">Admissions & Eligibility</a>
            <a href="#news" className="hover:text-stone-950 transition-colors">News & Notices</a>
            <a href="#contact" className="hover:text-stone-950 transition-colors">Events & Campus</a>
          </div>
          <div className="text-stone-500 font-mono text-[11px]">
            Academic Year 2026–2027
          </div>
        </div>
      </div>

      {/* 4. About the University */}
      <section id="about" className="py-16 sm:py-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-widest font-mono text-stone-500 block mb-2">
              01. Institutional Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-950 tracking-tight">
              A Legacy of Intellect, Scientific Rigor, and Community.
            </h2>
            <p className="text-stone-600 mt-4 leading-relaxed text-base">
              Founded over four decades ago, Apex University stands as a premiere center of higher learning committed to research that transforms society. We bridge fundamental mathematical foundations with applied industrial breakthroughs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
            <div className="rounded-xl overflow-hidden border border-stone-200 shadow-xs aspect-[16/9] bg-stone-100">
              <img
                src={UNIVERSITY_IMAGES.library}
                alt="Modern University Research Library and Commons"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-stone-200 shadow-xs aspect-[16/9] bg-stone-100">
              <img
                src={UNIVERSITY_IMAGES.lab}
                alt="Advanced Computer Engineering and Robotics Research Center"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl border border-stone-200/80">
              <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">Global Accreditation</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Fully accredited by national and international evaluation boards. Engineering and Computing degrees adhere to Washington Accord and ABET benchmarks.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-stone-200/80">
              <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">Research Facilities</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                6 advanced research centers comprising high-performance GPU clusters, semiconductor prototype testing labs, and venture incubation spaces.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-stone-200/80">
              <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">Industry Partnerships</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Active cooperative agreements with top multinational technology corporations, venture funds, and academic consortia worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Departments and Faculties */}
      <section id="departments" className="py-16 sm:py-24 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-stone-500 block mb-2">
                02. Academic Divisions
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-950 tracking-tight">
                Departments & World-Class Faculties.
              </h2>
            </div>
            <p className="text-stone-500 text-xs max-w-md font-mono">
              Home to over 96 distinguished professors, researchers, and fellows across multiple disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept) => {
              const deptFaculty = facultyList.filter((f) => f.department_id === dept.id);
              return (
                <div
                  key={dept.id}
                  className="p-6 bg-stone-50 rounded-xl border border-stone-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-200/80 rounded text-stone-800">
                        {dept.code}
                      </span>
                      <span className="text-xs text-stone-500 font-mono">Est. {dept.established_year}</span>
                    </div>

                    <h3 className="font-serif text-xl font-semibold text-stone-900 mb-2">
                      {dept.name}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {dept.description}
                    </p>

                    <div className="text-xs text-stone-700 space-y-1.5 pt-3 border-t border-stone-200/80 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Department Head:</span>
                        <span className="font-medium text-stone-900">{dept.head_faculty_name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Academic Complex:</span>
                        <span className="font-mono text-stone-800">{dept.building}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono uppercase text-stone-500 block mb-2">Featured Faculty:</span>
                    <div className="flex flex-wrap gap-2">
                      {deptFaculty.map((f) => (
                        <div
                          key={f.id}
                          className="text-xs bg-white border border-stone-200 rounded px-2.5 py-1 text-stone-800"
                        >
                          <span className="font-medium">{f.full_name}</span> · <span className="text-stone-500 text-[11px]">{f.designation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Degree Programs */}
      <section id="programs" className="py-16 sm:py-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-widest font-mono text-stone-500 block mb-2">
              03. Curricula & Degrees
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-950 tracking-tight">
              Degree Programs & Academic Pathways.
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Explore our accredited 4-year undergraduate and 2-year postgraduate degrees tailored for future industry leaders and researchers.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg max-w-fit">
              {(['All', 'BS', 'MS'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setProgramFilter(lvl)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    programFilter === lvl
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {lvl === 'All' ? 'All Programs' : `${lvl} Degrees`}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search degrees (e.g. Computer Science, AI)"
                value={programSearch}
                onChange={(e) => setProgramSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {prog.code}
                    </span>
                    <span className="text-stone-500 font-mono">
                      {prog.duration_years} Years · {prog.credit_hours} Credits
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-stone-950 mb-2 leading-snug">
                    {prog.name}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {prog.overview}
                  </p>

                  <div className="bg-stone-50 rounded-lg p-3 text-xs space-y-1.5 border border-stone-100 mb-4">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Department:</span>
                      <span className="font-medium text-stone-800 text-right">{prog.department_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Tuition per Semester:</span>
                      <span className="font-mono font-bold text-stone-900">${prog.fee_per_semester.toLocaleString()}</span>
                    </div>
                    <div className="pt-1.5 border-t border-stone-200/60 text-[11px] text-stone-600">
                      <span className="font-semibold text-stone-800">Eligibility:</span> {prog.eligibility}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <div className="text-[11px] text-stone-500 truncate max-w-[150px]">
                    {prog.careers.slice(0, 2).join(', ')}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProgramForApply(prog.id);
                      setIsAdmissionModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-amber-700 transition-colors"
                  >
                    <span>Apply Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Admissions and Eligibility */}
      <section id="admissions" className="py-16 sm:py-24 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase tracking-widest font-mono text-stone-500 block">
                04. Admission Gateway
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-950 tracking-tight">
                Simple, Transparent, and Merit-Based Admissions.
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                We accept students based on intellectual potential, foundational math and science readiness, and commitment to academic ethics.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">Online Application Form</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Submit your academic qualifications and select your intended degree program.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">Aptitude & Merit Evaluation</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Evaluation of transcripts and standardized test or departmental aptitude scoring.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">Offer of Admission & Enrollment</h4>
                    <p className="text-xs text-stone-500 mt-0.5">Approved candidates receive their official registration number and semester fee invoice.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setIsAdmissionModalOpen(true)}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                >
                  Launch Online Application
                </button>
                <button
                  onClick={() => setIsAdmissionModalOpen(true)}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider border border-stone-300 rounded-lg text-stone-800 hover:bg-stone-50 transition-colors"
                >
                  Track Existing Application
                </button>
              </div>
            </div>

            {/* Eligibility Table */}
            <div className="lg:col-span-7 bg-stone-50 border border-stone-200 rounded-xl p-6">
              <h3 className="font-serif text-lg font-semibold text-stone-900 mb-4">
                Eligibility & Fee Overview (Academic Year 2026–2027)
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-300 font-mono text-[11px] text-stone-500">
                      <th className="py-2.5 font-medium">Program</th>
                      <th className="py-2.5 font-medium">Min. Academic Requirement</th>
                      <th className="py-2.5 font-medium text-right">Fee / Sem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {programs.map((p) => (
                      <tr key={p.id} className="hover:bg-white/80 transition-colors">
                        <td className="py-3 font-semibold text-stone-900">
                          {p.code} <span className="font-normal text-stone-600 block text-[11px]">{p.name}</span>
                        </td>
                        <td className="py-3 text-stone-600 pr-4">{p.eligibility}</td>
                        <td className="py-3 text-right font-mono font-semibold text-stone-900">
                          ${p.fee_per_semester.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <span>Merit Scholarships up to 50% tuition waiver for top 5% applicants.</span>
                <span className="font-mono text-stone-700">Code: SCHOLAR-2027</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. News and Announcements */}
      <section id="news" className="py-16 sm:py-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-stone-500 block mb-2">
                05. Campus Bulletin
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-950 tracking-tight">
                News & Official Announcements.
              </h2>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-stone-200/70 rounded-lg">
              {['All', 'Examination', 'Admissions', 'Academic', 'Research'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setAnnouncementCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    announcementCategory === cat
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white rounded-xl border border-stone-200 shadow-xs hover:border-stone-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                    <span className="font-mono font-medium px-2 py-0.5 bg-stone-100 rounded text-stone-700">
                      {item.category}
                    </span>
                    <span className="font-mono">{item.published_at}</span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {item.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-mono">
                  <span>Issued by: {item.author_name} ({item.author_role})</span>
                  <span>Target: {item.target_audience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Events & Contact Information */}
      <section id="contact" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Events Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest font-mono text-stone-500 block">
                06. Campus Life
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium text-stone-950 tracking-tight">
                Upcoming Academic Events & Symposia.
              </h2>
              <p className="text-xs text-stone-600">
                Join our symposiums, hackathons, and guest lectures hosted by internationally recognized scholars.
              </p>

              <div className="space-y-4 pt-2">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 bg-white border border-stone-200 rounded-xl shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs px-2 py-0.5 bg-amber-50 text-amber-900 font-medium rounded border border-amber-200/60">
                        {evt.category}
                      </span>
                      <span className="font-mono text-xs text-stone-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {evt.date}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-semibold text-stone-900 mb-1">
                      {evt.title}
                    </h4>

                    <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                      <span className="text-stone-500 font-mono text-[11px] truncate max-w-[200px]">
                        {evt.location}
                      </span>
                      <button
                        onClick={() => toggleEventRsvp(evt.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                          evt.is_registered
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-900 text-white hover:bg-stone-800'
                        }`}
                      >
                        {evt.is_registered ? '✓ Registered' : `RSVP (${evt.attendees_count})`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Inquiry Column */}
            <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-8 shadow-xs">
              <span className="text-xs uppercase tracking-widest font-mono text-stone-500 block mb-2">
                Direct Contact
              </span>
              <h3 className="font-serif text-2xl font-semibold text-stone-900 mb-2">
                University Registrar & Campus Inquiries
              </h3>
              <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                Have a question regarding admissions, credit transfers, or degree programs? Send a direct dispatch to the registrar desk.
              </p>

              {contactSent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center text-emerald-900 text-xs">
                  <p className="font-semibold text-sm mb-1">Thank you for contacting Apex University!</p>
                  <p>Your dispatch has been assigned ticket #AU-INQ-{Math.floor(1000 + Math.random() * 9000)}. An admissions advisor will reply within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Dr. / Mr. / Ms."
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Subject of Inquiry</label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="e.g. Credit transfer eligibility or Spring 2027 intake"
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Please write your detailed query here..."
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    Transmit Inquiry
                  </button>
                </form>
              )}

              {/* Campus Directory Info */}
              <div className="mt-8 pt-6 border-t border-stone-200 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>Apex University Main Campus, 400 Innovation Boulevard, Cambridge Campus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>Registrar Office: +1 (555) 392-8800 (Mon–Fri 08:30 - 17:00 EST)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>General: info@apex.edu · Admissions: admissions@apex.edu</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="border-t border-stone-300 bg-stone-900 text-stone-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-serif font-bold text-white text-base mb-2">Apex University</div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Chartered academic institution dedicated to foundational learning, technological pioneering, and ethical leadership.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-stone-200 mb-2">Academic Portals</h5>
              <ul className="space-y-1.5">
                <li><button onClick={() => setActivePortal('student')} className="hover:text-white transition-colors">Student Portal & Timetable</button></li>
                <li><button onClick={() => setActivePortal('faculty')} className="hover:text-white transition-colors">Faculty Portal & Attendance</button></li>
                <li><button onClick={() => setActivePortal('admin')} className="hover:text-white transition-colors">Administrative Console</button></li>
                <li><button onClick={() => setActivePortal('architecture')} className="hover:text-white transition-colors">Database Schema & API Specs</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-stone-200 mb-2">Faculties</h5>
              <ul className="space-y-1.5">
                <li><span>Computer Science & Engineering</span></li>
                <li><span>Artificial Intelligence & Data Science</span></li>
                <li><span>School of Business & Management</span></li>
                <li><span>Electrical & Computer Engineering</span></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-stone-200 mb-2">Accreditation</h5>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Recognized by Higher Education Commission, Washington Accord, and AACSB Global. All rights reserved.
              </p>
              <div className="mt-3 font-mono text-[10px] text-stone-500">
                © 1980–2026 Apex University.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Online Admission Application Modal */}
      <OnlineAdmissionModal
        isOpen={isAdmissionModalOpen}
        onClose={() => setIsAdmissionModalOpen(false)}
        preselectedProgramId={selectedProgramForApply}
      />

    </div>
  );
};
