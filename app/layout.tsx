import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConditionalFooter } from "@/components/layout/conditional-footer";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Assistenz Arzt Ranking",
    template: "%s | Assistenz Arzt Ranking",
  },
  description: "Clinic Ranking Next.js rewrite scaffold.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <QueryProvider>
          <div className="flex min-h-dvh flex-col">
            <div className="flex flex-1 flex-col">{children}</div>
            <ConditionalFooter />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
