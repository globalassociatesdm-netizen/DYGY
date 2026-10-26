import React, { useState, useEffect } from 'react';
import { Download, FileText, Trash2, CheckCircle2, User, Phone, Mail, ExternalLink } from 'lucide-react';

export const AdminApplicationsTab: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [status, setStatus] = useState('New');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('dygytaly_admin_token');

  const fetchApplications = () => {
    fetch('/api/admin/applications', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setApplications(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSelect = (app: any) => {
    setSelectedApp(app);
    setStatus(app.status || 'New');
    setNotes(app.notes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setSaving(true);
    const res = await fetch(`/api/admin/applications/${selectedApp.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, notes })
    });
    setSaving(false);
    if (res.ok) {
      setMsg('Candidate status and notes updated.');
      fetchApplications();
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this applicant record?')) return;
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchApplications();
      if (selectedApp?.id === id) setSelectedApp(null);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/admin/export/applications', '_blank');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Job Applications</h1>
          <p style={{ color: '#646970', fontSize: '0.9rem' }}>
            Review candidate submissions, access uploaded resumes, and track recruitment progress.
          </p>
        </div>
        <button onClick={handleExportCsv} className="wp-btn wp-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={15} /> Export Applications (CSV)
        </button>
      </div>

      {msg && (
        <div style={{ padding: '10px 14px', background: 'rgba(0,163,42,0.1)', color: '#00661a', borderRadius: '4px', marginBottom: '16px' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '1fr 380px' : '1fr', gap: '20px' }}>
        {/* Table */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applied Date</th>
                <th>Candidate Name</th>
                <th>Role Applied</th>
                <th>Experience</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#8c8f94' }}>
                    No job applications received yet.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => handleSelect(app)}
                    style={{
                      cursor: 'pointer',
                      background: selectedApp?.id === app.id ? '#f0f6fc' : undefined
                    }}
                  >
                    <td style={{ fontSize: '0.82rem', color: '#646970' }}>
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1d2327' }}>{app.full_name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#8c8f94' }}>{app.email}</div>
                    </td>
                    <td>
                      <span className="badge badge-lavender" style={{ fontSize: '0.75rem' }}>
                        {app.job_title}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#50575e' }}>
                      {app.experience || 'Not specified'}
                    </td>
                    <td>
                      <span className={`status-pill ${app.status === 'Hired' ? 'status-converted' : app.status === 'Shortlisted' ? 'status-contacted' : 'status-new'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="wp-btn wp-btn-danger"
                        style={{ padding: '3px 6px' }}
                        title="Delete application"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Candidate Inspector */}
        {selectedApp && (
          <div className="admin-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f0f0f1', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#1d2327', margin: 0 }}>Candidate Profile</h3>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c8f94' }}>
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1d2327' }}>{selectedApp.full_name}</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-tangerine)', fontWeight: 600 }}>{selectedApp.job_title}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', marginBottom: '18px', background: '#f6f7f7', padding: '12px', borderRadius: '4px' }}>
              <div><strong>Email:</strong> <a href={`mailto:${selectedApp.email}`} style={{ color: '#2271b1' }}>{selectedApp.email}</a></div>
              <div><strong>Phone:</strong> <a href={`tel:${selectedApp.phone}`} style={{ color: '#2271b1' }}>{selectedApp.phone}</a></div>
              <div><strong>Experience:</strong> {selectedApp.experience}</div>
              {selectedApp.portfolio_link && (
                <div>
                  <strong>Portfolio:</strong>{' '}
                  <a href={selectedApp.portfolio_link} target="_blank" rel="noopener noreferrer" style={{ color: '#2271b1', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    View Link <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            {selectedApp.resume_url && (
              <div style={{ marginBottom: '18px' }}>
                <a
                  href={selectedApp.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wp-btn wp-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', gap: '8px', padding: '10px' }}
                >
                  <FileText size={16} /> Open Uploaded Resume / CV
                </a>
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1d2327', marginBottom: '6px' }}>
                Applicant Introduction:
              </label>
              <div style={{ fontSize: '0.88rem', color: '#50575e', lineHeight: 1.6, background: '#fff', border: '1px solid #e2e4e7', padding: '10px', borderRadius: '4px' }}>
                {selectedApp.notes || 'No introduction note provided.'}
              </div>
            </div>

            {/* Recruiter Evaluation */}
            <div style={{ borderTop: '1px solid #f0f0f1', paddingTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1d2327', marginBottom: '6px' }}>
                Hiring Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', marginBottom: '12px' }}
              >
                <option value="New">New Application</option>
                <option value="Reviewing">Reviewing Portfolio</option>
                <option value="Shortlisted">Shortlisted for Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired / Offer Extended</option>
              </select>

              <button
                onClick={handleUpdateStatus}
                className="wp-btn wp-btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Update Application Status'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
