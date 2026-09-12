import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Assistenz Arzt Ranking",
    template: "%s | Assistenz Arzt Ranking",
  },
  description:
    "Ärzte helfen Ärzten: Bewertungen und Erfahrungsberichte zur Facharztweiterbildung in deutschen Krankenhäusern.",
  openGraph: {
    siteName: "Assistenz Arzt Ranking",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${nunito.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <QueryProvider>
          <div className="flex min-h-dvh flex-col">
            <div className="flex flex-1 flex-col pb-20 md:pb-14">
              {children}
            </div>
            <ConditionalFooter />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
