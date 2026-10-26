import React from 'react';
import { Download, Database, FileSpreadsheet, ShieldCheck, AlertTriangle } from 'lucide-react';

export const AdminBackupsTab: React.FC = () => {
  const token = localStorage.getItem('dygytaly_admin_token') || '';

  const handleExportJson = () => {
    window.open(`/api/admin/backup/export?token=${encodeURIComponent(token)}`, '_blank');
  };

  const handleExportEnquiries = () => {
    window.open(`/api/admin/export/enquiries?token=${encodeURIComponent(token)}`, '_blank');
  };

  const handleExportApplications = () => {
    window.open(`/api/admin/export/applications?token=${encodeURIComponent(token)}`, '_blank');
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Backups, Export & Recovery</h1>
        <p style={{ color: '#646970', fontSize: '0.9rem' }}>
          One-click downloads of complete database snapshots, customer leads, and career candidate records.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Full DB JSON */}
        <div className="admin-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(34, 113, 177, 0.1)', color: '#2271b1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#1d2327', margin: 0 }}>Full Database Export</h3>
              <span style={{ fontSize: '0.78rem', color: '#8c8f94' }}>Complete JSON structure</span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#50575e', lineHeight: 1.6, marginBottom: '20px' }}>
            Exports all pages, sections, services, case studies, founder chapters, team profiles, reviews, and settings into a single structured JSON archive.
          </p>
          <button onClick={handleExportJson} className="wp-btn wp-btn-primary" style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
            <Download size={16} /> Download Full JSON Archive
          </button>
        </div>

        {/* Enquiries CSV */}
        <div className="admin-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(0, 163, 42, 0.1)', color: '#00a32a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#1d2327', margin: 0 }}>Contact Enquiries CSV</h3>
              <span style={{ fontSize: '0.78rem', color: '#8c8f94' }}>CRM Spreadsheet export</span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#50575e', lineHeight: 1.6, marginBottom: '20px' }}>
            Export all incoming prospect enquiries, phone numbers, email addresses, and notes directly into Excel or Google Sheets format.
          </p>
          <button onClick={handleExportEnquiries} className="wp-btn wp-btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
            <Download size={16} /> Export Enquiries (CSV)
          </button>
        </div>

        {/* Applications CSV */}
        <div className="admin-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(241, 138, 85, 0.15)', color: 'var(--color-tangerine)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#1d2327', margin: 0 }}>Candidate Applications CSV</h3>
              <span style={{ fontSize: '0.78rem', color: '#8c8f94' }}>Recruitment spreadsheet</span>
            </div>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#50575e', lineHeight: 1.6, marginBottom: '20px' }}>
            Export job applicant submissions, role titles, contact numbers, experience levels, and resume links for the hiring team.
          </p>
          <button onClick={handleExportApplications} className="wp-btn wp-btn-secondary" style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
            <Download size={16} /> Export Applications (CSV)
          </button>
        </div>
      </div>

      {/* Database File & Recovery Guide */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 style={{ fontSize: '1.1rem', color: '#1d2327' }}>Physical Database & Recovery Instructions</h3>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#50575e', lineHeight: 1.7 }}>
          <p style={{ marginBottom: '12px' }}>
            <strong>1. Physical Database Location:</strong><br />
            The real persistent SQLite database is located at <code>data/dygytaly.db</code>. Backing up this single file or copying it across servers preserves 100% of the website configuration and records.
          </p>
          <p style={{ marginBottom: '12px' }}>
            <strong>2. Uploaded Media & Resumes:</strong><br />
            Uploaded media and resumes are stored in <code>public/uploads/</code>. Include this folder in your routine periodic backup archives.
          </p>
          <p style={{ margin: 0 }}>
            <strong>3. System Re-seeding:</strong><br />
            To reset or re-seed the authentic initial dataset at any time, run <code>npm run seed</code> in your terminal.
          </p>
        </div>
      </div>
    </div>
  );
};
