import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Plushify",
  description:
    "Frequently asked questions about Plushify, credits, image quality, and more.",
};

const faqs = [
  {
    question: "What image formats are supported?",
    answer:
      "Plushify accepts JPEG, PNG, and WebP images up to 10MB in size. For best results, use a high-resolution photo (at least 512x512 pixels) with good lighting and a clear subject. Transparent PNG backgrounds are supported but the AI works best with a visible background for context.",
  },
  {
    question: "How long does generation take?",
    answer:
      "Most generations complete in 10 to 30 seconds. Processing time varies slightly depending on the style selected and current server load. Kawaii and Chibi styles tend to be fastest, while Realistic Plush may take a few extra seconds for the additional detail.",
  },
  {
    question: "Can I get a refund on credits?",
    answer:
      "Individual credit refunds are not available since credits are consumed at the time of generation. However, we offer a 7-day money-back guarantee on all subscription plans. If you are not satisfied with the service within your first week, contact support for a full refund.",
  },
  {
    question: "What determines image quality?",
    answer:
      "Output quality depends on your plan tier. Basic plans export at 720p, Pro at 1080p, and Elite at 4K resolution. The quality of your input photo also matters — well-lit, high-resolution photos with a clear subject produce the best plushie transformations.",
  },
  {
    question: "How is my data and privacy handled?",
    answer:
      "We take privacy seriously. Uploaded photos are processed in real-time and temporarily cached for up to 24 hours to allow you to download results. After that, original uploads are automatically deleted. Generated images saved to your gallery are retained for as long as your account is active. We never sell your data to third parties. See our Privacy Policy for full details.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Yes, you can delete your account at any time from your Profile page. Account deletion is permanent and removes all your data, including saved gallery images, generation history, and personal information. Any remaining credits or active subscription will be forfeited. This action cannot be undone.",
  },
  {
    question: "Can I use generated images commercially?",
    answer:
      "Yes. All images you generate with Plushify are yours to use for personal or commercial purposes. This includes social media, printed merchandise, marketing materials, and more. We do not claim any ownership of your generated content.",
  },
  {
    question: "What happens if generation fails?",
    answer:
      "In the rare event a generation fails due to a server error, your credit will be automatically refunded to your account within a few minutes. If the failure was caused by an unsupported image (e.g., corrupted file), the credit is still consumed. Contact support if you believe a credit was incorrectly deducted.",
  },
];

export default function FaqPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">
        Find answers to common questions about using Plushify.
      </p>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group border rounded-lg overflow-hidden"
          >
            <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-medium hover:bg-muted/50 transition-colors">
              {faq.question}
              <span className="text-muted-foreground transition-transform group-open:rotate-180 ml-2 shrink-0">
                &#9662;
              </span>
            </summary>
            <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
