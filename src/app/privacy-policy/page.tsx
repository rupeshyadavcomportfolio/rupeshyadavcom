import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Rupesh Yadav',
  description: 'Privacy policy for rupeshyadav.com.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
          PRIVACY POLICY
        </h1>
        <p className="text-xs text-neutral-500 uppercase tracking-wider">
          Last updated: October 2026
        </p>

        <div className="prose dark:prose-invert text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 space-y-4">
          <p>
            This website is the personal portfolio of Rupesh Yadav (@rupeshyadavcom). Your privacy is respected, and no personal data is collected beyond what you voluntarily provide through the direct contact form.
          </p>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 uppercase">Information Collected</h2>
          <p>
            When you submit a project inquiry via the contact form, we collect your name, email, phone number (if provided), company, and message details solely for responding to your inquiry.
          </p>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 uppercase">Analytics</h2>
          <p>
            Anonymous, privacy-preserving metrics may be used to understand aggregate visitor counts and popular portfolio projects without storing personally identifiable information.
          </p>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 uppercase">Contact</h2>
          <p>
            For any inquiries regarding this policy, reach out to contact@rupeshyadav.com or +91 8839775265.
          </p>
        </div>
      </div>
    </div>
  );
}
