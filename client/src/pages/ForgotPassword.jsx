import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Automatically detect the environment URL (localhost or Vercel)
            const redirectUrl = `${window.location.origin}/reset-password`;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mobile-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <Link to="/login/tutor" style={{ color: 'var(--c-text-primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', textDecoration: 'none' }}>
                    <ArrowLeft size={20} /> Back to Login
                </Link>

                <div className="glass-card">
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(0, 100, 148, 0.2)', marginBottom: '16px' }}>
                            <Mail size={32} color="var(--c-accent-1)" />
                        </div>
                        <h2 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Forgot Password</h2>
                        <p style={{ color: 'var(--c-text-secondary)', fontSize: '14px', margin: 0 }}>
                            Enter your email address and we'll send you a link to securely reset your password.
                        </p>
                    </div>

                    {success ? (
                        <div style={{ textAlign: 'center', padding: '24px 0' }}>
                            <CheckCircle size={48} color="#4caf50" style={{ marginBottom: '16px' }} />
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Check your email</h3>
                            <p style={{ color: 'var(--c-text-secondary)', fontSize: '14px' }}>
                                We have sent a password reset link to <strong>{email}</strong>.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input
                                type="email"
                                placeholder="Your Email Address"
                                className="glass-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            {error && <p style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center', margin: 0 }}>{error}</p>}

                            <button type="submit" className="glass-button" disabled={loading} style={{ marginTop: '8px' }}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
