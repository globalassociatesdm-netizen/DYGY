import React, { useState, useEffect } from 'react';
import { FileText, Save, History, Check, RotateCcw } from 'lucide-react';

export const AdminPagesTab: React.FC = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('home');
  const [currentPage, setCurrentPage] = useState<any | null>(null);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('dygytaly_admin_token');

  const fetchPages = () => {
    fetch('/api/admin/pages', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setPages(data);
        const found = data.find((p: any) => p.slug === selectedSlug) || data[0];
        if (found) {
          setCurrentPage(found);
          fetchRevisions(found.slug);
        }
      })
      .catch(() => {});
  };

  const fetchRevisions = (slug: string) => {
    fetch(`/api/admin/pages/${slug}/revisions`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setRevisions(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchPages();
  }, [selectedSlug]);

  const handleSelectPage = (page: any) => {
    setSelectedSlug(page.slug);
    setCurrentPage(page);
    fetchRevisions(page.slug);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPage) return;
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch(`/api/admin/pages/${currentPage.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentPage)
      });
      if (res.ok) {
        setMsg('Page published successfully and revision archived!');
        fetchRevisions(currentPage.slug);
        setTimeout(() => setMsg(''), 4000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreRevision = async (revId: number) => {
    if (!window.confirm('Restore page to this previous revision?')) return;
    const res = await fetch(`/api/admin/pages/${selectedSlug}/restore/${revId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setMsg('Revision restored successfully!');
      fetchPages();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Pages Manager</h1>
        <p style={{ color: '#646970', fontSize: '0.9rem' }}>
          Edit public content, headlines, supporting copy, CTA buttons, and SEO metadata across all website pages.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '20px', alignItems: 'start' }}>
        {/* Left: Pages List */}
        <div className="admin-card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '1rem', color: '#1d2327', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid #f0f0f1' }}>
            All Site Pages
          </h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {pages.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => handleSelectPage(p)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    textAlign: 'left',
                    borderRadius: '4px',
                    border: 'none',
                    background: selectedSlug === p.slug ? '#2271b1' : 'transparent',
                    color: selectedSlug === p.slug ? '#ffffff' : '#2c3338',
                    fontWeight: selectedSlug === p.slug ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{p.title}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>/{p.slug}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Center: Page Editor Form */}
        {currentPage && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#1d2327' }}>
                  Edit Page: {currentPage.title}
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#646970' }}>
                  Slug: <code>/{currentPage.slug}</code>
                </span>
              </div>
              {msg && (
                <div style={{ color: '#00a32a', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> {msg}
                </div>
              )}
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Navigation Title
                  </label>
                  <input
                    type="text"
                    value={currentPage.title || ''}
                    onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Eyebrow Text
                  </label>
                  <input
                    type="text"
                    value={currentPage.eyebrow || ''}
                    onChange={(e) => setCurrentPage({ ...currentPage, eyebrow: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Main Page Heading (H1)
                </label>
                <input
                  type="text"
                  value={currentPage.heading || ''}
                  onChange={(e) => setCurrentPage({ ...currentPage, heading: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Subheading
                </label>
                <input
                  type="text"
                  value={currentPage.subheading || ''}
                  onChange={(e) => setCurrentPage({ ...currentPage, subheading: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Body Content / Paragraphs
                </label>
                <textarea
                  rows={6}
                  value={currentPage.content || ''}
                  onChange={(e) => setCurrentPage({ ...currentPage, content: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={currentPage.cta_text || ''}
                    onChange={(e) => setCurrentPage({ ...currentPage, cta_text: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    CTA Destination Link
                  </label>
                  <input
                    type="text"
                    value={currentPage.cta_link || ''}
                    onChange={(e) => setCurrentPage({ ...currentPage, cta_link: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* SEO Box */}
              <div style={{ background: '#f6f7f7', padding: '16px', borderRadius: '4px', marginBottom: '24px', border: '1px solid #dcdcde' }}>
                <h4 style={{ fontSize: '0.92rem', color: '#1d2327', marginBottom: '12px' }}>
                  Search Engine Optimization (SEO) Metadata
                </h4>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={currentPage.seo_title || ''}
                    onChange={(e) => setCurrentPage({ ...currentPage, seo_title: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #8c8f94', borderRadius: '3px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={currentPage.meta_description || ''}
                    onChange={(e) => setCurrentPage({ ...currentPage, meta_description: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #8c8f94', borderRadius: '3px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="wp-btn wp-btn-primary"
                style={{ padding: '10px 22px', fontSize: '0.95rem' }}
                disabled={saving}
              >
                {saving ? 'Publishing Changes...' : 'Save & Publish Page'}
              </button>
            </form>
          </div>
        )}

        {/* Right Column: Revision History */}
        <div className="admin-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f0f0f1' }}>
            <History size={16} color="#646970" />
            <h4 style={{ fontSize: '0.92rem', color: '#1d2327', margin: 0 }}>Revision History</h4>
          </div>

          {revisions.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: '#8c8f94' }}>No previous revisions saved yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {revisions.map((rev) => (
                <li
                  key={rev.id}
                  style={{
                    padding: '8px 10px',
                    background: '#f6f7f7',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    border: '1px solid #e2e4e7'
                  }}
                >
                  <div style={{ color: '#2c3338', fontWeight: 600 }}>
                    {new Date(rev.created_at).toLocaleString()}
                  </div>
                  <div style={{ color: '#646970', fontSize: '0.75rem', marginTop: '2px' }}>
                    by {rev.saved_by}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRestoreRevision(rev.id)}
                    className="wp-btn wp-btn-secondary"
                    style={{ marginTop: '6px', padding: '3px 8px', fontSize: '0.75rem' }}
                  >
                    <RotateCcw size={12} /> Revert to this version
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
