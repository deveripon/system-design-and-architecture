import { GoogleAnalytics } from '@/components/google-analytics';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { Fraunces, Hind_Siliguri, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
    subsets: ['latin'],
    variable: '--font-heading',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
});

// Hind Siliguri is the workhorse for Bangla body text: it holds up at 14 to
// 16px, which is where most of this curriculum is read, and its Latin stays
// neutral inside mixed sentences.
const hindSiliguri = Hind_Siliguri({
    subsets: ['bengali', 'latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-sans',
    display: 'swap',
});

let siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://learnsystemdesign-bn.vercel.app/';

if (!siteUrl.startsWith('http')) {
    siteUrl = `https://${siteUrl}`;
}

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'System Design Mastery: Build for Scale',
        template: '%s | System Design Mastery',
    },
    description:
        'A battle-tested, Bengali-language curriculum for engineers who want to master distributed systems, cloud architecture, and system design interviews. From fundamentals to expert-level patterns.',
    keywords: [
        'system design',
        'distributed systems',
        'software architecture',
        'scalability',
        'microservices',
        'cloud architecture',
        'AWS',
        'database design',
        'system design interview',
        'Bengali programming',
        'Bloom Filter',
        'HyperLogLog',
        'Kafka',
        'Redis',
    ],
    authors: [{ name: 'Devripon', url: 'https://github.com/Deveripon' }],
    creator: 'Devripon',
    publisher: 'System Design Mastery',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'bn_BD',
        alternateLocale: 'en_US',
        url: siteUrl,
        siteName: 'System Design Mastery',
        title: 'System Design Mastery: Build for Scale',
        description:
            'A battle-tested curriculum for engineers to master distributed systems, cloud architecture, and system design interviews.',
        images: [
            {
                url: '/og-default.png',
                width: 1200,
                height: 630,
                alt: 'System Design Mastery',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'System Design Mastery: Build for Scale',
        description:
            'A battle-tested curriculum for engineers to master distributed systems and crack system design interviews.',
        creator: '@devripon',
        images: ['/og-default.png'],
    },
    alternates: {
        canonical: siteUrl,
    },
    category: 'technology',
};

export const viewport: Viewport = {
    themeColor: '#09090b',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='bn' suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fraunces.variable,
                    jetbrainsMono.variable,
                    hindSiliguri.variable
                )}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='dark'
                    enableSystem
                    disableTransitionOnChange>
                    {children}
                </ThemeProvider>
                <GoogleAnalytics
                    measurementId={
                        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''
                    }
                />
            </body>
        </html>
    );
}

