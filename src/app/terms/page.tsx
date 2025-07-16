import { Icons } from "@/components/icons";
import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <Link href="/" className="flex items-center gap-2 text-primary">
            <Icons.Logo className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground">
            Mishra Studios
            </span>
        </Link>
        <div className="flex-1" />
         <Link href="/dashboard">
            <span className="text-sm font-medium text-primary hover:underline">Back to App</span>
        </Link>
      </header>
      <main className="container mx-auto max-w-4xl py-12 px-4">
        <h1 className="text-4xl font-bold mb-6">Terms of Use</h1>
        <div className="space-y-6 text-muted-foreground">
          <p>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p>
            Please read these Terms of Use ("Terms", "Terms of Use") carefully
            before using the Mishra Studios application (the "Service")
            operated by Mishra Studios ("us", "we", or "our").
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">1. Accounts</h2>
          <p>
            When you create an account with us, you must provide us with
            information that is accurate, complete, and current at all times.
            Failure to do so constitutes a breach of the Terms, which may
            result in immediate termination of your account on our Service.
          </p>
          
          <h2 className="text-2xl font-semibold text-foreground pt-4">2. Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">3. Intellectual Property</h2>
          <p>
            The Service and its original content, features and functionality are and will remain the exclusive property of Mishra Studios and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">4. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">5. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the jurisdiction, without regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">6. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2 className="text-2xl font-semibold text-foreground pt-4">Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@mishra-studios.example.com.
          </p>
        </div>
      </main>
    </div>
  );
}
