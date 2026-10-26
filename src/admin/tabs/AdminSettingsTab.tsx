import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';

export const AdminSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('dygytaly_admin_token');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setMsg('Global site settings updated successfully! Live website refreshed.');
        setTimeout(() => setMsg(''), 4000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Global Website Settings</h1>
        <p style={{ color: '#646970', fontSize: '0.9rem' }}>
          Configure agency brand information, verified contact numbers, WhatsApp credentials, and office location.
        </p>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', background: 'rgba(0,163,42,0.1)', color: '#00661a', borderRadius: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} /> {msg}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Company Identity */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '1.1rem', color: '#1d2327' }}>Brand & General Info</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Business / Legal Name
              </label>
              <input
                type="text"
                value={settings.business_name || ''}
                onChange={(e) => handleChange('business_name', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Official Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Logo URL (Client Original Asset)
              </label>
              <input
                type="text"
                value={settings.logo_url || ''}
                onChange={(e) => handleChange('logo_url', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Website Base URL
              </label>
              <input
                type="text"
                value={settings.website_url || ''}
                onChange={(e) => handleChange('website_url', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & Location */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '1.1rem', color: '#1d2327' }}>Contact Details & Location</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Verified Business Email
              </label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              Full Office Address (Coimbatore)
            </label>
            <textarea
              rows={2}
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Business Hours
              </label>
              <input
                type="text"
                value={settings.business_hours || ''}
                onChange={(e) => handleChange('business_hours', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Header CTA Button Text
              </label>
              <input
                type="text"
                value={settings.cta_button_text || "Let's Catch Up ☕"}
                onChange={(e) => handleChange('cta_button_text', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* Social Media & Google Business */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '1.1rem', color: '#1d2327' }}>Social Links & Google Business</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                LinkedIn URL
              </label>
              <input
                type="url"
                value={settings.linkedin_url || ''}
                onChange={(e) => handleChange('linkedin_url', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Verified Google Rating (e.g. 4.9)
              </label>
              <input
                type="text"
                value={settings.google_rating || '4.9'}
                onChange={(e) => handleChange('google_rating', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Verified Google Review Count (e.g. 117)
              </label>
              <input
                type="text"
                value={settings.google_review_count || '117'}
                onChange={(e) => handleChange('google_review_count', e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="wp-btn wp-btn-primary"
          style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          disabled={saving}
        >
          {saving ? 'Updating Settings...' : 'Save Global Settings'}
        </button>
      </form>
    </div>
  );
};
