import "dotenv/config";
import { db } from "@/db";
import { tos } from "@/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const initialContent = `
    <h2>Terms of Service</h2>
    <ul>
      <li><strong>No refunds:</strong> All sales are final. By purchasing a product, you agree that no refunds will be issued for digital goods.</li>
      <li><strong>Digital products only:</strong> No physical items will be shipped.</li>
      <li><strong>Personal use:</strong> Products are for your personal use only and may not be redistributed or resold.</li>
      <li><strong>Account responsibility:</strong> You are responsible for your account security and activity.</li>
      <li><strong>Prohibited conduct:</strong> You may not use the platform for unlawful or abusive purposes.</li>
      <li><strong>Intellectual property:</strong> All content and products are protected by copyright and intellectual property laws.</li>
      <li><strong>Account suspension:</strong> We reserve the right to suspend or terminate accounts for fraudulent, abusive, or suspicious activity.</li>
      <li><strong>Changes to terms:</strong> We may update these terms at any time. Continued use of the platform constitutes acceptance of the new terms.</li>
      <li><strong>Contact:</strong> For any questions, contact our support team at support@gamestash.com.</li>
      <li><strong>Jurisdiction:</strong> These terms are governed by the laws of your country of residence.</li>
      <li><strong>Privacy:</strong> Please also review our Privacy Policy for information on how we handle your data.</li>
    </ul>
  `;

  // Check if a TOS already exists
  const [existing] = await db.select().from(tos).limit(1);

  if (existing) {
    // Update the existing TOS
    await db
      .update(tos)
      .set({ content: initialContent, updatedAt: new Date() })
      .where(eq(tos.id, existing.id));
    console.log("Updated existing TOS.");
  } else {
    // Insert a new TOS
    await db.insert(tos).values({ content: initialContent });
    console.log("Inserted new TOS.");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
