import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, X, ExternalLink } from 'lucide-react';

interface PreviewProps {
  isOpen: boolean;
  onClose: () => void;
  previewUrl: string;
}

export const AdminPreviewModal: React.FC<PreviewProps> = ({ isOpen, onClose, previewUrl }) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const getWidth = () => {
    switch (device) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(29, 35, 39, 0.88)',
      backdropFilter: 'blur(10px)',
      zIndex: 3000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Preview Controls Bar */}
      <div style={{
        height: '56px',
        background: '#1d2327',
        borderBottom: '1px solid #3c434a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f18a55' }}>
            Live Device Preview
          </span>
          <span style={{ fontSize: '0.8rem', color: '#c3c4c7' }}>
            {previewUrl}
          </span>
        </div>

        {/* Device Switcher */}
        <div style={{ display: 'flex', gap: '8px', background: '#2c3338', padding: '4px', borderRadius: '4px' }}>
          <button
            onClick={() => setDevice('desktop')}
            style={{
              background: device === 'desktop' ? '#2271b1' : 'transparent',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem'
            }}
          >
            <Monitor size={15} /> Desktop
          </button>
          <button
            onClick={() => setDevice('tablet')}
            style={{
              background: device === 'tablet' ? '#2271b1' : 'transparent',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem'
            }}
          >
            <Tablet size={15} /> Tablet
          </button>
          <button
            onClick={() => setDevice('mobile')}
            style={{
              background: device === 'mobile' ? '#2271b1' : 'transparent',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem'
            }}
          >
            <Smartphone size={15} /> Mobile
          </button>
        </div>

        {/* Right close & external */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#72aee6', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
          >
            Open in new tab <ExternalLink size={14} />
          </a>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: device === 'desktop' ? '0' : '24px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: getWidth(),
          height: '100%',
          maxWidth: '100%',
          background: '#fff',
          borderRadius: device === 'desktop' ? '0' : '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          transition: 'width 0.3s ease'
        }}>
          <iframe
            src={previewUrl}
            title="Website Live Preview"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};
