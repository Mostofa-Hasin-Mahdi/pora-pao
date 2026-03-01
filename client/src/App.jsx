import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import TutorLogin from './pages/TutorLogin';
import StudentLogin from './pages/StudentLogin';
import TutorDashboard from './pages/TutorDashboard';
import TutorStudentDetail from './pages/TutorStudentDetail';

function LandingPage() {
  return (
    <div className="mobile-container">
      <header style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
        <h1 style={{ fontSize: '36px', textShadow: '0 0 20px rgba(0, 109, 164, 0.4)' }}>
          Pora<span style={{ color: 'var(--c-accent-1)' }}>Pao</span>
        </h1>
        <p style={{ color: 'var(--c-text-secondary)', marginTop: '8px' }}>
          Your smart mobile learning dashboard.
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
        <Link to="/login/tutor" style={{ textDecoration: 'none' }}>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'var(--glass-highlight)', padding: '16px', borderRadius: '50%' }}>
              <GraduationCap size={32} color="var(--c-accent-1)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '4px', fontSize: '20px', color: 'var(--c-text-primary)' }}>I am a Tutor</h3>
              <p style={{ color: 'var(--c-text-secondary)', fontSize: '14px' }}>Log in to manage your students.</p>
            </div>
            <ChevronRight color="var(--c-text-secondary)" />
          </div>
        </Link>
        <Link to="/login/student" style={{ textDecoration: 'none' }}>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'var(--glass-highlight)', padding: '16px', borderRadius: '50%' }}>
              <BookOpen size={32} color="var(--c-accent-1)" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '4px', fontSize: '20px', color: 'var(--c-text-primary)' }}>I am a Student</h3>
              <p style={{ color: 'var(--c-text-secondary)', fontSize: '14px' }}>Log in with your unique code.</p>
            </div>
            <ChevronRight color="var(--c-text-secondary)" />
          </div>
        </Link>

        <div style={{ marginTop: 'auto', textAlign: 'center', padding: '24px 0' }}>
          <button className="glass-button">
            Try Demo
          </button>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/tutor" element={<TutorLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />
        {/* Placeholder dashboard routes for now */}
        <Route path="/tutor/dashboard" element={<TutorDashboard />} />
        <Route path="/tutor/students/:id" element={<TutorStudentDetail />} />
        <Route path="/student/dashboard" element={<div className="mobile-container"><h2 style={{ color: 'white' }}>Student Dashboard</h2></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
