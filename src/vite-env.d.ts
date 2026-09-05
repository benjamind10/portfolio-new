/// <reference types="vite/client" />

/**
 * Build-time env contract. All three EmailJS keys are optional: when any is
 * missing, Contact renders a mailto CTA instead of the form (design D8).
 * Read them through `getEmailConfig()` in `src/utils/emailConfig.ts`, not
 * directly. Documented in `.env.example`.
 */
interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
}
