import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Calendar, Book, PenTool, Clock } from 'lucide-react';
import MiniCalendar from '../components/MiniCalendar';

export default function TutorStudentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // Forms and Data
    const [subjects, setSubjects] = useState([]);
    const [schedule, setSchedule] = useState(null);
    const [pendingHw, setPendingHw] = useState([]);
    const [pendingQuizzes, setPendingQuizzes] = useState([]);

    // Schedule Form State
    const [daysPerWeek, setDaysPerWeek] = useState(1);
    const [scheduledTime, setScheduledTime] = useState('');
    const [rescheduleDate, setRescheduleDate] = useState('');
    const [routineDays, setRoutineDays] = useState([]);

    // Quick Actions State
    const [newSubject, setNewSubject] = useState('');
    const [hwDesc, setHwDesc] = useState('');
    const [selectedSubjectHw, setSelectedSubjectHw] = useState('');
    const [quizSyllabus, setQuizSyllabus] = useState('');
    const [selectedSubjectQuiz, setSelectedSubjectQuiz] = useState('');
    const [quizTotalMarks, setQuizTotalMarks] = useState('100');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/login/tutor');
            } else {
                setSession(session);
                fetchData(session.user.id);
            }
        });
    }, [id, navigate]);

    const fetchData = async (tutorId) => {
        setLoading(true);
        try {
            // 1. Fetch Student
            const { data: stData } = await supabase.from('students').select('*').eq('id', id).single();
            setStudent(stData);

            // 2. Fetch Subjects (global to tutor)
            const { data: subData } = await supabase.from('subjects').select('*').eq('tutor_id', tutorId);
            setSubjects(subData || []);

            // 3. Fetch Schedule for this student
            const { data: schedData } = await supabase.from('tuition_schedules').select('*').eq('student_id', id).single();
            if (schedData) {
                setSchedule(schedData);
                setDaysPerWeek(schedData.days_per_week);
                setScheduledTime(schedData.scheduled_time || '');
                setRescheduleDate(schedData.rescheduled_date || '');
                setRoutineDays(schedData.routine_days || []);
            }

            // 4. Fetch Pending Homework and Quizzes
            const { data: hwData } = await supabase.from('homeworks').select('*').eq('student_id', id).eq('status', 'pending');
            setPendingHw(hwData || []);

            const { data: qData } = await supabase.from('quizzes').select('*').eq('student_id', id).is('marks_obtained', null);
            setPendingQuizzes(qData || []);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSchedule = async (e) => {
        e.preventDefault();
        try {
            if (schedule) {
                const { error } = await supabase.from('tuition_schedules').update({
                    days_per_week: daysPerWeek,
                    scheduled_time: scheduledTime || null,
                    rescheduled_date: rescheduleDate || null,
                    routine_days: routineDays
                }).eq('id', schedule.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('tuition_schedules').insert({
                    tutor_id: session.user.id,
                    student_id: id,
                    days_per_week: daysPerWeek,
                    scheduled_time: scheduledTime || null,
                    rescheduled_date: rescheduleDate || null,
                    routine_days: routineDays
                });
                if (error) throw error;
            }
            alert('Schedule updated!');
            fetchData(session.user.id);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!newSubject) return;
        try {
            const { error } = await supabase.from('subjects').insert({
                name: newSubject,
                tutor_id: session.user.id
            });
            if (error) throw error;
            setNewSubject('');
            fetchData(session.user.id);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAssignHW = async (e) => {
        e.preventDefault();
        if (!selectedSubjectHw || !hwDesc) return;
        try {
            const { error } = await supabase.from('homeworks').insert({
                subject_id: selectedSubjectHw,
                student_id: id,
                description: hwDesc,
                status: 'pending'
            });
            if (error) throw error;
            setHwDesc('');
            alert('Homework assigned!');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAssignQuiz = async (e) => {
        e.preventDefault();
        if (!selectedSubjectQuiz || !quizSyllabus || !quizTotalMarks) return;
        try {
            const { error } = await supabase.from('quizzes').insert({
                subject_id: selectedSubjectQuiz,
                student_id: id,
                syllabus: quizSyllabus,
                total_marks: parseInt(quizTotalMarks, 10)
            });
            if (error) throw error;
            setQuizSyllabus('');
            setQuizTotalMarks('100');
            alert('Quiz alert sent!');
            fetchData(session.user.id);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleGradeHw = async (hwId, status) => {
        try {
            const { error } = await supabase.from('homeworks').update({ status }).eq('id', hwId);
            if (error) throw error;
            fetchData(session.user.id);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleGradeQuiz = async (quiz, score) => {
        const total = quiz.total_marks || 100;
        if (score === '' || score < 0 || score > total) return alert(`Enter valid marks (0-${total})`);
        try {
            const { error } = await supabase.from('quizzes').update({ marks_obtained: parseInt(score, 10) }).eq('id', quiz.id);
            if (error) throw error;
            fetchData(session.user.id);
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading || !student) return <div className="mobile-container"><p style={{ marginTop: '40px', textAlign: 'center' }}>Loading...</p></div>;

    return (
        <div className="mobile-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <Link to="/tutor/dashboard" style={{ color: 'var(--c-text-primary)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h2 style={{ fontSize: '24px', margin: 0 }}>{student.name}</h2>
            </div>

            {/* Schedule Management */}
            <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="var(--c-accent-1)" /> Set Schedule
            </h3>
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
                <form onSubmit={handleUpdateSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ fontSize: '14px', color: 'var(--c-text-secondary)', marginBottom: '4px', display: 'block' }}>Days per Week</label>
                        <input type="number" min="1" max="7" className="glass-input" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: '14px', color: 'var(--c-text-secondary)', marginBottom: '4px', display: 'block' }}>Usual Time</label>
                        <input type="time" className="glass-input" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                    </div>
                    <div>
                        <label style={{ fontSize: '14px', color: 'var(--c-text-secondary)', marginBottom: '4px', display: 'block' }}>Reschedule Next Day (Alerts Student)</label>
                        <input type="date" className="glass-input" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} />
                    </div>

                    <div style={{ marginTop: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--c-text-secondary)', marginBottom: '8px', display: 'block' }}>Select Teaching Routine Days</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => setRoutineDays(prev => prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx])}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        border: '1px solid var(--c-accent-1)',
                                        background: routineDays.includes(idx) ? 'var(--c-accent-1)' : 'transparent',
                                        color: routineDays.includes(idx) ? '#fff' : 'var(--c-text-primary)',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="glass-button" style={{ marginTop: '8px' }}>Save Schedule</button>
                </form>

                {routineDays.length > 0 && (
                    <MiniCalendar routineDays={routineDays} rescheduledDate={rescheduleDate} />
                )}
            </div>

            {/* Subject Management (Global for Tutor but accessible here) */}
            <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Book size={18} color="var(--c-accent-1)" /> Add a Subject
            </h3>
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
                <form onSubmit={handleAddSubject} style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" placeholder="e.g. Mathematics" className="glass-input" required value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
                    <button type="submit" className="glass-button" style={{ width: 'auto' }}>Add</button>
                </form>
            </div>

            {subjects.length > 0 && (
                <>
                    {/* Homework Assignment */}
                    <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PenTool size={18} color="var(--c-accent-1)" /> Assign Homework
                    </h3>
                    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
                        <form onSubmit={handleAssignHW} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <select className="glass-input" style={{ appearance: 'none' }} required value={selectedSubjectHw} onChange={(e) => setSelectedSubjectHw(e.target.value)}>
                                <option value="">Select Subject</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <textarea placeholder="Write homework details..." className="glass-input" rows="3" required value={hwDesc} onChange={(e) => setHwDesc(e.target.value)}></textarea>
                            <button type="submit" className="glass-button">Send to Student</button>
                        </form>
                    </div>

                    {/* Quiz Alerts */}
                    <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} color="var(--c-accent-1)" /> Add Quiz Alert
                    </h3>
                    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
                        <form onSubmit={handleAssignQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <select className="glass-input" style={{ appearance: 'none' }} required value={selectedSubjectQuiz} onChange={(e) => setSelectedSubjectQuiz(e.target.value)}>
                                <option value="">Select Subject</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <input type="number" placeholder="Total Marks (e.g. 100)" className="glass-input" required value={quizTotalMarks} onChange={(e) => setQuizTotalMarks(e.target.value)} min="1" />
                            <textarea placeholder="Write quiz syllabus..." className="glass-input" rows="2" required value={quizSyllabus} onChange={(e) => setQuizSyllabus(e.target.value)}></textarea>
                            <button type="submit" className="glass-button">Alert Student</button>
                        </form>
                    </div>

                    {/* Pending Grading Section */}
                    {(pendingHw.length > 0 || pendingQuizzes.length > 0) && (
                        <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Grade Pending Work
                        </h3>
                    )}

                    {pendingHw.map(hw => (
                        <div key={hw.id} className="glass-panel" style={{ padding: '16px', marginBottom: '12px' }}>
                            <p style={{ margin: '0 0 12px 0', fontSize: '15px' }}><strong>HW:</strong> {hw.description}</p>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button className="glass-button" style={{ flex: 1, padding: '8px', fontSize: '12px', background: '#4caf50' }} onClick={() => handleGradeHw(hw.id, 'complete')}>Done</button>
                                <button className="glass-button" style={{ flex: 1, padding: '8px', fontSize: '12px', background: '#ffb347' }} onClick={() => handleGradeHw(hw.id, 'partially_complete')}>Partial</button>
                                <button className="glass-button" style={{ flex: 1, padding: '8px', fontSize: '12px', background: '#ff6b6b' }} onClick={() => handleGradeHw(hw.id, 'incomplete')}>None</button>
                            </div>
                        </div>
                    ))}

                    {pendingQuizzes.map(quiz => (
                        <div key={quiz.id} className="glass-panel" style={{ padding: '16px', marginBottom: '24px' }}>
                            <p style={{ margin: '0 0 12px 0', fontSize: '15px' }}><strong>Quiz:</strong> {quiz.syllabus}</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="number" id={`quiz-${quiz.id}`} className="glass-input" placeholder={`Marks / ${quiz.total_marks || 100}`} style={{ flex: 2, padding: '8px' }} max={quiz.total_marks || 100} />
                                <button className="glass-button" style={{ flex: 1, padding: '8px', fontSize: '14px' }} onClick={(e) => {
                                    const val = document.getElementById(`quiz-${quiz.id}`).value;
                                    handleGradeQuiz(quiz, val);
                                }}>Save</button>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Links */}
            <div style={{ paddingBottom: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="glass-button" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => navigate(`/tutor/students/${id}/history`)}>
                    View Graded History
                </button>
                <button className="glass-button" onClick={() => navigate(`/tutor/students/${id}/performance`)}>
                    View Student Analytics
                </button>
            </div>
        </div>
    );
}
