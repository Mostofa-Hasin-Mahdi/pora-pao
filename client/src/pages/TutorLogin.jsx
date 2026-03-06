import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, ArrowLeft } from 'lucide-react';

export default function TutorLogin() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                // Sign IN
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (signInError) throw signInError;

                navigate('/tutor/dashboard');
            } else {
                // Sign UP
                const { data: authData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: name,
                            phone_number: phone
                        }
                    }
                });
                if (signUpError) throw signUpError;

                alert('Signup successful! Check your email to verify if required, or simply log in.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mobile-container" style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <Link to="/" style={{ color: 'var(--c-text-primary)' }}>
                        <ArrowLeft size={24} />
                    </Link>
                    <div style={{ flex: 1, textAlign: 'center', paddingRight: '24px' }}>
                        <h1 style={{ fontSize: '32px', margin: 0, textShadow: '0 0 20px rgba(0, 168, 232, 0.4)' }}>
                            Pora<span style={{ color: 'var(--c-accent-1)' }}>Pao</span>
                        </h1>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '28px' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--c-text-secondary)', marginBottom: '32px' }}>
                        {isLogin ? 'Login to your tutor dashboard.' : 'Sign up to manage your tuitions.'}
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {!isLogin && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="glass-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="glass-input"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </>
                        )}

                        <input
                            type="email"
                            placeholder="Email Address"
                            className="glass-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="glass-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {isLogin && (
                            <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                                <Link to="/forgot-password" style={{ color: 'var(--c-accent-1)', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>
                                    Forgot Password?
                                </Link>
                            </div>
                        )}

                        {error && <p style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

                        <button type="submit" className="glass-button" disabled={loading} style={{ marginTop: '8px' }}>
                            <LogIn size={20} />
                            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--c-text-secondary)' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span
                            onClick={() => { setIsLogin(!isLogin); setError(null); }}
                            style={{ color: 'var(--c-accent-1)', fontWeight: '600', cursor: 'pointer' }}
                        >
                            {isLogin ? 'Sign up here' : 'Login here'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
