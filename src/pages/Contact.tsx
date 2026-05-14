import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Loader2, Mail, Phone, MapPin, ChevronDown, ShieldCheck } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMeta } from '../hooks/useMeta';
import { useSettings } from '../hooks/useData';

export default function Contact() {
  usePageTitle('Kontakt');
  useMeta({
    title: 'Kontakt — Projekt anfragen',
    description: 'Starten Sie Ihr digitales Projekt. Kontaktieren Sie OK Studio in Kreuztal für Web-Relaunch, Entwicklung und KI-Integration.',
    url: '/contact',
  });
  const [searchParams] = useSearchParams();
  const { get } = useSettings();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    projectType: 'Project Design',
    budget: 'Tier 1 (unter 5k)',
    startDate: '',
    message: ''
  });

  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (searchParams.get('audit') === 'true') {
      setFormState(prev => ({
        ...prev,
        subject: 'KOSTENLOSER_AUDIT_ANFRAGE_V3.4',
        message: 'Ich interessiere mich für einen kostenlosen Website-Performance Check für mein Unternehmen.'
      }));
    }
  }, [searchParams]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formState.name.trim()) newErrors.name = 'ERR_NAME_REQUIRED';
    if (!formState.email.trim()) {
      newErrors.email = 'ERR_EMAIL_REQUIRED';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'ERR_INVALID_FORMAT';
    }
    if (!formState.message.trim()) newErrors.message = 'ERR_EMPTY_BUFFER';
    if (!consent) newErrors.consent = 'ERR_CONSENT_REQUIRED';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formState, timestamp: new Date().toISOString() })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStatus('success');
        setErrors({});
        setFormState({ name: '', email: '', subject: '', projectType: 'Project Design', budget: 'Tier 1 (unter 5k)', startDate: '', message: '' });
        setConsent(false);
      } else {
        console.error('API error:', data);
        setStatus('error');
        setErrors({ submit: data.hint || data.error || 'Fehler beim Senden' });
      }
    } catch (err) {
      console.error('Submit error:', err);
      setStatus('error');
      setErrors({ submit: 'Netzwerkfehler. Bitte versuchen Sie es später erneut.' });
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full border border-[#C5C5C5] p-12 bg-white text-center shadow-2xl"
        >
          <CheckCircle2 size={48} className="mx-auto mb-6 text-[#616752]" />
          <h1 className="display-serif text-3xl mb-4 font-bold">Vielen Dank!</h1>
          <p className="font-mono text-xs opacity-60 mb-8 leading-relaxed">Ihre Nachricht wurde erfolgreich an das OK-System übertragen. Unser Expertenteam wird Ihre Anfrage prüfen und sich innerhalb von 24 Stunden bei Ihnen melden.</p>
          <button
            onClick={() => setStatus('idle')}
            className="w-full bg-[#616752] text-white py-4 font-mono text-[10px] tracking-[0.3em]"
          >
            NEUE NACHRICHT SENDEN
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-24 grid grid-cols-12 min-h-screen">

      {/* Left panel */}
      <div className="col-span-12 lg:col-span-5 p-12 border-b lg:border-b-0 lg:border-r border-[#C5C5C5] bg-[#F1F3EA]">
        <div className="sticky top-24">
          <span className="telemetry-label mb-6 block font-bold">KONTAKT_PROTOKOLL</span>
          <h1 className="font-display font-black text-5xl mb-8 leading-none tracking-tight uppercase">
            LASSEN SIE UNS ETWAS <span className="italic underline">AUßERGEWÖHNLICHES</span> BAUEN.
          </h1>
          <p className="body-md text-gray-600 mb-12 max-w-md">
            Egal ob Sie ein Startup gründen oder ein etabliertes Unternehmen transformieren – wir sind bereit für die Herausforderung.
          </p>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 border border-[#C5C5C5] flex items-center justify-center bg-white"><Mail size={18} /></div>
              <div>
                <span className="telemetry-label opacity-40 text-[9px] block">DIRECT_EMAIL</span>
                <span className="font-mono text-sm">{get('contact_email', 'hello@webstudio-ok.de')}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 border border-[#C5C5C5] flex items-center justify-center bg-white"><Phone size={18} /></div>
              <div>
                <span className="telemetry-label opacity-40 text-[9px] block">HOTLINE</span>
                <span className="font-mono text-sm">{get('contact_phone', '+49 (0) 2732 123 456')}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 border border-[#C5C5C5] flex items-center justify-center bg-white"><MapPin size={18} /></div>
              <div>
                <span className="telemetry-label opacity-40 text-[9px] block">NODE_LOCATION</span>
                <span className="font-mono text-sm">{get('contact_location', 'Kreuztal, NRW, Deutschland')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="col-span-12 lg:col-span-7 p-12 lg:p-16 bg-white flex flex-col items-center">
        <form onSubmit={handleSubmit} noValidate className="w-full max-w-2xl">
          <div className="space-y-6">

            {/* 01 Name + 02 Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="cf-group">
                <div className="cf-label-row">
                  <label className="cf-label">01 — NAME</label>
                  {errors.name && <span className="cf-error">{errors.name}</span>}
                </div>
                <input
                  placeholder="Vollständiger Name"
                  className={`cf-input${errors.name ? ' cf-input--error' : ''}`}
                  value={formState.name}
                  onChange={e => { setFormState({...formState, name: e.target.value}); if (errors.name) setErrors({...errors, name: ''}); }}
                />
              </div>
              <div className="cf-group">
                <div className="cf-label-row">
                  <label className="cf-label">02 — E-MAIL</label>
                  {errors.email && <span className="cf-error">{errors.email}</span>}
                </div>
                <input
                  type="email"
                  placeholder="mail@beispiel.de"
                  className={`cf-input${errors.email ? ' cf-input--error' : ''}`}
                  value={formState.email}
                  onChange={e => { setFormState({...formState, email: e.target.value}); if (errors.email) setErrors({...errors, email: ''}); }}
                />
              </div>
            </div>

            {/* 03 Subject */}
            <div className="cf-group">
              <label className="cf-label">03 — BETREFF</label>
              <input
                placeholder="Worum geht es in Ihrem Projekt?"
                className="cf-input"
                value={formState.subject}
                onChange={e => setFormState({...formState, subject: e.target.value})}
              />
            </div>

            {/* 04 Category + 05 Budget + 06 Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="cf-group">
                <label className="cf-label">04 — KATEGORIE</label>
                <div className="relative">
                  <select
                    className="cf-input pr-8 cursor-pointer"
                    value={formState.projectType}
                    onChange={e => setFormState({...formState, projectType: e.target.value})}
                    style={{ backgroundColor: '#F1F3EA' }}
                  >
                    <option>Project Design</option>
                    <option>System Dev</option>
                    <option>Automation</option>
                    <option>AI Logic</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                </div>
              </div>
              <div className="cf-group">
                <label className="cf-label">05 — BUDGET</label>
                <div className="relative">
                  <select
                    className="cf-input pr-8 cursor-pointer"
                    value={formState.budget}
                    onChange={e => setFormState({...formState, budget: e.target.value})}
                    style={{ backgroundColor: '#F1F3EA' }}
                  >
                    <option>Tier 1 (unter 5k)</option>
                    <option>Tier 2 (5k - 10k)</option>
                    <option>Tier 3 (10k - 25k)</option>
                    <option>Tier 4 (25k+)</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                </div>
              </div>
              <div className="cf-group">
                <label className="cf-label">06 — START</label>
                <input
                  type="text"
                  placeholder="TT.MM.JJJJ"
                  className="cf-input"
                  value={formState.startDate}
                  onChange={e => setFormState({...formState, startDate: e.target.value})}
                />
              </div>
            </div>

            {/* 07 Message */}
            <div className="cf-group">
              <div className="cf-label-row">
                <label className="cf-label">07 — NACHRICHT</label>
                {errors.message && <span className="cf-error">{errors.message}</span>}
              </div>
              <textarea
                placeholder="Erzählen Sie mir von Ihrem Projekt, Ihren Zielen und Herausforderungen..."
                className={`cf-input cf-textarea${errors.message ? ' cf-input--error' : ''}`}
                value={formState.message}
                onChange={e => { setFormState({...formState, message: e.target.value}); if (errors.message) setErrors({...errors, message: ''}); }}
              />
            </div>

            {/* Consent */}
            <div className={`p-4 border-l-4 ${errors.consent ? 'border-l-red-500 border border-red-200 bg-red-50' : 'border-l-[#616752] border border-[#C5C5C5] bg-[#F1F3EA]'} transition-colors`}>
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="flex items-center pt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={consent}
                    onChange={e => { setConsent(e.target.checked); if (errors.consent) setErrors({...errors, consent: ''}); }}
                  />
                  <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${consent ? 'bg-[#616752] border-[#616752]' : 'border-[#616752]/40 bg-white group-hover:border-[#616752]'}`}>
                    {consent && <ShieldCheck size={11} className="text-white" />}
                  </div>
                </div>
                <div>
                  <span className="font-mono text-[10px] tracking-widest uppercase block mb-1 text-[#616752]">DATENSCHUTZ-ZUSTIMMUNG</span>
                  <p className="text-[10px] leading-relaxed text-[#616752]/60">
                    Ich willige ein, dass meine Angaben zur Kontaktaufnahme dauerhaft gespeichert werden. Ich habe die{' '}
                    <Link to="/privacy" className="underline hover:text-[#141414]">Datenschutzerklärung</Link> gelesen.
                  </p>
                </div>
              </label>
            </div>

          </div>

          {/* Error message */}
          {status === 'error' && errors.submit && (
            <div className="mt-6 p-4 border-l-4 border-l-red-500 border border-red-200 bg-red-50">
              <p className="font-mono text-xs text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Submit */}
          <button
            disabled={status === 'submitting'}
            type="submit"
            className="w-full mt-8 bg-[#616752] text-white py-6 font-mono text-[11px] tracking-[0.4em] flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50 group shadow-xl"
          >
            {status === 'submitting' ? <Loader2 className="animate-spin" size={18} /> : (
              <>PROTOKOLL_SENDEN <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
            )}
          </button>
        </form>
      </div>

      <style>{`
        .cf-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .cf-label-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .cf-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #616752;
          font-weight: 700;
        }
        .cf-error {
          font-family: var(--font-mono);
          font-size: 8px;
          color: #ef4444;
        }
        .cf-input {
          width: 100%;
          box-sizing: border-box;
          background: #F1F3EA;
          border: 1px solid #C5C5C5;
          border-bottom: 1px solid #616752;
          padding: 11px 13px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: #141414;
          outline: none;
          border-radius: 0;
          appearance: none;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
        }
        .cf-input:focus {
          background: #ffffff;
          border-color: #616752;
          border-bottom-color: #616752;
          box-shadow: inset 3px 0 0 #616752;
        }
        .cf-input:not(:placeholder-shown) {
          background: #ffffff;
        }
        select.cf-input {
          background: #F1F3EA;
        }
        select.cf-input:focus {
          background: #ffffff;
        }
        .cf-input--error {
          background: #fef2f2;
          border-color: #fca5a5;
          border-bottom-color: #ef4444;
        }
        .cf-input--error:focus {
          box-shadow: inset 3px 0 0 #ef4444;
        }
        .cf-input::placeholder {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 13px;
          color: #616752;
          opacity: 0.45;
        }
        .cf-textarea {
          height: 200px;
          resize: none;
        }
        select.cf-input option {
          background: #ffffff;
          color: #141414;
        }
      `}</style>
    </div>
  );
}
