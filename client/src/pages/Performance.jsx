import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function Performance() {
    const { id } = useParams(); // Will be present if Tutor is viewing
    const navigate = useNavigate();
    const location = useLocation();
    const isTutor = location.pathname.includes('/tutor/');

    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState('');

    const [radarData, setRadarData] = useState([]);
    const [quizData, setQuizData] = useState([]);
    const [hwData, setHwData] = useState([]);

    useEffect(() => {
        // Determine student ID and load data
        let studentIdToLoad = id;
        if (!isTutor) {
            studentIdToLoad = localStorage.getItem('pora_student_id');
            setStudentName(localStorage.getItem('pora_student_name') || 'Student');
        }

        if (!studentIdToLoad) {
            navigate(isTutor ? '/tutor/dashboard' : '/login/student');
            return;
        }

        fetchAnalytics(studentIdToLoad);
    }, [id, isTutor, navigate]);

    const fetchAnalytics = async (sId) => {
        setLoading(true);
        try {
            if (isTutor) {
                const { data: sData } = await supabase.from('students').select('name').eq('id', sId).single();
                if (sData) setStudentName(sData.name);
            }

            // Fetch all Subjects for mapping
            const { data: subData } = await supabase.from('subjects').select('*');
            const subMap = {};
            subData?.forEach(s => subMap[s.id] = s.name);

            // Fetch Quizzes (for Radar and Line charts)
            const { data: quizzes } = await supabase.from('quizzes').select('*').eq('student_id', sId).not('marks_obtained', 'is', null).order('created_at', { ascending: true });

            // Fetch Homeworks (for Smooth Line chart)
            const { data: homeworks } = await supabase.from('homeworks').select('*').eq('student_id', sId).neq('status', 'pending').order('created_at', { ascending: true });

            // --- Processing Data for Charts ---

            // 1. Radar Data (Average quiz marks per subject)
            const subScores = {};
            quizzes?.forEach(q => {
                if (!subScores[q.subject_id]) subScores[q.subject_id] = { totalPercentage: 0, count: 0 };
                const total = q.total_marks || 100;
                const obtained = q.marks_obtained || 0;
                subScores[q.subject_id].totalPercentage += (obtained / total) * 100;
                subScores[q.subject_id].count += 1;
            });

            const rData = Object.keys(subScores).map(subId => ({
                subject: subMap[subId] ? subMap[subId].substring(0, 3).toUpperCase() : 'UNK',
                score: Math.round(subScores[subId].totalPercentage / subScores[subId].count),
                fullMark: 100
            }));
            setRadarData(rData.length ? rData : [{ subject: 'N/A', score: 0, fullMark: 100 }]);

            // 2. Quiz Line Chart (Timeline of all quizzes)
            const qData = quizzes?.map((q, idx) => {
                const total = q.total_marks || 100;
                const obtained = q.marks_obtained || 0;
                return {
                    quizNum: `Q${idx + 1}`,
                    score: Math.round((obtained / total) * 100),
                    subject: subMap[q.subject_id] || 'Unknown'
                };
            }) || [];
            setQuizData(qData);

            // 3. Daily Homework Performance (Mapping status to numeric)
            // completed = 100, partially_complete = 50, incomplete = 0
            const hwMap = { 'complete': 100, 'partially_complete': 50, 'incomplete': 0 };
            const hData = homeworks?.map((hw, idx) => ({
                day: `HW${idx + 1}`,
                score: hwMap[hw.status] ?? 0
            })) || [];
            setHwData(hData);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'var(--c-dark-1)', border: '1px solid var(--glass-border)', padding: '8px 12px', borderRadius: '8px', color: 'white' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ margin: 0, color: entry.color, fontSize: '14px' }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const backLink = isTutor ? `/tutor/students/${id}` : '/student/dashboard';

    if (loading) return <div className="mobile-container"><p style={{ marginTop: '40px', textAlign: 'center' }}>Loading Performance...</p></div>;

    return (
        <div className="mobile-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <Link to={backLink} style={{ color: 'var(--c-text-primary)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h2 style={{ fontSize: '24px', margin: 0 }}>
                    {isTutor ? `${studentName}'s` : 'My'} Performance
                </h2>
            </div>

            {/* 1. Bar Chart (Performance Overview) */}
            <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="var(--c-accent-1)" /> Overall Subject Strength
            </h3>
            <div className="glass-panel" style={{ padding: '16px 16px 16px 0', marginBottom: '24px', height: '250px' }}>
                {radarData.length > 0 && radarData[0].subject !== 'N/A' ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={radarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="subject" stroke="var(--c-text-secondary)" tick={{ fontSize: 12 }} />
                            <YAxis stroke="var(--c-text-secondary)" tick={{ fontSize: 12 }} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="score" name="Average %" fill="var(--c-accent-1)" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '16px' }}>
                        <p style={{ color: 'var(--c-text-secondary)', margin: 0, fontSize: '14px' }}>Not enough graded quizzes yet.</p>
                    </div>
                )}
            </div>

            {/* 2. Line Chart (Quiz Strength Timeline) */}
            <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#ffb347" /> Quiz Progress
            </h3>
            <div className="glass-panel" style={{ padding: '16px 16px 16px 0', marginBottom: '24px', height: '250px' }}>
                {quizData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={quizData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="quizNum" stroke="var(--c-text-secondary)" tick={{ fontSize: 12 }} />
                            <YAxis stroke="var(--c-text-secondary)" tick={{ fontSize: 12 }} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="score" name="Marks" stroke="#ffb347" strokeWidth={3} dot={{ r: 4, fill: '#ffb347', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '16px' }}>
                        <p style={{ color: 'var(--c-text-secondary)', margin: 0, fontSize: '14px' }}>No quiz data recorded.</p>
                    </div>
                )}
            </div>

            {/* 3. Smooth Area Chart (Daily Homework Performance) */}
            <h3 style={{ fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="#4caf50" /> Homework Consistency
            </h3>
            <div className="glass-panel" style={{ padding: '16px 16px 16px 0', marginBottom: '40px', height: '250px' }}>
                {hwData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={hwData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="day" stroke="var(--c-text-secondary)" tick={{ fontSize: 12 }} />
                            <YAxis stroke="var(--c-text-secondary)" tick={{ fontSize: 12 }} domain={[0, 100]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="score" name="HW Status" stroke="#4caf50" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '16px' }}>
                        <p style={{ color: 'var(--c-text-secondary)', margin: 0, fontSize: '14px' }}>No homework history available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
