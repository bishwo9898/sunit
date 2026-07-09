import Link from "next/link";
import { SEO_CONFIG } from "@/config/seo";

const serviceLinks = [
  { href: "/weddings", label: "Wedding portfolio" },
  { href: "/portraits", label: "Portrait portfolio" },
  { href: "/lubbock-wedding-photographer", label: "Lubbock weddings" },
  { href: "/lubbock-engagement-photographer", label: "Lubbock engagements" },
  { href: "/lubbock-graduation-photographer", label: "Lubbock graduation" },
  { href: "/lubbock-portrait-photographer", label: "Lubbock portraits" },
];

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-200 bg-neutral-950 px-6 py-14 text-neutral-300 md:px-12 lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-semibold text-white">
            Shutter Unit
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-400">
            Cinematic wedding and portrait photography by Fortunes Efe,
            serving Lubbock, Midland, Odessa, and stories across Texas.
          </p>
        </div>
        <nav aria-label="Photography services">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Photography
          </p>
          <ul className="mt-4 grid gap-2 text-sm">
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Connect
          </p>
          <div className="mt-4 grid gap-2 text-sm">
            <Link href="/about" className="hover:text-white">
              About Fortunes
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact and booking
            </Link>
            <a
              href={SEO_CONFIG.socialLinks.instagram}
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-white"
            >
              Instagram
            </a>
            <a href={`mailto:${SEO_CONFIG.email}`} className="hover:text-white">
              {SEO_CONFIG.email}
            </a>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} Shutter Unit Photography. All rights
        reserved.
      </p>
    </footer>
  );
}
