import './globals.css';
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from '@clerk/nextjs';
import { getSettings } from '@/lib/settings';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { CartProvider } from '@/components/CartContext';
import JsonLd from '@/components/JsonLd';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rhasons.com.pk').replace(/\/+$/, '');
const DEFAULT_TITLE = 'Khilafat Detergent | Detergent Powder in Pakistan — RH & Sons';
const DEFAULT_DESCRIPTION = 'Explore Khilafat Detergent Powder by RH & Sons. View available pack sizes, product details and ordering information on our official website.';
const DEFAULT_KEYWORDS = 'Khilafat Detergent, Khilafat Detergent Powder, detergent powder in Pakistan, washing powder in Pakistan, RH & Sons, Rana Habib and Sons';

export async function generateMetadata() {
  const settings = await getSettings();
  const seo = settings.seo || {};
  const title = seo.defaultTitle?.trim() && seo.defaultTitle.trim() !== '...' ? seo.defaultTitle : DEFAULT_TITLE;
  const description = seo.defaultDescription?.trim() && seo.defaultDescription.trim() !== '...' ? seo.defaultDescription : DEFAULT_DESCRIPTION;
  const keywords = seo.keywords?.trim() && seo.keywords.trim() !== '...' ? seo.keywords : DEFAULT_KEYWORDS;
  const titleTemplate = seo.titleTemplate?.trim() || '%s | Khilafat Detergent — RH & Sons';

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: titleTemplate },
    description,
    keywords,
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
      title,
      description,
      images: [{ url: seo.ogImage || '/images/brand/og-image.jpg', width: 1200, height: 630 }],
      locale: 'en_PK',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [seo.ogImage || '/images/brand/og-image.jpg'],
    },
    verification: { google: seo.googleVerification },
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
            <Toaster position="top-right" />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
