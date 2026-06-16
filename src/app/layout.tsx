import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/site-shell";
import { AccessibilityToolbar } from "@/components/accessibility-toolbar";

export const metadata: Metadata = {
  title: "Natiara Designer | Agendamento",
  description: "Sistema de agendamento para servicos esteticos domiciliares.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <SiteShell>
            <AccessibilityToolbar />
            {children}
          </SiteShell>
        </Providers>
      </body>
    </html>
  );
}
