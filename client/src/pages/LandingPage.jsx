import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, ChevronRight, Calendar, Book, PenTool, UserPlus } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function LandingPage() {
    return (
        <div className="mobile-container" style={{ overflowY: 'auto', paddingBottom: '40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}>
                <ThemeToggle />
            </div>
            {/* Hero Section */}
            <header style={{ textAlign: 'center', marginBottom: '32px', marginTop: '32px' }}>
                <h1 style={{ fontSize: '48px', margin: '0 0 12px 0', textShadow: '0 0 20px rgba(0, 168, 232, 0.4)' }}>
                    Pora<span style={{ color: 'var(--c-accent-1)' }}>Pao</span>
                </h1>
                <p style={{ color: 'var(--c-text-secondary)', fontSize: '16px', lineHeight: '1.5', maxWidth: '300px', margin: '0 auto' }}>
                    The ultimate smart dashboard for private tutors and their students.
                </p>
            </header>

            {/* Login Links (Primary CTAs) */}
            <div className="responsive-grid-2" style={{ marginBottom: '40px' }}>
                <Link to="/login/tutor" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'transform 0.2s', ':active': { transform: 'scale(0.98)' } }}>
                        <div style={{ background: 'rgba(0, 168, 232, 0.2)', padding: '16px', borderRadius: '50%' }}>
                            <GraduationCap size={28} color="var(--c-accent-1)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: 'var(--c-text-primary)' }}>Tutor Portal</h3>
                            <p style={{ margin: 0, color: 'var(--c-text-secondary)', fontSize: '13px' }}>Manage schedules & assignments</p>
                        </div>
                        <ChevronRight color="var(--c-text-secondary)" />
                    </div>
                </Link>

                <Link to="/login/student" style={{ textDecoration: 'none' }}>
                    <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'transform 0.2s', ':active': { transform: 'scale(0.98)' } }}>
                        <div style={{ background: 'rgba(76, 175, 80, 0.15)', padding: '16px', borderRadius: '50%' }}>
                            <BookOpen size={28} color="#4caf50" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: 'var(--c-text-primary)' }}>Student Portal</h3>
                            <p style={{ margin: 0, color: 'var(--c-text-secondary)', fontSize: '13px' }}>View routines via unique code</p>
                        </div>
                        <ChevronRight color="var(--c-text-secondary)" />
                    </div>
                </Link>
            </div>

            {/* Tutorial Showcase */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', color: 'var(--c-text-primary)', display: 'inline-block', borderBottom: '2px solid var(--c-accent-1)', paddingBottom: '4px' }}>How to Use Pora Pao</h2>
            </div>

            <div className="responsive-grid">
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ background: 'rgba(0, 168, 232, 0.2)', padding: '12px', borderRadius: '50%', flexShrink: 0 }}>
                        <UserPlus size={24} color="var(--c-accent-1)" />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--c-text-primary)' }}>1. Onboard Students</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: '1.4' }}>Tutors create a student profile to generate a secure, unique 6-digit login code. Share this code with your student!</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ background: 'rgba(255, 179, 71, 0.15)', padding: '12px', borderRadius: '50%', flexShrink: 0 }}>
                        <Calendar size={24} color="#ffb347" />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--c-text-primary)' }}>2. Set the Routine</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: '1.4' }}>Open the student's profile to set their weekly tuition days. The Mini Calendar keeps both of you synced on schedule changes.</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ background: 'rgba(156, 39, 176, 0.15)', padding: '12px', borderRadius: '50%', flexShrink: 0 }}>
                        <Book size={24} color="#9c27b0" />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--c-text-primary)' }}>3. Manage Subjects</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: '1.4' }}>Add subjects specific to that student. Assign homework or upcoming quizzes directly under these subjects.</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ background: 'rgba(76, 175, 80, 0.15)', padding: '12px', borderRadius: '50%', flexShrink: 0 }}>
                        <PenTool size={24} color="#4caf50" />
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--c-text-primary)' }}>4. Grade & Track</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: '1.4' }}>Grade pending assignments with a single click. Pora Pao automatically graphs this data into visual performance analytics!</p>
                    </div>
                </div>
            </div>

            <footer style={{ marginTop: '40px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.3)', margin: 0 }}>©Pora Pao | Mostofa Hasin Mahdi</p>
            </footer>
        </div>
    );
}
