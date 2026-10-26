import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboardTab } from './tabs/AdminDashboardTab';
import { AdminHomepageBuilderTab } from './tabs/AdminHomepageBuilderTab';
import { AdminPagesTab } from './tabs/AdminPagesTab';
import { AdminServicesTab } from './tabs/AdminServicesTab';
import { AdminEnquiriesTab } from './tabs/AdminEnquiriesTab';
import { AdminApplicationsTab } from './tabs/AdminApplicationsTab';
import { AdminFounderTab } from './tabs/AdminFounderTab';
import { AdminMediaTab } from './tabs/AdminMediaTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';
import { AdminBackupsTab } from './tabs/AdminBackupsTab';
import {
  AdminPortfolioTab,
  AdminCareersTab,
  AdminTestimonialsTab,
  AdminFaqsTab,
  AdminSeoTab,
  AdminUsersTab,
  AdminActivityTab
} from './tabs/AdminMiscTabs';

export const AdminPortal: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('dygytaly_admin_token'));
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('dygytaly_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setVerifying(false);
      })
      .catch(() => {
        localStorage.removeItem('dygytaly_admin_token');
        localStorage.removeItem('dygytaly_admin_user');
        setToken(null);
        setUser(null);
        setVerifying(false);
      });
  }, [token]);

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('dygytaly_admin_token');
    localStorage.removeItem('dygytaly_admin_user');
    setToken(null);
    setUser(null);
  };

  if (verifying) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f1' }}>
        <p style={{ color: '#646970', fontSize: '1.1rem' }}>Verifying administrator session...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardTab setActiveTab={setActiveTab} />;
      case 'homepage-builder':
        return <AdminHomepageBuilderTab />;
      case 'pages':
        return <AdminPagesTab />;
      case 'services':
        return <AdminServicesTab />;
      case 'portfolio':
        return <AdminPortfolioTab />;
      case 'founder':
        return <AdminFounderTab />;
      case 'careers':
        return <AdminCareersTab />;
      case 'applications':
        return <AdminApplicationsTab />;
      case 'enquiries':
        return <AdminEnquiriesTab />;
      case 'testimonials':
        return <AdminTestimonialsTab />;
      case 'faqs':
        return <AdminFaqsTab />;
      case 'media':
        return <AdminMediaTab />;
      case 'settings':
        return <AdminSettingsTab />;
      case 'seo':
        return <AdminSeoTab />;
      case 'users':
        return <AdminUsersTab />;
      case 'backups':
        return <AdminBackupsTab />;
      case 'activity':
        return <AdminActivityTab />;
      default:
        return <AdminDashboardTab setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AdminLayout
      user={user}
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {renderActiveTab()}
    </AdminLayout>
  );
};
