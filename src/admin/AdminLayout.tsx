import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Layers, Briefcase, FolderGit2, User,
  Users, Coffee, UserPlus, Inbox, MessageSquare, HelpCircle,
  Image, Menu, Settings, Search, ShieldCheck, Download, History,
  LogOut, ExternalLink, Eye, CheckCircle2
} from 'lucide-react';
import { AdminPreviewModal } from './AdminPreviewModal';

interface LayoutProps {
  user: any;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<LayoutProps> = ({
  user,
  onLogout,
  activeTab,
  setActiveTab,
  children
}) => {
  const [stats, setStats] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('/');

  useEffect(() => {
    const token = localStorage.getItem('dygytaly_admin_token');
    if (token) {
      fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(() => {});
    }
  }, [activeTab]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'homepage-builder', label: 'Homepage Builder', icon: <Layers size={18} /> },
    { id: 'pages', label: 'Pages', icon: <FileText size={18} /> },
    { id: 'services', label: 'Services Manager', icon: <Briefcase size={18} /> },
    { id: 'portfolio', label: 'Portfolio / Cases', icon: <FolderGit2 size={18} /> },
    { id: 'founder', label: 'Founder Profile', icon: <User size={18} /> },
    { id: 'team', label: 'Team Members', icon: <Users size={18} /> },
    { id: 'culture', label: 'Company Culture', icon: <Coffee size={18} /> },
    { id: 'careers', label: 'Careers / Jobs', icon: <Briefcase size={18} /> },
    {
      id: 'applications',
      label: 'Job Applications',
      icon: <UserPlus size={18} />,
      badge: stats?.applications?.new > 0 ? stats.applications.new : undefined
    },
    {
      id: 'enquiries',
      label: 'Contact Enquiries',
      icon: <Inbox size={18} />,
      badge: stats?.enquiries?.new > 0 ? stats.enquiries.new : undefined
    },
    { id: 'testimonials', label: 'Reviews & Google', icon: <MessageSquare size={18} /> },
    { id: 'faqs', label: 'FAQs', icon: <HelpCircle size={18} /> },
    { id: 'media', label: 'Media Library', icon: <Image size={18} /> },
    { id: 'navigation', label: 'Navigation Menus', icon: <Menu size={18} /> },
    { id: 'settings', label: 'Global Settings', icon: <Settings size={18} /> },
    { id: 'seo', label: 'SEO & Sitemap', icon: <Search size={18} /> },
    { id: 'users', label: 'Users & Roles', icon: <ShieldCheck size={18} /> },
    { id: 'backups', label: 'Backups & Export', icon: <Download size={18} /> },
    { id: 'activity', label: 'Activity Log', icon: <History size={18} /> },
  ];

  const handleOpenPreview = (path: string = '/') => {
    setPreviewUrl(path);
    setPreviewOpen(true);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/uploads/dygytaly-logo.png" alt="Dygytaly" />
          <div>
            <div className="admin-brand-title">Dygytaly CMS</div>
            <div style={{ fontSize: '0.72rem', color: '#8c8f94' }}>WordPress-Style Admin</div>
          </div>
        </div>

        <ul className="admin-nav">
          {navItems.map((item) => (
            <li key={item.id} className="admin-nav-item">
              <button
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`admin-nav-link ${activeTab === item.id ? 'active' : ''}`}
                style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="admin-nav-badge">{item.badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Sidebar Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.8rem', color: '#c3c4c7' }}>
            <div>{user?.username}</div>
            <div style={{ fontSize: '0.72rem', color: '#8c8f94', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
          <button
            onClick={onLogout}
            style={{ background: 'none', border: 'none', color: '#d63638', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.88rem',
                color: '#2271b1',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              <ExternalLink size={15} /> Visit Public Website
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => handleOpenPreview('/')}
              className="wp-btn wp-btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Eye size={15} /> Live Device Preview
            </button>
            <span style={{ fontSize: '0.82rem', color: '#646970' }}>
              Connected to <strong>dygytaly.db</strong>
            </span>
          </div>
        </header>

        {/* Dynamic CMS Body */}
        <div className="admin-body">
          {children}
        </div>
      </div>

      {/* Responsive Preview Modal */}
      <AdminPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        previewUrl={previewUrl}
      />
    </div>
  );
};
