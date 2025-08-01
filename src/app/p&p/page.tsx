// src/app/privacy/page.tsx

import Header from "@/components/header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4">
        <article className="max-w-5xl mx-auto bg-card rounded-lg shadow-sm p-6 md:p-8">
          <header className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Privacy Policy
            </h1>
            <div className="text-sm text-muted-foreground">
              <p>Effective Date: July 14, 2025</p>
              <p>Last Updated: July 30, 2025</p>
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              1. Introduction
            </h2>
            <p className="mb-4">
              This Privacy Policy explains how GameStash.net (“we”, “us”, or
              “our”) collects, processes, stores, and protects personal data in
              accordance with the General Data Protection Regulation (GDPR) and
              other applicablelaws. By using our services, you agree to the
              terms of this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              2. About Us
            </h2>
            <ul className="space-y-2 mb-4">
              <li>
                <strong>Website:</strong> https://gamestash.net
              </li>
              <li>
                <strong>Operator:</strong> William Kærgaard Thomassen
              </li>
              <li>
                <strong>Legal status:</strong> Sole proprietorship, not
                registered with CVR
              </li>
              <li>
                <strong>Country of operation:</strong> Denmark
              </li>
              <li>
                <strong>Address:</strong> Vingevej 60, Denmark
              </li>
              <li>
                <strong>Email:</strong> wiliamkaergaardthomassen07@gmail.com
              </li>
              <li>
                <strong>Data controller under GDPR:</strong> William Kærgaard
                Thomassen
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              3. Audience and Use Restrictions
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Our platform is open globally</li>
              <li>Intended for users aged 15 and up</li>
              <li>
                Users under 18 must obtain parental or guardian consent before
                using the platform or submitting personal data
              </li>
              <li>
                Parental requests for data access or deletion must be submitted
                via email or Discord support ticket
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              4. Types of Users
            </h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Guest (limited access)</li>
              <li>Buyer (must log in to purchase)</li>
              <li>Seller (must log in to upload content)</li>
              <li>Admin</li>
            </ul>
            <p>
              A registered account is required for buying or uploading products.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              5. Data We Collect
            </h2>
            <p className="mb-4">We collect the following personal data:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                User profile: ID, username, email, display name, profile image,
                bio
              </li>
              <li>
                Account metadata: verification status, roles, developer flag,
                banned flag, featured flag, timestamps
              </li>
              <li>
                Social links: Website, Twitter, YouTube, Twitch, Instagram,
                country
              </li>
              <li>
                Product stats: total products, sales, revenue, views, likes,
                rating
              </li>
              <li>
                Preferences: profile visibility, email settings, marketing
                preferences
              </li>
              <li>Security: hashed password, Stripe ID</li>
              <li>Uploads: all files submitted by sellers</li>
            </ul>
            <p>
              We do not collect or log IP addresses, use browser cookies, or
              perform analytics directly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              6. Third-Party Services and Data Storage
            </h2>
            <p className="mb-4">We use the following third-party services:</p>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left">
                      Service
                    </th>
                    <th className="border border-border px-4 py-2 text-left">
                      Purpose
                    </th>
                    <th className="border border-border px-4 py-2 text-left">
                      Region
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2">Stripe</td>
                    <td className="border border-border px-4 py-2">
                      Payment processing
                    </td>
                    <td className="border border-border px-4 py-2">EU/EEA</td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border px-4 py-2">Supabase</td>
                    <td className="border border-border px-4 py-2">
                      Database management
                    </td>
                    <td className="border border-border px-4 py-2">
                      EU (West Europe)
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2">AWS</td>
                    <td className="border border-border px-4 py-2">
                      Cloud storage
                    </td>
                    <td className="border border-border px-4 py-2">
                      West Europe
                    </td>
                  </tr>
                  <tr className="bg-muted/50">
                    <td className="border border-border px-4 py-2">
                      Cloudinary
                    </td>
                    <td className="border border-border px-4 py-2">
                      Media hosting
                    </td>
                    <td className="border border-border px-4 py-2">
                      West Europe
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2">Vercel</td>
                    <td className="border border-border px-4 py-2">
                      Website deployment
                    </td>
                    <td className="border border-border px-4 py-2">
                      West Europe
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-muted/50 rounded border border-border">
              <p className="mb-2">
                <strong>Please note:</strong>
              </p>
              <p>
                While we do not use cookies ourselves, third-party providers
                such as Stripe, Vercel, and Cloudinary may set cookies or log IP
                addresses as part of their security and operational needs. These
                are outside our direct control. We encourage users to review the
                privacy policies of these services.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              7. Purpose of Data Processing
            </h2>
            <p className="mb-4">We use your data solely to:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                Provide platform functionality (browsing, buying, and selling)
              </li>
              <li>Allow users to manage accounts and uploads</li>
              <li>Support moderation, fraud prevention, and compliance</li>
              <li>
                Enable developer discovery (if user consents to being listed)
              </li>
            </ul>
            <p>
              We do not use personal data for advertising, tracking, or
              profiling purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              8. Automated Processing
            </h2>
            <p className="mb-4">
              Some platform functionality includes automated features such as:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                Sorting and displaying developers on a public page (only for
                users who opt in under settings)
              </li>
              <li>Flagging featured users based on role and account status</li>
            </ul>
            <p>
              This does not involve profiling or decision-making with legal
              effects.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              9. User Rights under GDPR
            </h2>
            <p className="mb-4">
              You have the following rights under the General Data Protection
              Regulation (EU) 2016/679:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>Right to access</strong> – You may request a copy of
                your personal data
              </li>
              <li>
                <strong>Right to rectification</strong> – You may request
                corrections to inaccurate data
              </li>
              <li>
                <strong>Right to erasure</strong> – You can delete your account
                and all associated data via: {""}
                <a
                  href="https://gamestash.net/accounts"
                  className="text-primary hover:underline"
                >
                  https://gamestash.net/accounts
                </a>
              </li>
              <li>
                <strong>Right to data portability</strong> – Currently not
                available via self-service, but you may request a data export by
                contacting us at gamestash.net@gmail.com
              </li>
              <li>
                <strong>Right to object or restrict processing</strong> – You
                may contact us if you believe your data is being misused
              </li>
            </ul>
            <p>We respond to all rights requests within 30 days.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              10. Data Retention and Deletion
            </h2>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>Active accounts:</strong> Data is stored as long as the
                account remains active
              </li>
              <li>
                <strong>Deleted accounts:</strong> Data is permanently deleted
                immediately after the user initiates account deletion
              </li>
              <li>
                <strong>Backups:</strong> Stored in accordance with third-party
                provider retention policies (typically &lt;30 days) – specific
                retention period unknown
              </li>
            </ul>
            <p>We do not currently delete inactive accounts automatically.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              11. International Data Transfers
            </h2>
            <p className="mb-4">
              GameStash.net has users globally, including outside the EU (e.g.,
              the United States). However:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>All personal data is stored in Western Europe</li>
              <li>We avoid international data transfers outside the EEA</li>
              <li>
                Any data transfer (if applicable) will comply with GDPR rules
                and Standard Contractual Clauses (SCC) if required
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              12. Children’s Privacy
            </h2>
            <p className="mb-4">
              We do not knowingly collect data from users under 18 without
              consent. If a minor has registered:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                Parents or guardians may contact us by email or via a Discord
                support ticket to request deletion or review of data
              </li>
              <li>We will comply promptly with such requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              13. Complaints
            </h2>
            <p className="mb-4">
              If you believe your data has been handled improperly, you have the
              right to file a complaint with:
            </p>
            <div className="p-4 bg-muted/50 rounded border border-border">
              <p className="mb-2">
                <strong>Datatilsynet (Danish Data Protection Authority)</strong>
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://www.datatilsynet.dk"
                  className="text-primary hover:underline"
                >
                  https://www.datatilsynet.dk
                </a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              14. Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. When changes occur,
              we will:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Update the effective date</li>
              <li>Post the revised version on our website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
              15. Contact
            </h2>
            <p className="mb-4">
              Questions about this policy can be directed to:
            </p>
            <ul className="space-y-2">
              <li>
                <strong>📧 Email:</strong>{" "}
                <a
                  href="mailto:gamestash.net@gmail.com"
                  className="text-primary hover:underline"
                >
                  gamestash.net@gmail.com
                </a>
              </li>
              <li>
                <strong>🌐 Website:</strong>{" "}
                <a
                  href="https://gamestash.net"
                  className="text-primary hover:underline"
                >
                  https://gamestash.net
                </a>
              </li>
            </ul>
          </section>
        </article>
      </main>
    </div>
  );
}
