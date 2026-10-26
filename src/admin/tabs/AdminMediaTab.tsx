import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Copy, Check, File, Search, Image as ImageIcon } from 'lucide-react';

export const AdminMediaTab: React.FC = () => {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('dygytaly_admin_token');

  const fetchMedia = () => {
    fetch('/api/admin/media', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setMediaList(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', file.name);

    setUploading(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setMsg('File uploaded successfully into media library!');
        fetchMedia();
        setTimeout(() => setMsg(''), 4000);
      }
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this media asset?')) return;
    const res = await fetch(`/api/admin/media/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      fetchMedia();
    }
  };

  const filtered = mediaList.filter(m =>
    (m.original_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.filename || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', color: '#1d2327', fontWeight: 600 }}>Media Library</h1>
          <p style={{ color: '#646970', fontSize: '0.9rem' }}>
            Central repository for brand logos, team photos, case study screenshots, and documents.
          </p>
        </div>

        <div>
          <label className="wp-btn wp-btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={16} />
            <span>{uploading ? 'Uploading Asset...' : 'Upload New Asset'}</span>
            <input
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '10px 14px', background: 'rgba(0,163,42,0.1)', color: '#00661a', borderRadius: '4px', marginBottom: '20px' }}>
          {msg}
        </div>
      )}

      {/* Search Bar */}
      <div className="admin-card" style={{ padding: '12px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Search size={16} color="#8c8f94" />
        <input
          type="text"
          placeholder="Search media files by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.9rem' }}
        />
      </div>

      {/* Media Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {filtered.map((item) => {
          const isImg = item.file_type?.startsWith('image/') || item.filename?.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i);

          return (
            <div
              key={item.id}
              className="admin-card"
              style={{
                padding: '12px',
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: item.filename.includes('dygytaly-logo') ? '2px solid var(--color-tangerine)' : '1px solid #dcdcde'
              }}
            >
              <div>
                <div style={{
                  width: '100%',
                  height: '130px',
                  background: '#f6f7f7',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  overflow: 'hidden'
                }}>
                  {isImg ? (
                    <img
                      src={item.file_path}
                      alt={item.alt_text || item.original_name}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <File size={36} color="#646970" />
                  )}
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1d2327', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }} title={item.original_name}>
                  {item.original_name}
                </div>

                <div style={{ fontSize: '0.72rem', color: '#8c8f94', marginBottom: '10px' }}>
                  {item.file_size ? `${Math.round(item.file_size / 1024)} KB` : 'N/A'} • {item.file_type || 'file'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid #f0f0f1', paddingTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.file_path, item.id)}
                  className="wp-btn wp-btn-secondary"
                  style={{ flexGrow: 1, padding: '4px 6px', fontSize: '0.75rem', justifyContent: 'center' }}
                  title="Copy relative file path"
                >
                  {copiedId === item.id ? <Check size={12} color="#00a32a" /> : <Copy size={12} />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                </button>

                {!item.filename.includes('dygytaly-logo') && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="wp-btn wp-btn-danger"
                    style={{ padding: '4px 8px' }}
                    title="Delete asset"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
