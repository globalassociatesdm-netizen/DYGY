import React, { useState, useEffect } from 'react';
import { Inbox, UserPlus, Briefcase, FolderGit2, Star, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface TabProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboardTab: React.FC<TabProps> = ({ setActiveTab }) => {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const token = localStorage.getItem('dygytaly_admin_token');

  useEffect(() => {
    if (token) {
      fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(() => {});

      fetch('/api/admin/activity', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setActivities(data.slice(0, 8)))
        .catch(() => {});
    }
  }, [token]);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Dashboard</h1>
        <p style={{ color: '#646970', fontSize: '0.9rem' }}>
          Welcome back to Dygytaly agency central command. Here is an overview of leads, applications, and website content.
        </p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Enquiries Card */}
        <div className="admin-card" style={{ padding: '20px', margin: 0, borderLeft: '4px solid #d63638' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#646970' }}>New Contact Leads</span>
            <Inbox size={20} color="#d63638" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1d2327' }}>
            {stats?.enquiries?.new || 0}
            <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#646970', marginLeft: '6px' }}>
              / {stats?.enquiries?.total || 0} total
            </span>
          </div>
          <button
            onClick={() => setActiveTab('enquiries')}
            className="wp-btn wp-btn-secondary"
            style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
          >
            Manage Enquiries →
          </button>
        </div>

        {/* Applications Card */}
        <div className="admin-card" style={{ padding: '20px', margin: 0, borderLeft: '4px solid #2271b1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#646970' }}>Job Applications</span>
            <UserPlus size={20} color="#2271b1" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1d2327' }}>
            {stats?.applications?.new || 0}
            <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#646970', marginLeft: '6px' }}>
              / {stats?.applications?.total || 0} total
            </span>
          </div>
          <button
            onClick={() => setActiveTab('applications')}
            className="wp-btn wp-btn-secondary"
            style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
          >
            Review Candidates →
          </button>
        </div>

        {/* Services Count */}
        <div className="admin-card" style={{ padding: '20px', margin: 0, borderLeft: '4px solid #00a32a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#646970' }}>Published Services</span>
            <Briefcase size={20} color="#00a32a" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1d2327' }}>
            {stats?.services || 10}
            <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#646970', marginLeft: '6px' }}>solutions</span>
          </div>
          <button
            onClick={() => setActiveTab('services')}
            className="wp-btn wp-btn-secondary"
            style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
          >
            Manage Services →
          </button>
        </div>

        {/* Portfolio Count */}
        <div className="admin-card" style={{ padding: '20px', margin: 0, borderLeft: '4px solid #f18a55' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#646970' }}>Verified Case Studies</span>
            <FolderGit2 size={20} color="#f18a55" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1d2327' }}>
            {stats?.portfolio || 4}
            <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#646970', marginLeft: '6px' }}>projects</span>
          </div>
          <button
            onClick={() => setActiveTab('portfolio')}
            className="wp-btn wp-btn-secondary"
            style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
          >
            Manage Case Studies →
          </button>
        </div>
      </div>

      {/* Two Column Grid: Quick Launch & Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Quick Launch & Content Tasks */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '1.1rem', color: '#1d2327' }}>Quick Content Actions</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <button
              onClick={() => setActiveTab('homepage-builder')}
              className="wp-btn wp-btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', gap: '10px' }}
            >
              <span>🎨 Edit Homepage Sections</span>
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className="wp-btn wp-btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', gap: '10px' }}
            >
              <span>📄 Update Page Copy & SEO</span>
            </button>
            <button
              onClick={() => setActiveTab('founder')}
              className="wp-btn wp-btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', gap: '10px' }}
            >
              <span>👤 Edit Founder Story Points</span>
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className="wp-btn wp-btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', gap: '10px' }}
            >
              <span>🖼️ Upload Media & Logos</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="wp-btn wp-btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', gap: '10px' }}
            >
              <span>⚙️ Contact Details & Socials</span>
            </button>
            <button
              onClick={() => setActiveTab('backups')}
              className="wp-btn wp-btn-secondary"
              style={{ padding: '14px', justifyContent: 'flex-start', gap: '10px' }}
            >
              <span>💾 Download Full Database Backup</span>
            </button>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', background: '#f6f7f7', borderRadius: '4px', borderLeft: '4px solid #2271b1' }}>
            <h4 style={{ fontSize: '0.92rem', color: '#1d2327', marginBottom: '6px' }}>Real SQLite Persistence</h4>
            <p style={{ fontSize: '0.85rem', color: '#646970', margin: 0, lineHeight: 1.5 }}>
              All edits performed in this panel update the real database file <code>data/dygytaly.db</code>. Changes are instantaneously reflected on the public website with zero hardcoded mock delays.
            </p>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '1.1rem', color: '#1d2327' }}>Recent Activity Log</h3>
          </div>
          {activities.length === 0 ? (
            <p style={{ color: '#8c8f94', fontSize: '0.88rem' }}>No recent activity recorded yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activities.map((act) => (
                <li key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', borderBottom: '1px solid #f0f0f1', paddingBottom: '10px' }}>
                  <Clock size={16} color="#8c8f94" style={{ marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600, color: '#1d2327' }}>
                      {act.action} <span style={{ fontWeight: 400, color: '#8c8f94' }}>({act.entity})</span>
                    </div>
                    <div style={{ color: '#50575e', fontSize: '0.82rem' }}>{act.details}</div>
                    <div style={{ color: '#8c8f94', fontSize: '0.75rem', marginTop: '2px' }}>
                      {new Date(act.created_at).toLocaleTimeString()} by {act.username}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
