/**
 * Resolves the EmailJS credentials the Contact form needs. Vite inlines
 * `import.meta.env.VITE_*` at build time, so the result is fixed per build:
 * a full config means the form can send; `null` means Contact must fall back
 * to a mailto CTA rather than ship a submit that always rejects (design D8).
 */
export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export function getEmailConfig(
  env: ImportMetaEnv = import.meta.env
): EmailConfig | null {
  const serviceId = env.VITE_EMAILJS_SERVICE_ID?.trim();
  const templateId = env.VITE_EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = env.VITE_EMAILJS_PUBLIC_KEY?.trim();
  if (!serviceId || !templateId || !publicKey) return null;
  return { serviceId, templateId, publicKey };
}
