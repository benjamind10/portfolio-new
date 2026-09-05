import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import emailjs from '@emailjs/browser';
import Contact from '../../src/components/Contact';
import { CONTACT_COPY, PROFILE } from '../../src/content/profile';
import { getEmailConfig, type EmailConfig } from '../../src/utils/emailConfig';

// Keep every send off the network; the SDK would otherwise validate and post.
vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn() },
}));

const sendMock = vi.mocked(emailjs.send);

const CONFIG: EmailConfig = {
  serviceId: 'service_test',
  templateId: 'template_test',
  publicKey: 'public_test',
};

const mailtoCta = () =>
  screen.queryByRole('link', { name: CONTACT_COPY.mailto.label });

const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/your name/i), 'Ada');
  await user.type(screen.getByLabelText(/your email/i), 'ada@example.com');
  await user.type(screen.getByLabelText(/subject/i), 'Hello');
  await user.type(screen.getByLabelText(/message/i), 'Talk UNS?');
  await user.click(screen.getByRole('button', { name: /send message/i }));
};

/** Vite's built-in env keys plus the three EmailJS keys, unset unless overridden. */
const envWith = (
  overrides: Partial<
    Pick<
      ImportMetaEnv,
      | 'VITE_EMAILJS_SERVICE_ID'
      | 'VITE_EMAILJS_TEMPLATE_ID'
      | 'VITE_EMAILJS_PUBLIC_KEY'
    >
  >
): ImportMetaEnv => ({
  ...import.meta.env,
  VITE_EMAILJS_SERVICE_ID: undefined,
  VITE_EMAILJS_TEMPLATE_ID: undefined,
  VITE_EMAILJS_PUBLIC_KEY: undefined,
  ...overrides,
});

describe('getEmailConfig', () => {
  it('returns null unless all three keys are non-empty', () => {
    expect(getEmailConfig(envWith({}))).toBeNull();
    expect(
      getEmailConfig(
        envWith({
          VITE_EMAILJS_SERVICE_ID: 'a',
          VITE_EMAILJS_TEMPLATE_ID: 'b',
          VITE_EMAILJS_PUBLIC_KEY: '  ',
        })
      )
    ).toBeNull();
    expect(
      getEmailConfig(
        envWith({
          VITE_EMAILJS_SERVICE_ID: 'a',
          VITE_EMAILJS_TEMPLATE_ID: 'b',
          VITE_EMAILJS_PUBLIC_KEY: 'c',
        })
      )
    ).toEqual({ serviceId: 'a', templateId: 'b', publicKey: 'c' });
  });
});

describe('Contact', () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  it('renders a mailto CTA and no form when the EmailJS config is missing', () => {
    render(<Contact config={null} />);

    expect(mailtoCta()).toHaveAttribute(
      'href',
      `mailto:${PROFILE.links.email}`
    );
    expect(document.querySelector('form')).toBeNull();
  });

  it('renders the form and no mailto CTA when the config is complete', () => {
    render(<Contact config={CONFIG} />);

    expect(document.querySelector('form')).not.toBeNull();
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
    expect(mailtoCta()).toBeNull();
  });

  it('sends through the injected config, never import.meta.env', async () => {
    sendMock.mockResolvedValue({ status: 200, text: 'OK' });
    const user = userEvent.setup();
    render(<Contact config={CONFIG} />);

    await fillForm(user);

    await waitFor(() =>
      expect(screen.getByText(/message sent/i)).toBeInTheDocument()
    );
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(
      CONFIG.serviceId,
      CONFIG.templateId,
      {
        from_name: 'Ada',
        from_email: 'ada@example.com',
        subject: 'Hello',
        message: 'Talk UNS?',
      },
      CONFIG.publicKey
    );
  });

  it('shows the error state when the send rejects', async () => {
    sendMock.mockRejectedValue(new Error('rejected'));
    const user = userEvent.setup();
    render(<Contact config={CONFIG} />);

    await fillForm(user);

    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );
  });

  it('labels the social links and reads every href from PROFILE.links', () => {
    render(<Contact config={null} />);

    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      PROFILE.links.github
    );
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      PROFILE.links.linkedin
    );
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute(
      'href',
      `mailto:${PROFILE.links.email}`
    );
    // No phone number anywhere in the section (D8).
    expect(screen.queryByText(/\d{3}[.\-\s]\d{3}[.\-\s]\d{4}/)).toBeNull();
  });
});
