import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, CheckSquare } from 'lucide-react';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Look for the recovery token in the URL and wait for Supabase to establish the session.
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session) {
                setSessionReady(true);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
                setSessionReady(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            return setError('Password must be at least 6 characters long.');
        }
        if (password !== confirmPassword) {
            return setError('Passwords do not match.');
        }

        if (!sessionReady) {
            return setError('Authentication session not ready yet. Please ensure you accessed this page from the reset email link.');
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({ password: password });

            if (error) throw error;
            setSuccess(true);
            setTimeout(() => {
                navigate('/tutor/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mobile-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <div className="glass-card">
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(0, 100, 148, 0.2)', marginBottom: '16px' }}>
                            <Lock size={32} color="var(--c-accent-1)" />
                        </div>
                        <h2 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Reset Password</h2>
                        <p style={{ color: 'var(--c-text-secondary)', fontSize: '14px', margin: 0 }}>
                            Please enter your new password below.
                        </p>
                    </div>

                    {success ? (
                        <div style={{ textAlign: 'center', padding: '24px 0' }}>
                            <CheckSquare size={48} color="#4caf50" style={{ marginBottom: '16px' }} />
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Success!</h3>
                            <p style={{ color: 'var(--c-text-secondary)', fontSize: '14px' }}>
                                Your password has been successfully updated. Redirecting to your dashboard...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="glass-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className="glass-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            {error && <p style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center', margin: 0 }}>{error}</p>}
                            {!sessionReady && <p style={{ color: '#ffb347', fontSize: '12px', textAlign: 'center', margin: 0 }}>Waiting for secure session...</p>}

                            <button type="submit" className="glass-button" disabled={loading || !sessionReady} style={{ marginTop: '8px', opacity: sessionReady ? 1 : 0.6 }}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
