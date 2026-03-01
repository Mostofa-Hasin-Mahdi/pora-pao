import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import TutorLogin from './pages/TutorLogin';
import StudentLogin from './pages/StudentLogin';
import TutorDashboard from './pages/TutorDashboard';
import TutorStudentDetail from './pages/TutorStudentDetail';
import StudentDashboard from './pages/StudentDashboard';
import Performance from './pages/Performance';
import HistoryPage from './pages/HistoryPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/tutor" element={<TutorLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />
        {/* Tutor Routes */}
        <Route path="/tutor/dashboard" element={<TutorDashboard />} />
        <Route path="/tutor/students/:id" element={<TutorStudentDetail />} />
        <Route path="/tutor/students/:id/performance" element={<Performance />} />
        <Route path="/tutor/students/:id/history" element={<HistoryPage />} />
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/performance" element={<Performance />} />
        <Route path="/student/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
