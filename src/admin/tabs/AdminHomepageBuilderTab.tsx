import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, Save, Check, RefreshCw } from 'lucide-react';

export const AdminHomepageBuilderTab: React.FC = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const token = localStorage.getItem('dygytaly_admin_token');

  const fetchSections = () => {
    fetch('/api/admin/sections', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSections(data);
        if (data.length > 0 && !selectedSection) {
          setSelectedSection(data[0]);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // re-assign display orders
    const orderPayload = newSections.map((s, idx) => ({ id: s.id, display_order: idx + 1 }));
    setSections(newSections);

    await fetch('/api/admin/sections/reorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ order: orderPayload })
    });
  };

  const handleToggleVisibility = async (sec: any) => {
    const newVis = sec.is_visible === 1 ? 0 : 1;
    await fetch(`/api/admin/sections/${sec.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...sec,
        is_visible: newVis
      })
    });
    fetchSections();
  };

  const handleSaveSelected = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSection) return;
    setSaving(true);
    setSavedMsg('');

    try {
      const res = await fetch(`/api/admin/sections/${selectedSection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(selectedSection)
      });
      if (res.ok) {
        setSavedMsg('Section saved successfully! Live website updated.');
        fetchSections();
        setTimeout(() => setSavedMsg(''), 4000);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Visual Homepage Builder</h1>
        <p style={{ color: '#646970', fontSize: '0.9rem' }}>
          Reorder homepage sections, toggle visibility, and customize headings, copy, and approved background presets.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Sections List */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 style={{ fontSize: '1.05rem', color: '#1d2327' }}>Page Sections</h3>
            <span style={{ fontSize: '0.8rem', color: '#8c8f94' }}>{sections.length} blocks</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                onClick={() => setSelectedSection(sec)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '4px',
                  border: selectedSection?.id === sec.id ? '2px solid #2271b1' : '1px solid #dcdcde',
                  background: selectedSection?.id === sec.id ? '#f0f6fc' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1d2327' }}>
                    {sec.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#646970' }}>
                    key: <code>{sec.section_key}</code>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    style={{ background: 'none', border: 'none', cursor: idx === 0 ? 'not-allowed' : 'pointer', color: idx === 0 ? '#c3c4c7' : '#50575e', padding: '4px' }}
                    title="Move section up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sections.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    style={{ background: 'none', border: 'none', cursor: idx === sections.length - 1 ? 'not-allowed' : 'pointer', color: idx === sections.length - 1 ? '#c3c4c7' : '#50575e', padding: '4px' }}
                    title="Move section down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(sec)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: sec.is_visible ? '#00a32a' : '#d63638', padding: '4px' }}
                    title={sec.is_visible ? 'Section is visible (click to hide)' : 'Section is hidden (click to show)'}
                  >
                    {sec.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Section Editor Form */}
        {selectedSection && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#1d2327' }}>
                  Edit Section: {selectedSection.title}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#8c8f94' }}>
                  Identified by: {selectedSection.section_key}
                </span>
              </div>

              {savedMsg && (
                <div style={{ color: '#00a32a', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={16} /> {savedMsg}
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSelected}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Section Title / Display Name
                  </label>
                  <input
                    type="text"
                    value={selectedSection.title || ''}
                    onChange={(e) => setSelectedSection({ ...selectedSection, title: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Eyebrow / Badge Text
                  </label>
                  <input
                    type="text"
                    value={selectedSection.eyebrow || ''}
                    onChange={(e) => setSelectedSection({ ...selectedSection, eyebrow: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Subtitle / Supporting Headline
                </label>
                <input
                  type="text"
                  value={selectedSection.subtitle || ''}
                  onChange={(e) => setSelectedSection({ ...selectedSection, subtitle: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Approved Background Preset
                  </label>
                  <select
                    value={selectedSection.bg_variant || 'default'}
                    onChange={(e) => setSelectedSection({ ...selectedSection, bg_variant: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                  >
                    <option value="default">Default Theme</option>
                    <option value="warm-ivory">Warm Ivory (#F7F4ED)</option>
                    <option value="soft-cream">Soft Cream (#EEE8DB)</option>
                    <option value="deep-plum">Deep Plum (#45243F)</option>
                    <option value="aubergine">Aubergine (#291A2D)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Section Visibility
                  </label>
                  <select
                    value={selectedSection.is_visible !== undefined ? selectedSection.is_visible : 1}
                    onChange={(e) => setSelectedSection({ ...selectedSection, is_visible: Number(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #8c8f94', borderRadius: '4px', boxSizing: 'border-box' }}
                  >
                    <option value={1}>Published & Visible</option>
                    <option value={0}>Hidden / Draft</option>
                  </select>
                </div>
              </div>

              {/* Dynamic JSON / Content Attributes */}
              {selectedSection.content && typeof selectedSection.content === 'object' && (
                <div style={{ background: '#f6f7f7', padding: '16px', borderRadius: '4px', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1d2327', marginBottom: '12px' }}>
                    Section Content Properties
                  </h4>

                  {selectedSection.content.headline !== undefined && (
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                        Main Section Headline
                      </label>
                      <input
                        type="text"
                        value={selectedSection.content.headline}
                        onChange={(e) => setSelectedSection({
                          ...selectedSection,
                          content: { ...selectedSection.content, headline: e.target.value }
                        })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccd0d4', borderRadius: '3px', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}

                  {selectedSection.content.description !== undefined && (
                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                        Description Copy
                      </label>
                      <textarea
                        rows={4}
                        value={selectedSection.content.description}
                        onChange={(e) => setSelectedSection({
                          ...selectedSection,
                          content: { ...selectedSection.content, description: e.target.value }
                        })}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccd0d4', borderRadius: '3px', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}

                  {selectedSection.content.primary_cta_text !== undefined && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                          Primary Button Text
                        </label>
                        <input
                          type="text"
                          value={selectedSection.content.primary_cta_text}
                          onChange={(e) => setSelectedSection({
                            ...selectedSection,
                            content: { ...selectedSection.content, primary_cta_text: e.target.value }
                          })}
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccd0d4', borderRadius: '3px', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                          Primary Button Destination
                        </label>
                        <input
                          type="text"
                          value={selectedSection.content.primary_cta_link}
                          onChange={(e) => setSelectedSection({
                            ...selectedSection,
                            content: { ...selectedSection.content, primary_cta_link: e.target.value }
                          })}
                          style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccd0d4', borderRadius: '3px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="wp-btn wp-btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.95rem' }}
                disabled={saving}
              >
                {saving ? 'Publishing Changes...' : 'Save & Publish Section to Website'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
