import dbConnect from "@/lib/db";
import Academy from "@/models/Academy";
import Link from "next/link";

const BASE_URL = "https://sports.gwdglobal.in";

const AREA_DATA = {
  kukatpally: { label: "Kukatpally", lat: 17.4947, lng: 78.3996 },
  kphb: { label: "KPHB", lat: 17.4880, lng: 78.3907 },
  gachibowli: { label: "Gachibowli", lat: 17.4401, lng: 78.3489 },
  madhapur: { label: "Madhapur", lat: 17.4486, lng: 78.3908 },
  kondapur: { label: "Kondapur", lat: 17.4592, lng: 78.3631 },
  miyapur: { label: "Miyapur", lat: 17.4965, lng: 78.3525 },
  "jubilee-hills": { label: "Jubilee Hills", lat: 17.4325, lng: 78.4073 },
  "hitec-city": { label: "Hitec City", lat: 17.4474, lng: 78.3762 },
  bachupally: { label: "Bachupally", lat: 17.5449, lng: 78.3868 },
  madinaguda: { label: "Madinaguda", lat: 17.4932, lng: 78.3353 },
  "banjara-hills": { label: "Banjara Hills", lat: 17.4156, lng: 78.4347 },
  nizampet: { label: "Nizampet", lat: 17.5158, lng: 78.3845 },
  pragathi_nagar: { label: "Pragathi Nagar", lat: 17.5136, lng: 78.3891 },
};

const ALL_AREAS = Object.keys(AREA_DATA);

