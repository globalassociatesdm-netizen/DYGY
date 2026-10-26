import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, CheckCircle2, AlertCircle, Upload, Send, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const scrollRef = useScrollReveal();

  // Form State
  const [formData, setFormData] = useState({
    job_id: '',
    job_title: '',
    full_name: '',
    email: '',
    phone: '',
    experience: '',
    portfolio_link: '',
    notes: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        if (data.length > 0) {
          setSelectedJob(data[0]);
          setFormData(prev => ({
            ...prev,
            job_id: String(data[0].id),
            job_title: data[0].title
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectJob = (job: any) => {
    setSelectedJob(job);
    setFormData(prev => ({
      ...prev,
      job_id: String(job.id),
      job_title: job.title
    }));
    // scroll to form
    const elem = document.getElementById('application-form');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.full_name || !formData.email || !formData.phone) {
      setErrorMessage('Please fill in your name, email and contact phone number.');
      return;
    }

    setSubmitting(true);
    const body = new FormData();
    body.append('job_id', formData.job_id);
    body.append('job_title', formData.job_title);
    body.append('full_name', formData.full_name);
    body.append('email', formData.email);
    body.append('phone', formData.phone);
    body.append('experience', formData.experience);
    body.append('portfolio_link', formData.portfolio_link);
    body.append('notes', formData.notes);
    if (resumeFile) {
      body.append('resume', resumeFile);
    }

    try {
      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }
      setSuccessMessage('Thank you for applying! Your application has been submitted directly to our hiring team.');
      setFormData({
        job_id: selectedJob ? String(selectedJob.id) : '',
        job_title: selectedJob ? selectedJob.title : '',
        full_name: '',
        email: '',
        phone: '',
        experience: '',
        portfolio_link: '',
        notes: ''
      });
      setResumeFile(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="careers-page" ref={scrollRef} style={{ paddingTop: '100px' }}>
      {/* Hero */}
      <section className="section-py" style={{ background: 'var(--color-aubergine)', color: '#fff', textAlign: 'center' }}>
        <div className="container container-narrow">
          <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>JOIN OUR TEAM</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}>
            Good People. Good Ideas. Room to Grow.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-soft-lavender)', maxWidth: '680px', margin: '0 auto' }}>
            We're building a team that believes creativity, curiosity and technology can make a difference. If you enjoy learning, solving problems and doing meaningful work, we'd like to meet you.
          </p>
        </div>
      </section>

      {/* Vacancies Section */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }} id="openings">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">OPEN POSITIONS</span>
            <h2 className="section-title">Current Career Openings in Coimbatore</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Select a vacancy below to view detailed responsibilities and submit your application.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px', marginBottom: '60px' }}>
            {jobs.map((job) => (
              <div
                key={job.id}
                className="glass-card"
                style={{
                  padding: '36px 30px',
                  border: selectedJob?.id === job.id ? '2px solid var(--color-tangerine)' : '1px solid var(--border-light)',
                  boxShadow: selectedJob?.id === job.id ? 'var(--shadow-xl)' : 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="badge badge-tangerine">{job.department}</span>
                    <span className="badge badge-sage">Open Role</span>
                  </div>

                  <h3 style={{ fontSize: '1.4rem', color: 'var(--color-charcoal)', marginBottom: '8px' }}>
                    {job.title}
                  </h3>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {job.location}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {job.type}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                    {job.description}
                  </p>

                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-deep-plum)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Key Responsibilities:
                    </div>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {(job.responsibilities || []).slice(0, 3).map((r: string, i: number) => (
                        <li key={i} style={{ marginBottom: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <span style={{ color: 'var(--color-tangerine)', fontWeight: 'bold' }}>•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  className={selectedJob?.id === job.id ? 'btn btn-primary' : 'btn btn-outline'}
                  style={{ width: '100%', marginTop: '10px' }}
                  onClick={() => handleSelectJob(job)}
                >
                  {selectedJob?.id === job.id ? 'Selected for Application ✓' : 'Apply for this Role'}
                </button>
              </div>
            ))}
          </div>

          {/* Working Application Form */}
          <div className="container container-narrow" id="application-form">
            <div className="glass-card" style={{ padding: '44px 38px', background: '#FFFFFF' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span className="eyebrow">APPLICATION FORM</span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)', marginBottom: '8px' }}>
                  Apply for: <span style={{ color: 'var(--color-tangerine)' }}>{formData.job_title || 'General Application'}</span>
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  Submit your details below. We review every application personally and respond promptly.
                </p>
              </div>

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
                  <span>{successMessage}</span>
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
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleApply}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ramesh K"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="ramesh@gmail.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
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

                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <select
                      className="form-select"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    >
                      <option value="Fresher / < 1 year">Fresher / &lt; 1 year</option>
                      <option value="1 – 3 years">1 – 3 years</option>
                      <option value="3 – 5 years">3 – 5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Portfolio URL / LinkedIn Profile</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://behance.net/profile or https://linkedin.com/in/username"
                    value={formData.portfolio_link}
                    onChange={(e) => setFormData({ ...formData, portfolio_link: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Attach Resume / CV (PDF, DOCX)</label>
                  <input
                    type="file"
                    className="form-input"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setResumeFile(e.target.files[0]);
                      }
                    }}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Supported formats: PDF, DOCX (Max 25 MB).
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Introduction / Why Dygytaly?</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Tell us briefly about your craft, software tools you enjoy, and what kind of projects excite you."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '12px' }}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting Application...' : (
                    <>
                      <Send size={18} /> Submit Application
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
