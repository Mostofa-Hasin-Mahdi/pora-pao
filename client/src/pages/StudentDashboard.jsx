import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BookOpen, Calendar, Clock, LogOut, Bell, User, Edit3 } from 'lucide-react';
import MiniCalendar from '../components/MiniCalendar';
import ThemeToggle from '../components/ThemeToggle';

export default function StudentDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [studentId, setStudentId] = useState(null);
    const [studentName, setStudentName] = useState('');

    const [tutor, setTutor] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [subjectsMap, setSubjectsMap] = useState({});
    const [homeworks, setHomeworks] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const sId = localStorage.getItem('pora_student_id');
        const tId = localStorage.getItem('pora_tutor_id');
        const sName = localStorage.getItem('pora_student_name');

        if (!sId || !tId) {
            navigate('/login/student');
            return;
        }

        setStudentId(sId);
        setStudentName(sName);
        loadData(sId, tId);
    }, [navigate]);

    const loadData = async (sId, tId) => {
        setLoading(true);
        try {
            // 1. Fetch Tutor Info
            const { data: tutorData } = await supabase.from('tutors').select('name, phone_number').eq('id', tId).single();
            setTutor(tutorData);

            // 2. Fetch Schedule
            const { data: schedData } = await supabase.from('tuition_schedules').select('*').eq('student_id', sId).single();
            setSchedule(schedData);

            // 3. Fetch Subjects and create map for easy lookup
            const { data: subData } = await supabase.from('subjects').select('*').eq('tutor_id', tId);
            const subMap = {};
            if (subData) {
                subData.forEach(sub => subMap[sub.id] = sub.name);
            }
            setSubjectsMap(subMap);

            // 4. Fetch Pending Homeworks
            const { data: hwData } = await supabase.from('homeworks').select('*').eq('student_id', sId).eq('status', 'pending');
            setHomeworks(hwData || []);

            // 5. Fetch Upcoming Quizzes (no marks obtained yet)
            const { data: quizData } = await supabase.from('quizzes').select('*').eq('student_id', sId).is('marks_obtained', null);
            setQuizzes(quizData || []);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('pora_student_id');
        localStorage.removeItem('pora_student_name');
        localStorage.removeItem('pora_tutor_id');
        navigate('/login/student');
    };

    const formatTime12hr = (time24) => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    };

    const isRescheduled = schedule && schedule.rescheduled_date;

    if (loading) return <div className="mobile-container"><p style={{ marginTop: '40px', textAlign: 'center' }}>Loading your dashboard...</p></div>;

    return (
        <div className="mobile-container">
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Hi, {studentName} <span role="img" aria-label="wave">👋</span>
                    </h2>
                    <p style={{ color: 'var(--c-text-secondary)', fontSize: '14px', margin: 0 }}>Welcome to your dashboard</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <ThemeToggle />
                    <button
                        onClick={handleLogout}
                        style={{ background: 'transparent', border: 'none', color: 'var(--c-text-secondary)', cursor: 'pointer' }}
                        title="Logout"
                    >
                        <LogOut size={24} />
                    </button>
                </div>
            </header>

            {/* Reschedule Alert */}
            {isRescheduled && (
                <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px', background: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.3)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <Bell color="#ff6b6b" size={24} style={{ marginTop: '2px' }} />
                        <div>
                            <h4 style={{ color: '#ff6b6b', margin: '0 0 4px 0', fontSize: '16px' }}>Tuition Rescheduled!</h4>
                            <p style={{ fontSize: '14px', color: 'var(--c-text-secondary)', margin: 0 }}>
                                Your tutor rescheduled a session to <strong style={{ color: 'var(--c-text-primary)' }}>{new Date(schedule.rescheduled_date).toLocaleDateString()}</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Tutor Info & Basic Schedule */}
            <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="var(--c-accent-1)" /> Tutor & Schedule
            </h3>
            <div className="glass-card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tutor ? (
                    <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '18px' }}>{tutor.name}</p>
                        <p style={{ margin: 0, color: 'var(--c-text-secondary)', fontSize: '14px' }}>Phone: {tutor.phone_number}</p>
                    </div>
                ) : (
                    <p style={{ color: 'var(--c-text-secondary)' }}>No tutor information available.</p>
                )}

                {schedule ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--c-text-secondary)', margin: '0 0 4px 0' }}>Days per Week</p>
                            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{schedule.days_per_week}</p>
                        </div>
                        {schedule.scheduled_time && (
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '12px', color: 'var(--c-text-secondary)', margin: '0 0 4px 0' }}>Usual Time</p>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{formatTime12hr(schedule.scheduled_time)}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <p style={{ color: 'var(--c-text-secondary)', fontSize: '14px' }}>No schedule set yet.</p>
                )}

                {schedule && schedule.routine_days && schedule.routine_days.length > 0 && (
                    <MiniCalendar routineDays={schedule.routine_days} rescheduledDate={schedule.rescheduled_date} />
                )}
            </div>

            {/* Pending Homework */}
            <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="var(--c-accent-1)" /> Pending Homework
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {homeworks.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--c-text-secondary)', margin: 0, fontSize: '14px' }}>You have no pending homework. Great job!</p>
                    </div>
                ) : (
                    homeworks.map(hw => (
                        <div key={hw.id} className="glass-panel" style={{ padding: '16px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--c-accent-1)', fontWeight: 'bold', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                {subjectsMap[hw.subject_id] || 'Subject'}
                            </span>
                            <p style={{ margin: '8px 0 0 0', fontSize: '15px' }}>{hw.description}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Upcoming Quizzes */}
            <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="var(--c-accent-1)" /> Upcoming Quizzes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px' }}>
                {quizzes.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--c-text-secondary)', margin: 0, fontSize: '14px' }}>No upcoming quizzes scheduled.</p>
                    </div>
                ) : (
                    quizzes.map(quiz => (
                        <div key={quiz.id} className="glass-panel" style={{ padding: '16px', background: 'rgba(0, 100, 148, 0.1)' }}>
                            <span style={{ fontSize: '12px', color: '#ffb347', fontWeight: 'bold', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                {subjectsMap[quiz.subject_id] || 'Subject'} Quiz Alert!
                            </span>
                            <p style={{ margin: '8px 0 0 0', fontSize: '15px' }}><strong>Syllabus:</strong> {quiz.syllabus}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Links */}
            <div style={{ paddingBottom: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="glass-button" style={{ background: 'var(--glass-bg)', color: 'var(--c-text-primary)', border: '1px solid var(--glass-border)' }} onClick={() => navigate('/student/history')}>
                    View Graded History
                </button>
                <button className="glass-button" onClick={() => navigate('/student/performance')}>
                    View My Analytics
                </button>
            </div>
        </div>
    );
}
