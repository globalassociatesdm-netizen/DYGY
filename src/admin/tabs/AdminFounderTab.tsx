import React, { useState, useEffect } from 'react';
import { Save, Check, User, Plus, Trash2 } from 'lucide-react';

export const AdminFounderTab: React.FC = () => {
  const [founder, setFounder] = useState<any>(null);
  const [storyPoints, setStoryPoints] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('dygytaly_admin_token');

  useEffect(() => {
    fetch('/api/founder')
      .then(res => res.json())
      .then(data => {
        setFounder(data);
        setStoryPoints(data.story_points || []);
      })
      .catch(() => {});
  }, []);

  const handleUpdateStoryPoint = (index: number, field: string, val: string) => {
    const updated = [...storyPoints];
    updated[index] = { ...updated[index], [field]: val };
    setStoryPoints(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const payload = {
      ...founder,
      story_points: storyPoints
    };

    try {
      const res = await fetch('/api/admin/founder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setMsg('Founder profile and 7 story chapters saved successfully!');
        setTimeout(() => setMsg(''), 4000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!founder) {
    return <div>Loading founder profile...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Founder Story & Profile</h1>
        <p style={{ color: '#646970', fontSize: '0.9rem' }}>
          Manage the portrait-led founder storytelling experience and the 7 milestone principles on the public site.
        </p>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', background: 'rgba(0,163,42,0.1)', color: '#00661a', borderRadius: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} /> {msg}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Core Profile Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '1.15rem', color: '#1d2327' }}>Core Leadership Details</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Founder Full Name *
              </label>
              <input
                type="text"
                required
                value={founder.name || ''}
                onChange={(e) => setFounder({ ...founder, name: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Official Designation *
              </label>
              <input
                type="text"
                required
                value={founder.designation || ''}
                onChange={(e) => setFounder({ ...founder, designation: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Portrait Asset Path
              </label>
              <input
                type="text"
                value={founder.portrait_url || ''}
                onChange={(e) => setFounder({ ...founder, portrait_url: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Short Bio (Homepage Card)
            </label>
            <textarea
              rows={2}
              value={founder.bio || ''}
              onChange={(e) => setFounder({ ...founder, bio: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Full Biography (Founder Page Editorial)
            </label>
            <textarea
              rows={4}
              value={founder.full_bio || ''}
              onChange={(e) => setFounder({ ...founder, full_bio: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Featured Guiding Quote
            </label>
            <input
              type="text"
              value={founder.quote || ''}
              onChange={(e) => setFounder({ ...founder, quote: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* 7 Animated Story Points */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#1d2327' }}>
                The 7 Milestone Story Points
              </h3>
              <p style={{ color: '#646970', fontSize: '0.85rem', margin: 0 }}>
                Displayed sequentially in the scroll-linked founder section and profile page.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {storyPoints.map((sp, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  background: '#f6f7f7',
                  borderRadius: '4px',
                  border: '1px solid #e2e4e7'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-tangerine)', fontSize: '0.9rem' }}>
                    Chapter #{sp.number || String(idx + 1).padStart(2, '0')}
                  </span>
                  <input
                    type="text"
                    value={sp.title}
                    onChange={(e) => handleUpdateStoryPoint(idx, 'title', e.target.value)}
                    style={{ flexGrow: 1, padding: '7px 10px', border: '1px solid #ccd0d4', borderRadius: '3px', fontWeight: 600 }}
                  />
                </div>
                <div>
                  <textarea
                    rows={2}
                    value={sp.quote}
                    onChange={(e) => handleUpdateStoryPoint(idx, 'quote', e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccd0d4', borderRadius: '3px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="wp-btn wp-btn-primary"
          style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save & Publish Founder Profile'}
        </button>
      </form>
    </div>
  );
};
