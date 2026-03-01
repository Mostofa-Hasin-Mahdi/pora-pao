import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { KeyRound, ArrowLeft } from 'lucide-react';

export default function StudentLogin() {
    const navigate = useNavigate();
    const [uniqueCode, setUniqueCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Find the student with this exact unique code
            const { data, error: dbError } = await supabase
                .from('students')
                .select('*')
                .eq('unique_code', uniqueCode)
                .single();

            if (dbError || !data) {
                throw new Error('Invalid code or student not found.');
            }

            // We found a student, since it's a custom DB auth system, we'll store
            // their id locally to handle their secure routing.
            localStorage.setItem('pora_student_id', data.id);
            localStorage.setItem('pora_student_name', data.name);
            localStorage.setItem('pora_tutor_id', data.tutor_id);

            navigate('/student/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mobile-container">
            <Link to="/" style={{ color: 'var(--c-text-primary)' }}>
                <ArrowLeft size={24} style={{ marginBottom: '20px' }} />
            </Link>

            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '28px' }}>
                    Student Access
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--c-text-secondary)', marginBottom: '32px' }}>
                    Enter the unique 6-character code provided by your tutor.
                </p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="text"
                        placeholder="Unique Code (e.g., a1b2c3)"
                        className="glass-input"
                        value={uniqueCode}
                        onChange={(e) => setUniqueCode(e.target.value)}
                        style={{ textAlign: 'center', letterSpacing: '2px', fontSize: '20px', textTransform: 'lowercase' }}
                        maxLength={6}
                        required
                    />

                    {error && <p style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="glass-button" disabled={loading} style={{ marginTop: '8px' }}>
                        <KeyRound size={20} />
                        {loading ? 'Verifying...' : 'Access Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}
