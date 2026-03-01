import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Clock, Edit3, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function HistoryPage() {
    const { id } = useParams(); // Only exists if tutor is viewing a specific student
    const navigate = useNavigate();
    const location = useLocation();
    const isTutor = location.pathname.includes('/tutor/');

    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState('');

    const [historyHw, setHistoryHw] = useState([]);
    const [historyQuizzes, setHistoryQuizzes] = useState([]);
    const [subjectsMap, setSubjectsMap] = useState({});
    const [activeTab, setActiveTab] = useState('homework'); // 'homework' or 'quizzes'

    useEffect(() => {
        let studentIdToLoad = id;
        if (!isTutor) {
            studentIdToLoad = localStorage.getItem('pora_student_id');
            setStudentName(localStorage.getItem('pora_student_name') || 'Student');
        }

        if (!studentIdToLoad) {
            navigate(isTutor ? '/tutor/dashboard' : '/login/student');
            return;
        }

        fetchHistory(studentIdToLoad);
    }, [id, isTutor, navigate]);

    const fetchHistory = async (sId) => {
        setLoading(true);
        try {
            if (isTutor) {
                const { data: sData } = await supabase.from('students').select('name').eq('id', sId).single();
                if (sData) setStudentName(sData.name);
            }

            // Fetch Subject Names mapping
            const { data: subData } = await supabase.from('subjects').select('*');
            const subMap = {};
            subData?.forEach(s => subMap[s.id] = s.name);
            setSubjectsMap(subMap);

            // Fetch completed homework (not pending)
            const { data: hwData } = await supabase.from('homeworks')
                .select('*')
                .eq('student_id', sId)
                .neq('status', 'pending')
                .order('created_at', { ascending: false });
            setHistoryHw(hwData || []);

            // Fetch graded quizzes (marks not null)
            const { data: qData } = await supabase.from('quizzes')
                .select('*')
                .eq('student_id', sId)
                .not('marks_obtained', 'is', null)
                .order('created_at', { ascending: false });
            setHistoryQuizzes(qData || []);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'complete': return <CheckCircle size={18} color="#4caf50" />;
            case 'partially_complete': return <AlertCircle size={18} color="#ffb347" />;
            case 'incomplete': return <XCircle size={18} color="#ff6b6b" />;
            default: return null;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'complete': return 'Complete';
            case 'partially_complete': return 'Partially Complete';
            case 'incomplete': return 'Incomplete';
            default: return status;
        }
    };

    const backLink = isTutor ? `/tutor/students/${id}` : '/student/dashboard';

    if (loading) return <div className="mobile-container"><p style={{ marginTop: '40px', textAlign: 'center' }}>Loading History...</p></div>;

    return (
        <div className="mobile-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <Link to={backLink} style={{ color: 'var(--c-text-primary)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h2 style={{ fontSize: '24px', margin: 0 }}>
                    {isTutor ? `${studentName}'s` : 'My'} History
                </h2>
            </div>

            {/* TABS */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <button
                    className="glass-button"
                    style={{ flex: 1, padding: '10px', background: activeTab === 'homework' ? 'rgba(0, 100, 148, 0.4)' : 'rgba(255,255,255,0.05)' }}
                    onClick={() => setActiveTab('homework')}
                >
                    <Edit3 size={18} /> Homework
                </button>
                <button
                    className="glass-button"
                    style={{ flex: 1, padding: '10px', background: activeTab === 'quizzes' ? 'rgba(0, 100, 148, 0.4)' : 'rgba(255,255,255,0.05)' }}
                    onClick={() => setActiveTab('quizzes')}
                >
                    <Clock size={18} /> Quizzes
                </button>
            </div>

            {/* CONTENT */}
            {activeTab === 'homework' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {historyHw.length === 0 ? (
                        <p style={{ color: 'var(--c-text-secondary)', textAlign: 'center', marginTop: '20px' }}>No homework history found.</p>
                    ) : (
                        historyHw.map(hw => (
                            <div key={hw.id} className="glass-panel" style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--c-accent-1)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        {subjectsMap[hw.subject_id] || 'Subject'}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--c-text-secondary)' }}>
                                        {getStatusIcon(hw.status)} {getStatusText(hw.status)}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '14px' }}>{hw.description}</p>
                                <p style={{ margin: '8px 0 0 0', fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>
                                    {new Date(hw.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'quizzes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {historyQuizzes.length === 0 ? (
                        <p style={{ color: 'var(--c-text-secondary)', textAlign: 'center', marginTop: '20px' }}>No quiz history found.</p>
                    ) : (
                        historyQuizzes.map(quiz => (
                            <div key={quiz.id} className="glass-panel" style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '12px', color: '#ffb347', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        {subjectsMap[quiz.subject_id] || 'Subject'}
                                    </span>
                                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>
                                        {quiz.marks_obtained} / {quiz.total_marks || 100}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-text-secondary)' }}>Syllabus: {quiz.syllabus}</p>
                                <p style={{ margin: '8px 0 0 0', fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>
                                    {new Date(quiz.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
