import React, { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import FadeInWrapper from './common/FadeInWrapper';
import SectionHeader from './common/SectionHeader';

const Contact: React.FC = () => {
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
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        {/* Animated Title */}
        <FadeInWrapper>
          <SectionHeader
            title="Get In Touch"
            subtitle="Have a plant-floor data, Ignition, or MES challenge worth talking through? Let's connect."
          />
        </FadeInWrapper>

        {/* Layout */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left: Contact Info */}
          <FadeInWrapper yOffset={30}>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>

              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-3">
                  <Mail className="text-indigo-500" size={16} />
                  <span>ben.duran@proton.me</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-indigo-500" size={16} />
                  <span>201.496.8838</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-indigo-500" size={16} />
                  <span>Richmond, VA</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
                  Connect with me
                </h4>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/benjamind10"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-indigo-400 hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/benjamin-duran-3a880a1b9/"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-indigo-400 hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href="mailto:ben.duran@proton.me"
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-indigo-400 hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all"
                  >
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </div>
          </FadeInWrapper>

          {/* Right: Contact Form */}
          <FadeInWrapper delay={0.2} yOffset={30}>
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-4 shadow-md shadow-indigo-500/5"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e =>
                      setForm(prev => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                    Your Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e =>
                      setForm(prev => ({ ...prev, email: e.target.value }))
                    }
                    required
                    className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Let's collaborate!"
                  value={form.subject}
                  onChange={e =>
                    setForm(prev => ({ ...prev, subject: e.target.value }))
                  }
                  required
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={e =>
                    setForm(prev => ({ ...prev, message: e.target.value }))
                  }
                  required
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-white text-sm font-medium rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all"
              >
                <Send size={16} className="mr-2" />
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="text-green-400 text-sm text-center">
                  Message sent!
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-sm text-center">
                  Something went wrong. Try again.
                </p>
              )}
            </form>
          </FadeInWrapper>
        </div>
      </div>
    </section>
  );
};

export default Contact;
