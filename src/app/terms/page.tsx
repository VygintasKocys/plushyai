import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Plushify",
  description: "Terms and conditions for using the Plushify service.",
};

export default function TermsPage() {
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: March 1, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using Plushify, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do
              not use our service. We reserve the right to update these terms at
              any time, and continued use of the service constitutes acceptance
              of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Service Description</h2>
            <p className="text-muted-foreground">
              Plushify is an AI-powered service that transforms user-uploaded
              photos into plushie-style images. The service is provided on a
              credit-based subscription model. Results may vary depending on
              input image quality, selected style, and other factors. We
              continually work to improve output quality but do not guarantee
              specific results.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">User Accounts</h2>
            <p className="text-muted-foreground">
              You must create an account to use Plushify. You are responsible
              for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account. You must
              provide accurate and complete information when creating your
              account and keep it up to date. We reserve the right to suspend
              or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              Credits and Payments
            </h2>
            <p className="text-muted-foreground">
              Plushify operates on a credit-based system. Credits are purchased
              through monthly subscription plans. Each generation consumes one
              credit. Credits reset at the beginning of each billing cycle and
              unused credits do not roll over. All payments are processed
              securely and are non-refundable except as required by applicable
              law or as described in our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              Intellectual Property
            </h2>
            <p className="text-muted-foreground">
              You retain ownership of the photos you upload. By uploading
              content, you grant Plushify a limited license to process your
              photos for the purpose of generating plushie transformations. You
              own the generated plushie images and may use them for personal or
              commercial purposes. The Plushify service, branding, and
              underlying technology remain the intellectual property of
              Plushify.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground">
              Plushify is provided &ldquo;as is&rdquo; without warranties of
              any kind. We are not liable for any indirect, incidental, special,
              or consequential damages arising from your use of the service. Our
              total liability shall not exceed the amount you paid for the
              service in the twelve months preceding any claim. This limitation
              applies to the fullest extent permitted by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Termination</h2>
            <p className="text-muted-foreground">
              You may cancel your subscription and delete your account at any
              time. We reserve the right to suspend or terminate your account
              if you violate these terms, engage in abusive behavior, or use
              the service for prohibited purposes. Upon termination, your
              access to the service and any stored data will be removed in
              accordance with our data retention policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              For questions about these terms, please contact us at{" "}
              <a href="mailto:legal@plushify.com" className="text-primary hover:underline">legal@plushify.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
