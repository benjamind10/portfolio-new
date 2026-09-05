import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface CarouselImage {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: readonly CarouselImage[];
  /** Accessible name for the lightbox dialog, e.g. the study title. */
  label: string;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const NAV_BUTTON_CLASS =
  'rounded-full bg-black/40 p-2 text-white transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black/80';

const FOCUSABLE =
  'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, label }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const prev = () => {
    setDirection(-1);
    setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setDirection(1);
    setIndex(i => (i === images.length - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    if (!modalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    document.addEventListener('keydown', onKey);
    // Open: focus lands on the close button. Close: focus returns to the
    // thumbnail that opened the dialog.
    const opener = openerRef.current;
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [modalOpen]);

  /** Keep Tab / Shift+Tab cycling inside the dialog while it is open. */
  const trapFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (
      e.shiftKey &&
      (active === first || !dialogRef.current.contains(active))
    ) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full overflow-hidden rounded border border-gray-300 shadow dark:border-gray-700">
        <button
          ref={openerRef}
          type="button"
          aria-label={`Open ${images[index].alt} full size`}
          onClick={() => setModalOpen(true)}
          className="block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={index}
              src={images[index].src}
              alt={images[index].alt}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="w-full object-contain"
            />
          </AnimatePresence>
        </button>

        <button
          type="button"
          aria-label="Previous image"
          onClick={prev}
          className={`absolute left-2 top-1/2 -translate-y-1/2 ${NAV_BUTTON_CLASS}`}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={next}
          className={`absolute right-2 top-1/2 -translate-y-1/2 ${NAV_BUTTON_CLASS}`}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <span className="text-sm text-gray-500 dark:text-gray-400">
        {index + 1} / {images.length}
      </span>
      {modalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key="lightbox-backdrop"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              onKeyDown={trapFocus}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80"
              onClick={() => setModalOpen(false)}
            >
              <button
                ref={closeRef}
                type="button"
                aria-label="Close"
                onClick={e => {
                  e.stopPropagation();
                  setModalOpen(false);
                }}
                className={`absolute right-4 top-4 ${NAV_BUTTON_CLASS}`}
              >
                <X size={24} aria-hidden="true" />
              </button>

              <button
                type="button"
                aria-label="Previous image"
                onClick={e => {
                  e.stopPropagation();
                  prev();
                }}
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${NAV_BUTTON_CLASS}`}
              >
                <ChevronLeft size={28} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={e => {
                  e.stopPropagation();
                  next();
                }}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${NAV_BUTTON_CLASS}`}
              >
                <ChevronRight size={28} aria-hidden="true" />
              </button>

              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.img
                  key={index}
                  src={images[index].src}
                  alt={images[index].alt}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                  onClick={e => e.stopPropagation()}
                />
              </AnimatePresence>

              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-300">
                {index + 1} / {images.length}
              </span>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

export default ImageCarousel;
