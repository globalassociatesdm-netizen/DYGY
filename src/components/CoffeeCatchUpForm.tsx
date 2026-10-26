import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';

interface FormProps {
  defaultService?: string;
}

export const CoffeeCatchUpForm: React.FC<FormProps> = ({ defaultService }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    email: '',
    phone: '',
    service_of_interest: defaultService || 'Google Ads',
    project_description: '',
    preferred_contact: 'phone',
    budget_range: '₹50,000 – ₹1,50,000 / month',
    consent: true
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const services = [
    'Google Ads',
    'Meta Ads',
    'Website Development',
    'Application Development',
    'CRM / ERP',
    'Website SEO',
    'Local SEO',
    'Branding and Graphic Design',
    'Social Media Video',
    'General Consultation'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.full_name || !formData.email || !formData.phone || !formData.project_description) {
      setErrorMessage('Please fill in all mandatory fields before submitting.');
      return;
    }

    if (!formData.consent) {
      setErrorMessage('Please acknowledge the privacy consent notice.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setSuccessMessage('Thank you! Your enquiry has been received. Our team will review your project and connect with you over coffee shortly.');
      setFormData({
        full_name: '',
        business_name: '',
        email: '',
        phone: '',
        service_of_interest: defaultService || 'Google Ads',
        project_description: '',
        preferred_contact: 'phone',
        budget_range: '₹50,000 – ₹1,50,000 / month',
        consent: true
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again or chat with us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coffee-card-form" id="coffee-form">
      <h3 style={{ fontSize: '1.6rem', marginBottom: '8px', color: 'var(--color-charcoal)' }}>
        Let's Start the Conversation ☕
      </h3>
      <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Tell us about your ambition. We'll explore the possibilities and map out practical next steps.
      </p>

      {successMessage && (
        <div style={{
          padding: '16px',
          background: 'rgba(0, 163, 42, 0.1)',
          border: '1px solid rgba(0, 163, 42, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: '#00661a',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{
          padding: '14px',
          background: 'rgba(214, 54, 56, 0.1)',
          border: '1px solid rgba(214, 54, 56, 0.3)',
          borderRadius: 'var(--radius-sm)',
          color: '#d63638',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.9rem' }}>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Anand R"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business / Company Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Apex Engineering Ltd"
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              placeholder="anand@company.in"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+91 98765 43210"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Service of Interest *</label>
            <select
              className="form-select"
              value={formData.service_of_interest}
              onChange={(e) => setFormData({ ...formData, service_of_interest: e.target.value })}
            >
              {services.map((svc) => (
                <option key={svc} value={svc}>{svc}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Optional Budget Range</label>
            <select
              className="form-select"
              value={formData.budget_range}
              onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
            >
              <option value="₹25,000 – ₹50,000 / month">₹25,000 – ₹50,000 / month</option>
              <option value="₹50,000 – ₹1,50,000 / month">₹50,000 – ₹1,50,000 / month</option>
              <option value="₹1,50,000 – ₹5,00,000 / month">₹1,50,000 – ₹5,00,000 / month</option>
              <option value="₹5,00,000+ / Custom Enterprise">₹5,00,000+ / Custom Enterprise</option>
              <option value="Project-based / To Discuss">Project-based / To Discuss</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Preferred Contact Method</label>
          <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="preferred_contact"
                value="phone"
                checked={formData.preferred_contact === 'phone'}
                onChange={() => setFormData({ ...formData, preferred_contact: 'phone' })}
              />
              Phone Call
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="preferred_contact"
                value="whatsapp"
                checked={formData.preferred_contact === 'whatsapp'}
                onChange={() => setFormData({ ...formData, preferred_contact: 'whatsapp' })}
              />
              WhatsApp
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="preferred_contact"
                value="email"
                checked={formData.preferred_contact === 'email'}
                onChange={() => setFormData({ ...formData, preferred_contact: 'email' })}
              />
              Email
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tell us about your project or challenge *</label>
          <textarea
            className="form-textarea"
            rows={4}
            placeholder="What is your current business goal or the main challenge you are trying to overcome?"
            required
            value={formData.project_description}
            onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              style={{ marginTop: '3px' }}
            />
            <span>
              I understand that Dygytaly will use these details to contact me regarding my business enquiry. We respect your privacy and never spam.
            </span>
          </label>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px' }}
            disabled={loading}
          >
            {loading ? 'Submitting Enquiry...' : (
              <>
                <Send size={18} /> Let's Start the Conversation
              </>
            )}
          </button>

          <a
            href="https://wa.me/919677759959?text=Hello%20Dygytaly,%20I%20would%20like%20to%20discuss%20a%20digital%20marketing%20and%20technology%20solution."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{
              width: '100%',
              borderColor: '#25D366',
              color: '#1a9a46',
              background: 'rgba(37, 211, 102, 0.05)'
            }}
          >
            <MessageCircle size={18} style={{ color: '#25D366' }} /> Chat With Us on WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
};
