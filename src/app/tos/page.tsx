import { db } from "@/db";
import { tos } from "@/db/schema";
import { desc } from "drizzle-orm";
import Header from "@/components/header";

// Custom markup parser: **bold**, __underline__, !!italic!!
function parseCustomMarkup(text: string): string {
  return text
    .replace(/__([^_]+)__/g, "<u>$1</u>")
    .replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/!!([^!]+)!!/g, "<em>$1</em>");
}

function extractClauses(html: string): string[] {
  const matches = html.match(/<li[^>]*>[\s\S]*?<\/li>/g);
  if (matches) {
    return matches.map((clause) => clause.replace(/<\/?li[^>]*>/g, "").trim());
  }
  return [html];
}

export default async function TosPage() {
  const [tosRow] = await db
    .select()
    .from(tos)
    .orderBy(desc(tos.updatedAt))
    .limit(1);

  const clauses = tosRow?.content
    ? extractClauses(tosRow.content)
    : ["No Terms of Service found."];

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <section className="mx-auto max-w-2xl px-4">
          <h1 className="text-xl font-bold text-foreground mb-3 text-center font-display">
            Terms of Service
          </h1>
          <ul className="space-y-2">
            {clauses.map((clause, idx) => (
              <li key={idx}>
                <div
                  className="border-l-4 border-primary bg-muted/60 px-3 py-1 text-sm text-foreground leading-snug"
                  style={{ wordBreak: "break-word" }}
                  dangerouslySetInnerHTML={{
                    __html: parseCustomMarkup(clause),
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
