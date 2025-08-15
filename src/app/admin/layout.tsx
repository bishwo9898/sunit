import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";

export const metadata: Metadata = {
  title: {
    default: "Admin | Shutter Unit",
    template: "%s | Admin | Shutter Unit",
  },
  robots: {
    index: false,
    follow: false,
  },
};

// Use the same font variables as the public site to keep <html> className consistent
const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <head />
      <body
        suppressHydrationWarning
        className="flex flex-col min-h-screen bg-neutral-950 text-white antialiased font-sans"
      >
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
