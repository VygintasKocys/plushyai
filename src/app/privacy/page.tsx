import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Plushify",
  description: "Learn how Plushify collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: March 1, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold mb-3">
              Information We Collect
            </h2>
            <p className="mb-2">
              When you use Plushify, we may collect the following types of
              information:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>
                Account information such as your name, email address, and
                password
              </li>
              <li>
                Photos you upload for plushie generation (processed and
                temporarily stored)
              </li>
              <li>
                Usage data including generation history, credit usage, and
                preferences
              </li>
              <li>
                Technical data such as browser type, IP address, and device
                information
              </li>
              <li>Payment information processed securely through our payment provider</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">
              How We Use Your Information
            </h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Provide and improve the Plushify service</li>
              <li>Process your photo transformations</li>
              <li>Manage your account and subscription</li>
              <li>Send important service updates and notifications</li>
              <li>Analyze usage patterns to improve our AI models</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Data Storage</h2>
            <p className="text-muted-foreground">
              Your data is stored on secure servers with industry-standard
              encryption. Uploaded photos are processed in real-time and
              temporarily cached for up to 24 hours to allow you to download
              your results. After that period, original uploads are
              automatically deleted. Generated plushie images saved to your
              gallery are retained for as long as your account is active.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
            <p className="text-muted-foreground">
              We use trusted third-party services to operate Plushify, including
              cloud hosting providers, payment processors, and analytics tools.
              These services have access only to the data necessary to perform
              their functions and are bound by contractual obligations to protect
              your information. We do not sell your personal data to any third
              party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of non-essential communications</li>
              <li>Withdraw consent for data processing at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              If you have questions about this privacy policy or how we handle
              your data, please contact us at{" "}
              <a href="mailto:privacy@plushify.com" className="text-primary hover:underline">privacy@plushify.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
