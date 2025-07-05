import { db } from "@/db";
import { tos } from "@/db/schema";
import { desc } from "drizzle-orm";
import Header from "@/components/header";
import AdminTosEditor from "./AdminTosEditor";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export default async function AdminTosPage() {
  const [tosRow] = await db
    .select()
    .from(tos)
    .orderBy(desc(tos.updatedAt))
    .limit(1);

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <section className="max-w-2xl mx-auto mb-6">
          <Card>
            <CardContent className="py-4 px-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Info className="text-primary" size={20} />
                <span className="font-semibold text-primary">
                  Tips for Writing TOS Clauses
                </span>
              </div>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Write each clause as a single, clear sentence.</li>
                <li>Be specific and avoid ambiguous language.</li>
                <li>Each clause should cover one rule or policy.</li>
                <li>Use your custom markup for formatting:</li>
                <ul className="list-disc pl-5">
                  <li>
                    <span className="font-mono">**bold**</span> for{" "}
                    <strong>bold</strong>
                  </li>
                  <li>
                    <span className="font-mono">__underline__</span> for{" "}
                    <u>underline</u>
                  </li>
                  <li>
                    <span className="font-mono">!!italic!!</span> for{" "}
                    <em>italic</em>
                  </li>
                </ul>
                <li>
                  Example: <br />
                  <span className="font-mono text-xs">
                    **No refunds:** All sales are final. <br />
                    __Digital products only:__ No physical items will be
                    shipped. <br />
                    !!Contact support for help!!
                  </span>
                </li>
              </ul>
              <div className="text-xs text-muted-foreground mt-2">
                <strong>Note:</strong> You can drag and drop clauses to reorder
                them. Click the pencil icon to edit, and the trash icon to
                delete.
              </div>
            </CardContent>
          </Card>
        </section>
        <AdminTosEditor
          initialContent={tosRow?.content || ""}
          tosId={tosRow?.id || ""}
        />
      </main>
    </div>
  );
}
