import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
}

export const AdminLogin: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }

      localStorage.setItem('dygytaly_admin_token', data.token);
      localStorage.setItem('dygytaly_admin_user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f1',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        background: '#ffffff',
        border: '1px solid #c3c4c7',
        borderRadius: '6px',
        padding: '36px 32px',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/">
            <img
              src="/uploads/dygytaly-logo.png"
              alt="Dygytaly Digital Marketing Agency"
              style={{ height: '48px', margin: '0 auto 14px auto', objectFit: 'contain' }}
            />
          </Link>
          <h2 style={{ fontSize: '1.35rem', color: '#1d2327', fontWeight: 600 }}>
            Dygytaly Admin CMS
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#646970', marginTop: '4px' }}>
            WordPress-Style Content Management Portal
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px 14px',
            background: 'rgba(214, 54, 56, 0.08)',
            borderLeft: '4px solid #d63638',
            color: '#b32d2e',
            fontSize: '0.88rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#1d2327', marginBottom: '6px' }}>
              Username or Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #8c8f94',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1d2327' }}>
                Password
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #8c8f94',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="wp-btn wp-btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Log In to Admin Dashboard'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid #f0f0f1', marginTop: '24px', paddingTop: '16px', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#2271b1', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Back to Dygytaly Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
