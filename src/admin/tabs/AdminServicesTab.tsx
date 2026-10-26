import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, ArrowRight } from 'lucide-react';

export const AdminServicesTab: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('dygytaly_admin_token');

  const fetchServices = () => {
    fetch('/api/admin/services', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (svc: any) => {
    setIsCreating(false);
    setEditingService({
      ...svc,
      deliverablesText: (svc.deliverables || []).join('\n'),
      technologiesText: (svc.technologies || []).join(', ')
    });
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingService({
      slug: '',
      title: '',
      tagline: '',
      short_desc: '',
      hero_headline: '',
      problem_solved: '',
      approach: '',
      deliverablesText: '',
      technologiesText: '',
      icon_name: 'Globe',
      image_url: '/uploads/dygytaly-logo.png',
      cta_text: "Let's Catch Up ☕",
      display_order: services.length + 1,
      is_published: 1,
      seo_title: '',
      meta_description: ''
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    const res = await fetch(`/api/admin/services/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setMsg('Service deleted.');
      fetchServices();
      setEditingService(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const deliverables = editingService.deliverablesText
      ? editingService.deliverablesText.split('\n').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const technologies = editingService.technologiesText
      ? editingService.technologiesText.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...editingService,
      deliverables,
      technologies
    };

    const url = isCreating ? '/api/admin/services' : `/api/admin/services/${editingService.id}`;
    const method = isCreating ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setMsg(isCreating ? 'New service created!' : 'Service updated successfully!');
      fetchServices();
      setEditingService(null);
      setIsCreating(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Services Manager</h1>
          <p style={{ color: '#646970', fontSize: '0.9rem' }}>
            Manage all 10 agency solutions, deliverables, technical stacks, and public routes.
          </p>
        </div>
        <button onClick={handleCreateNew} className="wp-btn wp-btn-primary">
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {msg && (
        <div style={{ padding: '12px', background: 'rgba(0,163,42,0.1)', color: '#00661a', borderRadius: '4px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} /> {msg}
        </div>
      )}

      {/* Editor Modal / Panel */}
      {editingService && (
        <div className="admin-card" style={{ marginBottom: '30px', border: '2px solid #2271b1' }}>
          <div className="admin-card-header">
            <h3 style={{ fontSize: '1.2rem', color: '#1d2327' }}>
              {isCreating ? 'Create New Service' : `Editing: ${editingService.title}`}
            </h3>
            <button onClick={() => setEditingService(null)} className="wp-btn wp-btn-secondary">
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  URL Slug (e.g. google-ads) *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.slug || ''}
                  onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Icon Style
                </label>
                <select
                  value={editingService.icon_name || 'Globe'}
                  onChange={(e) => setEditingService({ ...editingService, icon_name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                >
                  <option value="Search">Search (Google Ads)</option>
                  <option value="Share2">Share2 (Meta Ads)</option>
                  <option value="Globe">Globe (Web Dev)</option>
                  <option value="Layers">Layers (App Dev)</option>
                  <option value="Users">Users (CRM)</option>
                  <option value="Database">Database (ERP)</option>
                  <option value="TrendingUp">TrendingUp (SEO)</option>
                  <option value="MapPin">MapPin (Local SEO)</option>
                  <option value="Palette">Palette (Branding)</option>
                  <option value="Video">Video (Production)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Tagline (e.g. "Be There When Customers Are Searching.")
              </label>
              <input
                type="text"
                value={editingService.tagline || ''}
                onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Short Card Description
              </label>
              <textarea
                rows={2}
                value={editingService.short_desc || ''}
                onChange={(e) => setEditingService({ ...editingService, short_desc: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Problem Addressed
                </label>
                <textarea
                  rows={4}
                  value={editingService.problem_solved || ''}
                  onChange={(e) => setEditingService({ ...editingService, problem_solved: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Our Approach
                </label>
                <textarea
                  rows={4}
                  value={editingService.approach || ''}
                  onChange={(e) => setEditingService({ ...editingService, approach: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Deliverables (one per line)
                </label>
                <textarea
                  rows={4}
                  value={editingService.deliverablesText || ''}
                  onChange={(e) => setEditingService({ ...editingService, deliverablesText: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Technologies (comma separated)
                </label>
                <textarea
                  rows={4}
                  value={editingService.technologiesText || ''}
                  onChange={(e) => setEditingService({ ...editingService, technologiesText: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="wp-btn wp-btn-primary">
                Save & Update Service
              </button>
              <button type="button" onClick={() => setEditingService(null)} className="wp-btn wp-btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>Order</th>
              <th>Service Title</th>
              <th>Slug / URL</th>
              <th>Tagline</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => (
              <tr key={svc.id}>
                <td style={{ fontWeight: 600 }}>{svc.display_order}</td>
                <td>
                  <strong style={{ color: '#1d2327' }}>{svc.title}</strong>
                </td>
                <td>
                  <code style={{ fontSize: '0.82rem' }}>/services/{svc.slug}</code>
                </td>
                <td style={{ color: '#646970', fontSize: '0.88rem' }}>{svc.tagline}</td>
                <td>
                  <span className="status-pill status-converted">Published</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => handleEdit(svc)}
                      className="wp-btn wp-btn-secondary"
                      style={{ padding: '4px 8px' }}
                      title="Edit Service"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(svc.id)}
                      className="wp-btn wp-btn-danger"
                      style={{ padding: '4px 8px' }}
                      title="Delete Service"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
