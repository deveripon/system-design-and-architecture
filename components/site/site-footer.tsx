import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FacebookIcon, GithubIcon, LinkedinIcon } from "./brand-icons";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { OtherTrackCta } from "./other-track-cta";

const REPO_URL = "https://github.com/Deveripon/system-design-and-architecture";
const AUTHOR_URL = "https://github.com/Deveripon";
const FB_URL = "https://www.facebook.com/devripon.io/";
const LI_URL = "https://www.linkedin.com/in/deveripon";

const SOCIAL = [
  { label: "GitHub", href: REPO_URL, icon: GithubIcon, external: true },
  { label: "Facebook", href: FB_URL, icon: FacebookIcon, external: true },
  { label: "LinkedIn", href: LI_URL, icon: LinkedinIcon, external: true },
];

const COLUMNS: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Tracks",
    links: [
      { label: "System Design", href: "/" },
      { label: "DevOps & Internet", href: "/devops" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Roadmap", href: "/#roadmap" },
      { label: "Island Tours Project", href: "/devops/project" },
      { label: "ASCII Reference", href: "/devops/reference/ascii-table" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "GitHub Repo", href: REPO_URL, external: true },
      { label: "Author", href: AUTHOR_URL, external: true },
      { label: "Facebook", href: FB_URL, external: true },
      { label: "LinkedIn", href: LI_URL, external: true },
    ],
  },
];

function FooterLink({
  href,
  external,
  children,
  className,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-background relative z-10">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-6 xl:px-10">
        {/* Social and CTA row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-border">
          {SOCIAL.map((s) => {
            const Icon = s.icon;
            return (
              <FooterLink
                key={s.label}
                href={s.href}
                external={s.external}
                className="group flex items-center justify-between gap-4 px-5 py-6 border-r border-b border-border hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-foreground" />
                  <span className="font-mono text-[12px] font-bold text-foreground">
                    {s.label}
                  </span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </FooterLink>
            );
          })}
          <OtherTrackCta />
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 py-14 md:py-20">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink
                      href={link.href}
                      external={link.external}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Brand and newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 py-14 md:py-16 border-t border-border">
          <div className="max-w-sm">
            <Link href="/" aria-label="Devripon home" className="inline-block">
              <Logo variant="stacked" className="h-20 md:h-24" />
            </Link>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              System Design আর DevOps, একদম শূন্য থেকে হাতে কলমে শেখার একটা
              বাংলা curriculum। Browser এর ভেতর থেকে Production Infrastructure
              পর্যন্ত, গল্পের মতো করে।
            </p>
          </div>
          <div className="lg:justify-self-end w-full lg:max-w-md">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              নতুন Lesson এর খবর পান
            </h3>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-border">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            © 2026{" "}
            <a
              href={AUTHOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-foreground transition-colors"
            >
              Devripon
            </a>{" "}
            · Build for Scale
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-[0.2em]">
            Made for learners, in Bangla
          </p>
        </div>
      </div>
    </footer>
  );
}