function getSlug(a) {
  return a.slug || a.id || a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function generateStaticParams() {
  return ALL_AREAS.map((area) => ({ area }));
}

export async function generateMetadata({ params }) {
  const { area } = await params;
  const data = AREA_DATA[area] || { label: area.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) };
  const title = `Sports Academies in ${data.label}, Hyderabad — Cricket, Football, Badminton`;
  const desc = `Find the best sports academies in ${data.label}, Hyderabad. Compare cricket, football, badminton, tennis academies with ratings, fees & reviews. Book free trials on GWD Sports.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `${BASE_URL}/area/${area}` },
    openGraph: { title, description: desc, url: `${BASE_URL}/area/${area}`, siteName: "GWD Sports", type: "website", locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function AreaPage({ params }) {
  const { area } = await params;
  const data = AREA_DATA[area] || { label: area.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) };

  await dbConnect();
  // Match academies in this area (fuzzy match)
  const regex = new RegExp(data.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const academies = await Academy.find({ status: "active", area: regex }).sort({ students: -1 }).lean();

  const sports = [...new Set(academies.map(a => a.sport).filter(Boolean))];
  const totalStudents = academies.reduce((s, a) => s + (a.students || 0), 0);

  // Schema
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Sports Academies in ${data.label}, Hyderabad`,
    numberOfItems: academies.length,
    itemListElement: academies.slice(0, 20).map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SportsActivityLocation",
        name: a.name,
        url: `${BASE_URL}/academy/${getSlug(a)}`,
        sport: a.sport,
        address: { "@type": "PostalAddress", addressLocality: data.label, addressRegion: "Telangana", addressCountry: "IN" },
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: data.label },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `How many sports academies are in ${data.label}?`, acceptedAnswer: { "@type": "Answer", text: `There are ${academies.length}+ verified sports academies in ${data.label}, Hyderabad listed on GWD Sports. ${sports.length > 0 ? `Sports available: ${sports.join(", ")}.` : ""}` } },
      { "@type": "Question", name: `What sports can I learn in ${data.label}?`, acceptedAnswer: { "@type": "Answer", text: `In ${data.label}, you can find coaching for ${sports.length > 0 ? sports.join(", ") : "cricket, football, badminton, and more"}. Browse individual academies for schedules and fees.` } },
      { "@type": "Question", name: `Which is the best sports academy in ${data.label}?`, acceptedAnswer: { "@type": "Answer", text: `The best academy depends on your sport, budget, and schedule. Browse all ${academies.length} verified academies in ${data.label} on GWD Sports to compare ratings, fees, and facilities.` } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="academy-profile-page">
        <nav className="ap-nav">
          <Link href="/" className="ap-nav-logo">GWD <span>SPORTS</span></Link>
          <div className="ap-nav-links">
            <Link href="/find-academy">Find Academy</Link>
            <Link href="/sport/cricket">Cricket</Link>
            <Link href="/sport/football">Football</Link>
            <Link href="/sport/badminton">Badminton</Link>
          </div>
        </nav>

        <div className="ap-breadcrumbs">
          <Link href="/">Home</Link><span>›</span>
          <span className="ap-bc-current">Sports Academies in {data.label}</span>
        </div>

        <section className="ap-hero">
          <div className="ap-hero-badge">📍 {data.label.toUpperCase()}, HYDERABAD</div>
          <h1 className="ap-hero-name">Best Sports Academies in {data.label}, Hyderabad</h1>
          <p className="ap-hero-meta">Find and compare verified sports academies in {data.label}. Cricket, football, badminton, tennis — all in one place. Book free trials instantly.</p>
          <div className="ap-hero-stats">
            <div className="ap-stat"><div className="ap-stat-val">{academies.length}</div><div className="ap-stat-lbl">Academies</div></div>
            <div className="ap-stat"><div className="ap-stat-val">{totalStudents}</div><div className="ap-stat-lbl">Students</div></div>
            <div className="ap-stat"><div className="ap-stat-val">{sports.length}</div><div className="ap-stat-lbl">Sports</div></div>
          </div>
        </section>

        {/* Sport filters */}
        {sports.length > 0 && (
          <section className="ap-section" style={{ paddingTop: 0 }}>
            <h2 className="ap-subsec-title">Sports Available in {data.label}</h2>
            <div className="ap-tags">
              {sports.map((sport, i) => {
                const sportSlug = sport.toLowerCase().split("/")[0].trim();
                return <Link key={i} href={`/sport/${sportSlug}`} className="ap-tag" style={{ textDecoration: "none" }}>{sport}</Link>;
              })}
            </div>
          </section>
        )}

        {/* Academy List */}
        <section className="ap-section">
          <h2 className="ap-sec-title">All Academies in {data.label} ({academies.length})</h2>
          <div className="ap-grid-2">
            {academies.map((a, i) => (
              <Link key={i} href={`/academy/${getSlug(a)}`} className="ap-nearby-card">
                <div className="ap-nearby-badge">{a.badge === "founding" ? "GWD FOUNDING" : a.badge === "premium" ? "GWD ELITE" : "GWD VERIFIED"}</div>
                <div className="ap-nearby-name">{a.name}</div>
                <div className="ap-nearby-meta">
                  {a.sport} · {a.students || 0} students
                  {a.coach ? ` · Coach: ${a.coach}` : ""}
                </div>
                <div style={{ fontSize: 14, color: "#D97706", marginTop: 6, letterSpacing: 1 }}>
                  {"★".repeat(Math.min(a.rating || 1, 5))}{"☆".repeat(5 - Math.min(a.rating || 1, 5))}
                </div>
              </Link>
            ))}
          </div>
          {academies.length === 0 && (
            <p className="ap-sec-text">No academies in {data.label} yet. <Link href="/#join" style={{ color: "#D97706" }}>Register your academy</Link> to be the first in this area.</p>
          )}
        </section>

        {/* FAQ */}
        <section className="ap-section">
          <h2 className="ap-sec-title">Frequently Asked Questions — Sports in {data.label}</h2>
          <div className="ap-faq">
            <details className="ap-faq-item">
              <summary>How many sports academies are in {data.label}?</summary>
              <p>There are {academies.length}+ verified sports academies in {data.label}, Hyderabad listed on GWD Sports. {sports.length > 0 ? `Sports available: ${sports.join(", ")}.` : ""}</p>
            </details>
            <details className="ap-faq-item">
              <summary>What sports can I learn in {data.label}?</summary>
              <p>In {data.label}, you can find coaching for {sports.length > 0 ? sports.join(", ") : "cricket, football, badminton, and more"}. Browse individual academies for schedules and fees.</p>
            </details>
            <details className="ap-faq-item">
              <summary>Which is the best sports academy in {data.label}?</summary>
              <p>The best academy depends on your sport, budget, and schedule. Browse all {academies.length} verified academies in {data.label} on GWD Sports to compare ratings and facilities.</p>
            </details>
            <details className="ap-faq-item">
              <summary>Can I book a free trial at academies in {data.label}?</summary>
              <p>Yes! Most GWD-listed academies offer free trial sessions. Click &quot;Request Free Trial&quot; on any academy&apos;s profile page to send a request directly via WhatsApp.</p>
            </details>
          </div>
        </section>

        {/* Other areas */}
        <section className="ap-section">
          <h2 className="ap-subsec-title">Explore Other Areas in Hyderabad</h2>
          <div className="ap-tags">
            {ALL_AREAS.filter(a => a !== area).slice(0, 10).map(a => (
              <Link key={a} href={`/area/${a}`} className="ap-tag" style={{ textDecoration: "none" }}>
                📍 {AREA_DATA[a]?.label || a}
              </Link>
            ))}
          </div>
        </section>

        <section className="ap-bottom-cta">
          <h2>List Your Academy in {data.label}</h2>
          <p>Get verified, appear in parent searches for {data.label}, receive trial requests. Join Hyderabad&apos;s sports ecosystem.</p>
          <Link href="/#join" className="ap-cta-btn ap-cta-primary">Join GWD Sports →</Link>
        </section>

        <footer className="ap-footer">
          <div className="ap-footer-brand">GWD SPORTS <span>ECOSYSTEM</span></div>
          <div className="ap-footer-links">
            <Link href="/">Home</Link>
            <Link href="/find-academy">Find Academy</Link>
            {ALL_AREAS.slice(0, 6).map(a => <Link key={a} href={`/area/${a}`}>{AREA_DATA[a]?.label}</Link>)}
          </div>
          <div className="ap-footer-copy">© 2026 GWD Global Pvt Ltd · Hyderabad, India</div>
        </footer>
      </main>
    </>
  );
}
