import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Users, UserPlus, LogOut, Copy, Check, Trash2, Edit2 } from 'lucide-react';

export default function TutorDashboard() {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // New student form state
    const [newStudentName, setNewStudentName] = useState('');
    const [addingStudent, setAddingStudent] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/login/tutor');
            } else {
                setSession(session);
                fetchStudents(session.user.id);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/login/tutor');
            } else {
                setSession(session);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const fetchStudents = async (tutorId) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('tutor_id', tutorId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setStudents(data || []);
        } catch (err) {
            console.error('Error fetching students:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!newStudentName.trim() || !session) return;

        setAddingStudent(true);
        try {
            const { data, error } = await supabase
                .from('students')
                .insert([{
                    name: newStudentName,
                    tutor_id: session.user.id
                    // unique_code is generated automatically by PostgreSQL default value
                }])
                .select()
                .single();

            if (error) throw error;

            setStudents([data, ...students]);
            setNewStudentName('');
        } catch (err) {
            alert('Error adding student: ' + err.message);
        } finally {
            setAddingStudent(false);
        }
    };

    const handleCopyCode = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm("Are you sure you want to completely delete this student? This action cannot be undone.")) return;
        try {
            // Delete related rows first to satisfy foreign key constraints
            await supabase.from('tuition_schedules').delete().eq('student_id', studentId);
            await supabase.from('homeworks').delete().eq('student_id', studentId);
            await supabase.from('quizzes').delete().eq('student_id', studentId);

            const { error } = await supabase.from('students').delete().eq('id', studentId);
            if (error) throw error;
            fetchStudents(session.user.id);
        } catch (err) {
            alert('Failed to delete student: ' + err.message);
        }
    };

    const handleUpdateStudent = async (studentId) => {
        if (!editName.trim()) return;
        try {
            const { error } = await supabase.from('students').update({ name: editName }).eq('id', studentId);
            if (error) throw error;
            setEditingId(null);
            fetchStudents(session.user.id);
        } catch (err) {
            alert('Failed to update student: ' + err.message);
        }
    };

    if (loading) {
        return <div className="mobile-container"><p style={{ textAlign: 'center', marginTop: '40px' }}>Loading Dashboard...</p></div>;
    }

    return (
        <div className="mobile-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', margin: 0 }}>Dashboard</h2>
                <button
                    onClick={handleLogout}
                    style={{ background: 'transparent', border: 'none', color: 'var(--c-text-secondary)', cursor: 'pointer' }}
                >
                    <LogOut size={24} />
                </button>
            </header>

            {/* Add Student floating card */}
            <div className="glass-card" style={{ marginBottom: '24px', padding: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '18px' }}>
                    <UserPlus size={20} color="var(--c-accent-1)" />
                    Add New Student
                </h3>
                <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Student Name"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="glass-input"
                        style={{ flex: 1, padding: '12px' }}
                        required
                    />
                    <button type="submit" className="glass-button" style={{ width: 'auto', padding: '12px 20px' }} disabled={addingStudent}>
                        {addingStudent ? '...' : 'Add'}
                    </button>
                </form>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Users size={20} color="var(--c-text-secondary)" />
                <h3 style={{ fontSize: '18px', color: 'var(--c-text-secondary)', margin: 0 }}>My Students ({students.length})</h3>
            </div>

            {students.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ color: 'var(--c-text-secondary)' }}>You haven't added any students yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '80px' }}>
                    {students.map(student => (
                        <div key={student.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ flex: 1, marginRight: '16px' }}>
                                {editingId === student.id ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="glass-input"
                                            style={{ padding: '8px', width: '100%', fontSize: '14px' }}
                                            autoFocus
                                        />
                                        <button onClick={() => handleUpdateStudent(student.id)} style={{ background: 'var(--c-accent-1)', border: 'none', borderRadius: '4px', padding: '8px', color: 'white', cursor: 'pointer' }}>
                                            <Check size={16} />
                                        </button>
                                        <button onClick={() => setEditingId(null)} style={{ background: '#333', border: 'none', borderRadius: '4px', padding: '8px', color: 'white', cursor: 'pointer' }}>
                                            X
                                        </button>
                                    </div>
                                ) : (
                                    <h4
                                        style={{ fontSize: '18px', margin: '0 0 4px 0', color: 'var(--c-text-primary)', cursor: 'pointer' }}
                                        onClick={() => navigate(`/tutor/students/${student.id}`)}
                                    >
                                        {student.name}
                                    </h4>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => navigate(`/tutor/students/${student.id}`)}>
                                    <span style={{ fontSize: '12px', color: 'var(--c-text-secondary)' }}>Login Code:</span>
                                    <span style={{
                                        fontFamily: 'monospace',
                                        background: 'rgba(0,0,0,0.3)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        color: 'var(--c-accent-1)',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px'
                                    }}>
                                        {student.unique_code}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                                <button
                                    onClick={() => handleCopyCode(student.unique_code, student.id)}
                                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: copiedId === student.id ? '#4caf50' : 'var(--c-text-primary)' }}
                                    title="Copy Login Code"
                                >
                                    {copiedId === student.id ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                                <button
                                    onClick={() => { setEditingId(student.id); setEditName(student.name); }}
                                    style={{ background: 'rgba(255,179,71,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ffb347' }}
                                    title="Edit Student Name"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteStudent(student.id)}
                                    style={{ background: 'rgba(255,107,107,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff6b6b' }}
                                    title="Delete Student"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
