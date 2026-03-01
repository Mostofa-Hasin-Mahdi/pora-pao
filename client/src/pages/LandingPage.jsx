import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, ChevronRight, BarChart2, Calendar, Edit3, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="mobile-container" style={{ overflowY: 'auto', paddingBottom: '40px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
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

            {/* Features Showcase */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', color: 'white', display: 'inline-block', borderBottom: '2px solid var(--c-accent-1)', paddingBottom: '4px' }}>Why Pora Pao?</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <Calendar size={28} color="#ffb347" style={{ flexShrink: 0 }} />
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'white' }}>Intuitive Routine Calendars</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: '1.4' }}>Visualize your teaching and studying days seamlessly, complete with automated reschedule alerts.</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <BarChart2 size={28} color="var(--c-accent-1)" style={{ flexShrink: 0 }} />
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'white' }}>Advanced Performance Analytics</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: '1.4' }}>Track academic progress instantly through generated student Bar Charts, Area Charts, and Progress Timelines.</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <Edit3 size={28} color="#4caf50" style={{ flexShrink: 0 }} />
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'white' }}>Automated Grading System</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: '1.4' }}>Assign and grade homework and quizzes with just a click, automatically generating organized history logs.</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <ShieldCheck size={28} color="#9c27b0" style={{ flexShrink: 0 }} />
                    <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'white' }}>Code-Based Security</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: '1.4' }}>No emails required for students! Log in effortlessly through 6-digit cryptographic codes issued by your tutor.</p>
                    </div>
                </div>
            </div>

            <footer style={{ marginTop: '40px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.3)', margin: 0 }}>©Pora Pao | Mostofa Hasin Mahdi</p>
            </footer>
        </div>
    );
}
