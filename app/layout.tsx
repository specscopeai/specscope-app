import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpecScope AI | Trade Subcontractor RFP & Scope Extractor",
  description: "Extract line-item scopes of work, exclusions, and compliance milestones from commercial construction specs in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 min-h-screen antialiased">{children}</body>
    </html>
  );
}
