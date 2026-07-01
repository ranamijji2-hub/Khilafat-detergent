import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { getSettings } from '@/lib/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { CartProvider } from '@/components/CartContext';
import JsonLd from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.seo.defaultTitle,
      template: settings.seo.titleTemplate,
    },
    description: settings.seo.defaultDescription,
    keywords: settings.seo.keywords,
    alternates: { canonical: '/' },
    applicationName: settings.siteName,
    authors: [{ name: settings.companyName }],
    icons: {
      icon: '/images/brand/icon.png',
      shortcut: '/images/brand/icon.png',
      apple: '/images/brand/icon.png',
    },
    openGraph: {
      type: 'website',
      url: SITE_URL,
      siteName: settings.siteName,
      title: settings.seo.defaultTitle,
      description: settings.seo.defaultDescription,
      images: [{ url: settings.seo.ogImage || '/images/brand/og-image.jpg', width: 1200, height: 630 }],
      locale: 'en_PK',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.seo.defaultTitle,
      description: settings.seo.defaultDescription,
      images: [settings.seo.ogImage || '/images/brand/og-image.jpg'],
    },
    verification: {
  google: "vP2TpG9tRTbrWoG_hbpkUe_C5EtjhovMVkmfns_SU_g",
},

  };
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();
  const theme = settings.theme;

  const fontFamilies = Array.from(new Set([theme.fontHeading, theme.fontBody]))
    .filter(Boolean)
    .map((f) => f.replace(/\s+/g, '+'))
    .join('&family=');

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.companyName,
    alternateName: settings.siteName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/brand/logo.png`,
    image: `${SITE_URL}/images/brand/og-image.jpg`,
    telephone: settings.contact.phone,
    email: settings.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.contact.address,
      addressCountry: 'PK',
    },
    sameAs: [settings.social.facebook, settings.social.instagram, settings.social.youtube].filter(Boolean),
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {fontFamilies && (
            <link
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css2?family=${fontFamilies}:wght@400;500;600;700;800&display=swap`}
            />
          )}
          <style
            dangerouslySetInnerHTML={{
              __html: `:root{
                --color-primary:${theme.primary};
                --color-primary-dark:${theme.primaryDark};
                --color-secondary:${theme.secondary};
                --color-accent:${theme.accent};
                --color-ink:${theme.ink};
                --font-heading:'${theme.fontHeading}', 'Segoe UI', sans-serif;
                --font-body:'${theme.fontBody}', 'Segoe UI', sans-serif;
              }`,
            }}
          />
          <JsonLd data={organizationJsonLd} />
        </head>
        <body className="font-body antialiased">
          <CartProvider>
            <Header settings={settings} />
            <main>{children}</main>
            <Footer settings={settings} />
            <WhatsAppButton whatsapp={settings.contact.whatsapp} />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
