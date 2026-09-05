import React, { useState, type FormEvent } from 'react';
import { Mail, MapPin, Github, Linkedin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import FadeInWrapper from './common/FadeInWrapper';
import SectionHeader from './common/SectionHeader';
import { CONTACT_COPY, PROFILE } from '../content/profile';
import { getEmailConfig, type EmailConfig } from '../utils/emailConfig';

const SOCIAL_LINK_CLASS =
  'p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-indigo-400 hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all';

const BUTTON_CLASS =
  'inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-white text-sm font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all';

const PANEL_CLASS =
  'p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md shadow-indigo-500/5';

const LABEL_CLASS =
  'block text-sm font-medium mb-1 text-gray-900 dark:text-white';

const INPUT_CLASS =
  'w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

interface ContactFormProps {
  config: EmailConfig;
}

/** EmailJS-backed form. Only mounted when every key resolved at build time. */
const ContactForm: React.FC<ContactFormProps> = ({ config }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.send(
        config.serviceId,
        config.templateId,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        config.publicKey
      );
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${PANEL_CLASS} space-y-4`}>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className={LABEL_CLASS}>
            Your Name
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            required
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={LABEL_CLASS}>
            Your Email
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e =>
              setForm(prev => ({ ...prev, email: e.target.value }))
            }
            required
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={LABEL_CLASS}>
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          placeholder="Let's collaborate!"
          value={form.subject}
          onChange={e =>
            setForm(prev => ({ ...prev, subject: e.target.value }))
          }
          required
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={LABEL_CLASS}>
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Write your message here..."
          value={form.message}
          onChange={e =>
            setForm(prev => ({ ...prev, message: e.target.value }))
          }
          required
          className={INPUT_CLASS}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className={`w-full ${BUTTON_CLASS}`}
      >
        <Send size={16} className="mr-2" />
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'success' && (
        <p className="text-green-400 text-sm text-center">Message sent!</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
};

interface MailtoCtaProps {
  email: string;
}

/** Fallback when any EmailJS key is missing: never ship a form that always fails (D8). */
const MailtoCta: React.FC<MailtoCtaProps> = ({ email }) => (
  <div className={`${PANEL_CLASS} flex flex-col items-start gap-4`}>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      {CONTACT_COPY.mailto.lead}
    </p>
    <a href={`mailto:${email}`} className={BUTTON_CLASS}>
      <Mail size={16} className="mr-2" />
      {CONTACT_COPY.mailto.label}
    </a>
  </div>
);

interface ContactProps {
  /**
   * EmailJS credentials, or `null` to render the mailto fallback. Defaults to
   * the build-time env; tests inject it directly.
   */
  config?: EmailConfig | null;
}

const Contact: React.FC<ContactProps> = ({ config = getEmailConfig() }) => {
  const { links } = PROFILE;

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-gray-50/70 dark:bg-gray-800/30"
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        {/* Animated Title */}
        <FadeInWrapper>
          <SectionHeader
            title={CONTACT_COPY.title}
            subtitle={CONTACT_COPY.subtitle}
          />
        </FadeInWrapper>

        {/* Layout */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Contact Info */}
          <FadeInWrapper yOffset={30}>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {CONTACT_COPY.infoHeading}
              </h3>

              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <Mail className="text-indigo-500" size={16} />
                  <a
                    href={`mailto:${links.email}`}
                    className="rounded hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {links.email}
                  </a>
                </div>
                {links.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="text-indigo-500" size={16} />
                    <span>{links.location}</span>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
                  {CONTACT_COPY.connectHeading}
                </h4>
                <div className="flex gap-4">
                  <a
                    href={links.github}
                    aria-label="GitHub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={SOCIAL_LINK_CLASS}
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={links.linkedin}
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={SOCIAL_LINK_CLASS}
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href={`mailto:${links.email}`}
                    aria-label="Email"
                    className={SOCIAL_LINK_CLASS}
                  >
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </div>
          </FadeInWrapper>

          {/* Right: form when EmailJS is configured, otherwise a mailto CTA */}
          <FadeInWrapper delay={0.2} yOffset={30}>
            {config ? (
              <ContactForm config={config} />
            ) : (
              <MailtoCta email={links.email} />
            )}
          </FadeInWrapper>
        </div>
      </div>
    </section>
  );
};

export default Contact;
