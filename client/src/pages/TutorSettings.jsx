import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save, User } from 'lucide-react';

export default function TutorSettings() {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/login/tutor');
            } else {
                setSession(session);
                fetchTutorInfo(session.user.id, session.user.email);
            }
        });
    }, [navigate]);

    const fetchTutorInfo = async (tutorId, tutorEmail) => {
        try {
            setLoading(true);
            setEmail(tutorEmail || '');

            const { data, error } = await supabase
                .from('tutors')
                .select('name, phone_number')
                .eq('id', tutorId)
                .single();

            if (error) throw error;

            if (data) {
                setName(data.name || '');
                setPhoneNumber(data.phone_number || '');
            }
        } catch (err) {
            console.error('Error fetching tutor info:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim() || !phoneNumber.trim()) {
            setMessage('Name and phone number cannot be empty.');
            return;
        }

        setSaving(true);
        setMessage('');

        try {
            const { error } = await supabase
                .from('tutors')
                .update({ name: name, phone_number: phoneNumber })
                .eq('id', session.user.id);

            if (error) throw error;
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error updating profile: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="mobile-container"><p style={{ textAlign: 'center', marginTop: '40px' }}>Loading Settings...</p></div>;
    }

    return (
        <div className="mobile-container">
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
                <Link to="/tutor/dashboard" style={{ color: 'var(--c-text-primary)' }}>
                    <ArrowLeft size={24} />
                </Link>
                <h2 style={{ fontSize: '24px', margin: 0, display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <User color="var(--c-accent-1)" size={24} /> Settings
                </h2>
            </header>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                    Profile Information
                </h3>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', color: 'var(--c-text-secondary)', marginBottom: '8px' }}>Email (Cannot be changed)</label>
                        <input
                            type="email"
                            value={email}
                            className="glass-input"
                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            disabled
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', color: 'var(--c-text-secondary)', marginBottom: '8px' }}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="glass-input"
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', color: 'var(--c-text-secondary)', marginBottom: '8px' }}>Phone Number</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="glass-input"
                            required
                        />
                    </div>

                    {message && (
                        <p style={{
                            fontSize: '14px',
                            textAlign: 'center',
                            color: message.includes('Error') || message.includes('cannot') ? '#ff6b6b' : '#4caf50',
                            margin: '4px 0'
                        }}>
                            {message}
                        </p>
                    )}

                    <button type="submit" className="glass-button" disabled={saving} style={{ marginTop: '8px' }}>
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
