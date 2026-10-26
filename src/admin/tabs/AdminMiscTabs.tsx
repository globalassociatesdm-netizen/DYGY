import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, ExternalLink, Globe, Search } from 'lucide-react';

/* ==========================================================================
   PORTFOLIO TAB
   ========================================================================== */
export const AdminPortfolioTab: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const token = localStorage.getItem('dygytaly_admin_token');

  const fetchPortfolio = () => {
    fetch('/api/admin/portfolio', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(() => {});
  };

  useEffect(() => { fetchPortfolio(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isCreating ? '/api/admin/portfolio' : `/api/admin/portfolio/${editing.id}`;
    const method = isCreating ? 'POST' : 'PUT';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(editing)
    });
    setEditing(null);
    fetchPortfolio();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete case study?')) return;
    await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchPortfolio();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Portfolio & Case Studies</h1>
        <button onClick={() => { setIsCreating(true); setEditing({ title: '', client_name: '', industry: '', category: 'Websites', challenge: '', strategy: '', execution: '', results: '' }); }} className="wp-btn wp-btn-primary">
          <Plus size={16} /> Add Case Study
        </button>
      </div>

      {editing && (
        <div className="admin-card" style={{ border: '2px solid #2271b1', marginBottom: '24px' }}>
          <div className="admin-card-header">
            <h3>{isCreating ? 'Add Case Study' : `Edit: ${editing.title}`}</h3>
            <button onClick={() => setEditing(null)} className="wp-btn wp-btn-secondary">Cancel</button>
          </div>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Project Title</label>
                <input required type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Client / Brand</label>
                <input required type="text" value={editing.client_name} onChange={e => setEditing({ ...editing, client_name: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Category</label>
                <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}>
                  <option value="Websites">Websites</option>
                  <option value="Branding">Branding</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="SEO">SEO</option>
                  <option value="Video">Video</option>
                  <option value="Creative">Creative</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Industry</label>
              <input type="text" value={editing.industry} onChange={e => setEditing({ ...editing, industry: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Business Challenge</label>
                <textarea rows={3} value={editing.challenge} onChange={e => setEditing({ ...editing, challenge: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Strategy Applied</label>
                <textarea rows={3} value={editing.strategy} onChange={e => setEditing({ ...editing, strategy: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Execution</label>
                <textarea rows={3} value={editing.execution} onChange={e => setEditing({ ...editing, execution: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Verified Results & Metrics</label>
                <textarea rows={3} value={editing.results} onChange={e => setEditing({ ...editing, results: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
            </div>

            <button type="submit" className="wp-btn wp-btn-primary">Save Case Study</button>
          </form>
        </div>
      )}

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Client</th><th>Category</th><th>Result Summary</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id}>
                <td><strong>{p.title}</strong></td>
                <td>{p.client_name} ({p.industry})</td>
                <td><span className="badge badge-sage">{p.category}</span></td>
                <td style={{ fontSize: '0.85rem', color: '#50575e' }}>{p.results}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => { setIsCreating(false); setEditing(p); }} className="wp-btn wp-btn-secondary" style={{ padding: '3px 8px', marginRight: '6px' }}><Edit2 size={12} /></button>
                  <button onClick={() => handleDelete(p.id)} className="wp-btn wp-btn-danger" style={{ padding: '3px 8px' }}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ==========================================================================
   CAREERS TAB (JOB OPENINGS)
   ========================================================================== */
export const AdminCareersTab: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const token = localStorage.getItem('dygytaly_admin_token');

  const fetchJobs = () => {
    fetch('/api/admin/jobs', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(() => {});
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isCreating ? '/api/admin/jobs' : `/api/admin/jobs/${editing.id}`;
    const method = isCreating ? 'POST' : 'PUT';

    const responsibilities = typeof editing.responsibilitiesText === 'string'
      ? editing.responsibilitiesText.split('\n').filter(Boolean)
      : editing.responsibilities;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...editing, responsibilities })
    });
    setEditing(null);
    fetchJobs();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete vacancy?')) return;
    await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchJobs();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Job Vacancies Manager</h1>
        <button onClick={() => { setIsCreating(true); setEditing({ title: '', slug: '', department: 'Creative', location: 'Coimbatore', type: 'Full-time', description: '', is_open: 1, responsibilitiesText: '' }); }} className="wp-btn wp-btn-primary">
          <Plus size={16} /> Create Job Opening
        </button>
      </div>

      {editing && (
        <div className="admin-card" style={{ border: '2px solid #2271b1', marginBottom: '24px' }}>
          <div className="admin-card-header">
            <h3>{isCreating ? 'New Vacancy' : `Editing: ${editing.title}`}</h3>
            <button onClick={() => setEditing(null)} className="wp-btn wp-btn-secondary">Cancel</button>
          </div>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Role Title</label>
                <input required type="text" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Slug</label>
                <input required type="text" value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Role Summary Description</label>
              <textarea rows={3} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Responsibilities (one per line)</label>
              <textarea rows={4} value={editing.responsibilitiesText || (editing.responsibilities || []).join('\n')} onChange={e => setEditing({ ...editing, responsibilitiesText: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" className="wp-btn wp-btn-primary">Save Role</button>
          </form>
        </div>
      )}

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Job Title</th><th>Department</th><th>Location</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id}>
                <td><strong>{j.title}</strong></td>
                <td>{j.department}</td>
                <td>{j.location}</td>
                <td><span className="status-pill status-converted">{j.is_open ? 'Open' : 'Closed'}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => { setIsCreating(false); setEditing(j); }} className="wp-btn wp-btn-secondary" style={{ padding: '3px 8px', marginRight: '6px' }}><Edit2 size={12} /></button>
                  <button onClick={() => handleDelete(j.id)} className="wp-btn wp-btn-danger" style={{ padding: '3px 8px' }}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ==========================================================================
   TESTIMONIALS & REVIEWS TAB
   ========================================================================== */
export const AdminTestimonialsTab: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const token = localStorage.getItem('dygytaly_admin_token');

  const fetchReviews = () => {
    fetch('/api/admin/testimonials', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(() => {});
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete review?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchReviews();
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Client Reviews & Google Rating</h1>
        <p style={{ color: '#646970', fontSize: '0.9rem' }}>
          Manage genuine verified client feedback and Google review ratings.
        </p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Client Name</th><th>Company</th><th>Rating</th><th>Review Snippet</th><th>Source</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
          </thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r.id}>
                <td><strong>{r.author_name}</strong></td>
                <td>{r.business_name}</td>
                <td style={{ color: '#dba617', fontWeight: 700 }}>{r.rating} ★</td>
                <td style={{ fontSize: '0.85rem', color: '#50575e', maxWidth: '380px' }}>“{r.review_text}”</td>
                <td><span className="badge badge-sage">{r.source}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => handleDelete(r.id)} className="wp-btn wp-btn-danger" style={{ padding: '3px 8px' }}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ==========================================================================
   FAQS TAB
   ========================================================================== */
export const AdminFaqsTab: React.FC = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const token = localStorage.getItem('dygytaly_admin_token');

  const fetchFaqs = () => {
    fetch('/api/admin/faqs', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setFaqs(data))
      .catch(() => {});
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ || !newA) return;
    await fetch('/api/admin/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question: newQ, answer: newA, category: 'general', display_order: faqs.length + 1 })
    });
    setNewQ('');
    setNewA('');
    fetchFaqs();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchFaqs();
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>FAQs Manager</h1>
        <p style={{ color: '#646970', fontSize: '0.9rem' }}>
          Manage frequently asked questions displayed in the accordion on the homepage and solutions pages.
        </p>
      </div>

      {/* Add FAQ */}
      <div className="admin-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', color: '#1d2327', marginBottom: '12px' }}>Add New FAQ</h3>
        <form onSubmit={handleAddFaq}>
          <div style={{ marginBottom: '12px' }}>
            <input type="text" placeholder="Question title..." value={newQ} onChange={e => setNewQ(e.target.value)} required style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <textarea rows={3} placeholder="Answer explanation..." value={newA} onChange={e => setNewA(e.target.value)} required style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" className="wp-btn wp-btn-primary">Add Question</button>
        </form>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Question</th><th>Answer</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
          </thead>
          <tbody>
            {faqs.map(f => (
              <tr key={f.id}>
                <td style={{ fontWeight: 600, color: '#1d2327', width: '35%' }}>{f.question}</td>
                <td style={{ fontSize: '0.88rem', color: '#50575e' }}>{f.answer}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => handleDelete(f.id)} className="wp-btn wp-btn-danger" style={{ padding: '3px 8px' }}><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ==========================================================================
   SEO & SITEMAP TAB
   ========================================================================== */
export const AdminSeoTab: React.FC = () => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>SEO & Discovery Settings</h1>
        <p style={{ color: '#646970', fontSize: '0.9rem' }}>
          Real-time XML sitemap, search robot instructions, and on-page metadata health.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '1.1rem', color: '#1d2327' }}>Dynamic XML Sitemap</h3>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="wp-btn wp-btn-secondary">
              Open /sitemap.xml <ExternalLink size={14} />
            </a>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#50575e', lineHeight: 1.6 }}>
            The XML Sitemap automatically discovers and includes all published pages, services, and career roles with priority scores and update timestamps for search bots.
          </p>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '1.1rem', color: '#1d2327' }}>Robots.txt Directive</h3>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="wp-btn wp-btn-secondary">
              Open /robots.txt <ExternalLink size={14} />
            </a>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#50575e', lineHeight: 1.6 }}>
            <code>robots.txt</code> protects administrative routes and private candidate applications while permitting public crawlers to index your services and portfolio.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   USERS TAB
   ========================================================================== */
export const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const token = localStorage.getItem('dygytaly_admin_token');

  useEffect(() => {
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Users & Permissions</h1>
        <p style={{ color: '#646970', fontSize: '0.9rem' }}>
          Role-based administration accounts: Administrator, Editor, Careers Manager, Enquiry Manager.
        </p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Username</th><th>Email</th><th>Role</th><th>Created</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><strong>{u.username}</strong></td>
                <td>{u.email}</td>
                <td><span className="badge badge-lavender" style={{ textTransform: 'capitalize' }}>{u.role}</span></td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ==========================================================================
   ACTIVITY LOG TAB
   ========================================================================== */
export const AdminActivityTab: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const token = localStorage.getItem('dygytaly_admin_token');

  useEffect(() => {
    fetch('/api/admin/activity', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Activity History Audit Log</h1>
        <p style={{ color: '#646970', fontSize: '0.9rem' }}>
          Complete chronological record of administrator updates, logins, submissions, and content revisions.
        </p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr><th>Timestamp</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th></tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td style={{ fontSize: '0.82rem', color: '#646970', whiteSpace: 'nowrap' }}>
                  {new Date(l.created_at).toLocaleString()}
                </td>
                <td><strong>{l.username}</strong></td>
                <td>{l.action}</td>
                <td><span className="badge badge-sage">{l.entity}</span></td>
                <td style={{ fontSize: '0.85rem', color: '#50575e' }}>{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
