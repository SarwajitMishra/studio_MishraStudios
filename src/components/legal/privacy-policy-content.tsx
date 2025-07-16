
'use client';

export function PrivacyPolicyContent() {
  return (
    <div className="space-y-6 text-muted-foreground">
        <p>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <p>
            Mishra Studios ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our application.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">1. Information We Collect</h2>
        <p>
            We may collect personal information that you provide to us directly,
            such as your name, email address, and payment information when you
            register for an account or make a purchase. We also collect
            information automatically as you navigate the site, such as your IP
            address and browsing behavior.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">2. How We Use Your Information</h2>
        <p>
            We use the information we collect to:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Provide, operate, and maintain our services.</li>
            <li>Improve, personalize, and expand our services.</li>
            <li>Understand and analyze how you use our services.</li>
            <li>Process your transactions and manage your orders.</li>
            <li>Communicate with you, either directly or through one of our partners.</li>
            <li>Send you emails and other marketing communications.</li>
            <li>Find and prevent fraud.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground pt-4">3. Sharing Your Information</h2>
        <p>
            We do not share your personal information with third parties except
            as described in this Privacy Policy. We may share information with
            vendors, service providers, and other third parties who need access
            to such information to carry out work on our behalf.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">4. Your Data Rights</h2>
        <p>
            Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete the information we have on you.
        </p>

        <h2 className="text-2xl font-semibold text-foreground pt-4">5. Contact Us</h2>
        <p>
            If you have any questions about this Privacy Policy, please contact
            us at support@mishra-studios.example.com.
        </p>
    </div>
  );
}
