/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UniversityProvider, useUniversity } from './context/UniversityContext';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { PublicWebsite } from './components/public/PublicWebsite';
import { StudentPortal } from './components/student/StudentPortal';
import { FacultyPortal } from './components/faculty/FacultyPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ArchitectureViewer } from './components/architecture/ArchitectureViewer';

const AppContent: React.FC = () => {
  const { activePortal } = useUniversity();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <Header />
      
      <main className="flex-1">
        {activePortal === 'public' && <PublicWebsite />}
        {activePortal === 'student' && <StudentPortal />}
        {activePortal === 'faculty' && <FacultyPortal />}
        {activePortal === 'admin' && <AdminDashboard />}
        {activePortal === 'architecture' && <ArchitectureViewer />}
      </main>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <UniversityProvider>
      <AppContent />
    </UniversityProvider>
  );
}
