import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import FadeInWrapper from './common/FadeInWrapper';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-[#0f111a] border-t border-gray-200 dark:border-gray-700">
      <FadeInWrapper>
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400">
          {/* Branding + Blurb */}
          <div className="text-center md:text-left">
            <p className="text-xl font-bold text-indigo-500">BD.</p>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Manufacturing systems, data flow, and practical delivery
            </p>
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Ben Duran · Built with React + Tailwind
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 justify-center">
            <a
              href="https://github.com/benjamind10"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-indigo-400 hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com/in/benjamin-duran-3a880a1b9"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-indigo-400 hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:ben.duran@proton.me"
              aria-label="Email"
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-indigo-400 hover:bg-gray-300 dark:hover:bg-gray-700 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </FadeInWrapper>
    </footer>
  );
};

export default Footer;
