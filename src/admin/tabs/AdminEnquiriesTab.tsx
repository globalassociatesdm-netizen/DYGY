import React, { useState, useEffect } from 'react';
import { Download, Search, Trash2, CheckCircle2, MessageSquare, Phone, Mail } from 'lucide-react';

export const AdminEnquiriesTab: React.FC = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeEnquiry, setActiveEnquiry] = useState<any | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('dygytaly_admin_token');

  const fetchEnquiries = () => {
    let url = '/api/admin/enquiries?';
    if (statusFilter !== 'all') url += `status=${statusFilter}&`;
    if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setEnquiries(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, searchTerm]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      fetchEnquiries();
      if (activeEnquiry && activeEnquiry.id === id) {
        setActiveEnquiry({ ...activeEnquiry, status: newStatus });
      }
    }
  };

  const handleSaveNotes = async (id: number) => {
    setSavingNote(true);
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        status: activeEnquiry?.status || 'New',
        internal_notes: internalNote
      })
    });
    setSavingNote(false);
    if (res.ok) {
      setMsg('Internal follow-up note saved.');
      fetchEnquiries();
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this enquiry record?')) return;
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchEnquiries();
      if (activeEnquiry?.id === id) setActiveEnquiry(null);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/admin/export/enquiries', '_blank');
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'New': return 'status-new';
      case 'Contacted': return 'status-contacted';
      case 'Converted': return 'status-converted';
      default: return 'status-closed';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Contact Enquiries</h1>
          <p style={{ color: '#646970', fontSize: '0.9rem' }}>
            Coffee catch-up submissions, consultation requests, and inbound prospect leads.
          </p>
        </div>
        <button onClick={handleExportCsv} className="wp-btn wp-btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={15} /> Export Enquiries (CSV)
        </button>
      </div>

      {msg && (
        <div style={{ padding: '10px 14px', background: 'rgba(0,163,42,0.1)', color: '#00661a', borderRadius: '4px', marginBottom: '16px' }}>
          {msg}
        </div>
      )}

      {/* Filters Bar */}
      <div className="admin-card" style={{ padding: '14px 18px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1, minWidth: '220px' }}>
          <Search size={16} color="#8c8f94" />
          <input
            type="text"
            placeholder="Search by prospect name, email, company or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#646970', fontWeight: 600 }}>Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '6px 12px', border: '1px solid #8c8f94', borderRadius: '3px', fontSize: '0.85rem' }}
          >
            <option value="all">All Statuses ({enquiries.length})</option>
            <option value="New">New Only</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Grid: Table + Detail Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: activeEnquiry ? '1fr 380px' : '1fr', gap: '20px' }}>
        {/* Table */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name / Business</th>
                <th>Service of Interest</th>
                <th>Phone / Email</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#8c8f94' }}>
                    No enquiries match the current filter.
                  </td>
                </tr>
              ) : (
                enquiries.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => {
                      setActiveEnquiry(e);
                      setInternalNote(e.internal_notes || '');
                    }}
                    style={{
                      cursor: 'pointer',
                      background: activeEnquiry?.id === e.id ? '#f0f6fc' : undefined
                    }}
                  >
                    <td style={{ fontSize: '0.82rem', color: '#646970', whiteSpace: 'nowrap' }}>
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1d2327' }}>{e.full_name}</div>
                      {e.business_name && (
                        <div style={{ fontSize: '0.8rem', color: '#646970' }}>{e.business_name}</div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-sage" style={{ fontSize: '0.75rem' }}>
                        {e.service_of_interest}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div>{e.phone}</div>
                      <div style={{ color: '#8c8f94', fontSize: '0.78rem' }}>{e.email}</div>
                    </td>
                    <td>
                      <span className={`status-pill ${getStatusClass(e.status)}`}>
                        {e.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(ev) => ev.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <select
                          value={e.status}
                          onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                          style={{ padding: '3px 6px', fontSize: '0.75rem', borderRadius: '3px' }}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="wp-btn wp-btn-danger"
                          style={{ padding: '3px 6px' }}
                          title="Delete enquiry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right Detail Drawer */}
        {activeEnquiry && (
          <div className="admin-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f0f0f1', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#1d2327', margin: 0 }}>Enquiry Details</h3>
              <button onClick={() => setActiveEnquiry(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c8f94' }}>
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1d2327' }}>{activeEnquiry.full_name}</div>
              {activeEnquiry.business_name && (
                <div style={{ fontSize: '0.88rem', color: '#50575e' }}>{activeEnquiry.business_name}</div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', marginBottom: '18px', background: '#f6f7f7', padding: '12px', borderRadius: '4px' }}>
              <div><strong>Service:</strong> {activeEnquiry.service_of_interest}</div>
              <div><strong>Budget:</strong> {activeEnquiry.budget_range || 'Flexible'}</div>
              <div><strong>Preferred:</strong> {activeEnquiry.preferred_contact}</div>
              <div><strong>Phone:</strong> <a href={`tel:${activeEnquiry.phone}`} style={{ color: '#2271b1' }}>{activeEnquiry.phone}</a></div>
              <div><strong>Email:</strong> <a href={`mailto:${activeEnquiry.email}`} style={{ color: '#2271b1' }}>{activeEnquiry.email}</a></div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1d2327', marginBottom: '4px' }}>
                Client Project Message:
              </div>
              <div style={{ fontSize: '0.88rem', color: '#50575e', lineHeight: 1.6, background: '#fff', border: '1px solid #e2e4e7', padding: '12px', borderRadius: '4px' }}>
                {activeEnquiry.project_description}
              </div>
            </div>

            {/* Internal Follow-Up Notes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1d2327', marginBottom: '6px' }}>
                Internal Team Notes:
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Called client on Monday, scheduled coffee catch-up for Thursday at 11 AM..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
              <button
                onClick={() => handleSaveNotes(activeEnquiry.id)}
                className="wp-btn wp-btn-primary"
                style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}
                disabled={savingNote}
              >
                {savingNote ? 'Saving...' : 'Save Internal Note'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
