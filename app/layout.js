import "./globals.css";
import Script from "next/script";

const BASE_URL = "https://sports.gwdglobal.in";

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "GWD Sports — Best Sports Academies in Hyderabad | Cricket, Football, Badminton",
    template: "%s | GWD Sports",
  },
  description:
    "Find the best sports academies in Hyderabad. GWD Sports is India's first verified sports academy directory — cricket, football, badminton, tennis, swimming. Compare ratings, read reviews, book free trials.",
  keywords: [
    "sports academy Hyderabad",
    "cricket academy Hyderabad",
    "football academy Hyderabad",
    "badminton academy Hyderabad",
    "tennis academy Hyderabad",
    "best cricket coaching Hyderabad",
    "sports coaching for kids",
    "cricket academy near me",
    "football coaching for kids Hyderabad",
    "sports academy KPHB",
    "cricket academy Kukatpally",
    "GWD Sports",
    "sports academy directory India",
    "book free trial sports academy",
    "verified sports academy",
  ],
  authors: [{ name: "GWD Sports", url: BASE_URL }],
  creator: "GWD Global Pvt Ltd",
  publisher: "GWD Sports",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "GWD Sports",
    title: "GWD Sports — Best Sports Academies in Hyderabad",
    description:
      "India's first verified sports academy directory. Find cricket, football, badminton, tennis academies in Hyderabad. Compare ratings. Book free trials.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "GWD Sports — Hyderabad's Sports Academy Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GWD Sports — Best Sports Academies in Hyderabad",
    description:
      "Find & compare verified sports academies. Cricket, football, badminton. Book free trials.",
    images: [`${BASE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

// Organization JSON-LD (site-wide)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GWD Sports",
  alternateName: "GWD Global Sports Division",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    "India's first verified sports academy directory and ecosystem platform. Connecting parents with the best sports academies in Hyderabad.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi", "Telugu"],
  },
};

// WebSite schema with SearchAction
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GWD Sports",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/find-academy?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        {children}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
