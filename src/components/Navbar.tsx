import React, { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useActiveSection } from '../hooks/useActiveSection';
import { NAV_SECTIONS, SECTION_IDS } from '../content/sections';
import { cn } from '../utils/cn';

const LINK_CLASS =
  'text-sm font-medium hover:text-indigo-500 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 cursor-pointer transition-colors duration-200';

const ICON_BUTTON_CLASS =
  'p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-all';

const Navbar: React.FC = () => {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);

  const renderLinks = (onNavigate?: () => void) =>
    NAV_SECTIONS.map(({ id, label }) => {
      const isActive = activeId === id;
      return (
        <a
          key={id}
          href={`#${id}`}
          aria-current={isActive ? 'true' : undefined}
          onClick={onNavigate}
          className={cn(
            LINK_CLASS,
            isActive
              ? 'text-indigo-500 dark:text-indigo-400'
              : 'text-gray-700 dark:text-gray-200'
          )}
        >
          {label}
        </a>
      );
    });

  const themeButton = (
    <button
      onClick={toggle}
      className={ICON_BUTTON_CLASS}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a
          href="#hero"
          className="text-xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer"
        >
          BD
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-6">
          {renderLinks()}
          {themeButton}
        </div>

        {/* Mobile menu icon */}
        <div className="md:hidden flex items-center space-x-4">
          {themeButton}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={ICON_BUTTON_CLASS}
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-4 mt-4">
            {renderLinks(() => setMenuOpen(false))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
