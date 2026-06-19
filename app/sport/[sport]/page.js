import dbConnect from "@/lib/db";
import Academy from "@/models/Academy";
import Link from "next/link";

const BASE_URL = "https://sports.gwdglobal.in";

const SPORT_DATA = {
  cricket: { label: "Cricket", emoji: "🏏", desc: "Find the best cricket academies and coaching centers in Hyderabad. Compare verified academies by area, fees, ratings, and coaching quality. Book free trial sessions." },
  football: { label: "Football", emoji: "⚽", desc: "Discover top football academies in Hyderabad. Professional coaching for kids and adults. Compare academies by location, fees, and win rates." },
  badminton: { label: "Badminton", emoji: "🏸", desc: "Find badminton coaching and academies in Hyderabad. Indoor courts, professional coaches, beginner to advanced training. Book a trial today." },
  tennis: { label: "Tennis", emoji: "🎾", desc: "Explore tennis academies and coaching programs in Hyderabad. Compare facilities, fees, and coach experience. Book free trial sessions." },
  swimming: { label: "Swimming", emoji: "🏊", desc: "Find swimming classes and academies in Hyderabad. Learn to swim programs for kids and adults. Indoor and outdoor pools." },
  mma: { label: "MMA & Martial Arts", emoji: "🥊", desc: "Discover MMA, karate, taekwondo, and martial arts training in Hyderabad. Self-defense and fitness for all ages." },
  kabaddi: { label: "Kabaddi", emoji: "🤼", desc: "Find kabaddi coaching and academies in Hyderabad. Traditional Indian sport training with professional coaches." },
};

const ALL_SPORTS = Object.keys(SPORT_DATA);

function getSlug(a) {
  return a.slug || a.id || a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function generateStaticParams() {
  return ALL_SPORTS.map((sport) => ({ sport }));
}

export async function generateMetadata({ params }) {
  const { sport } = await params;
  const data = SPORT_DATA[sport] || { label: sport.charAt(0).toUpperCase() + sport.slice(1), desc: "" };
  const title = `Best ${data.label} Academies in Hyderabad — Verified & Rated`;
  const desc = data.desc || `Find top ${data.label.toLowerCase()} coaching in Hyderabad. GWD Verified academies with ratings, reviews, and free trial booking.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `${BASE_URL}/sport/${sport}` },
    openGraph: { title, description: desc, url: `${BASE_URL}/sport/${sport}`, siteName: "GWD Sports", type: "website", locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function SportPage({ params }) {
  const { sport } = await params;
  const data = SPORT_DATA[sport] || { label: sport.charAt(0).toUpperCase() + sport.slice(1), emoji: "🏅", desc: "" };

  await dbConnect();
  // Match academies whose sport field contains this sport (handles "Cricket/Football" etc)
  const regex = new RegExp(data.label.split(" ")[0], "i");
  const academies = await Academy.find({ status: "active", sport: regex }).sort({ students: -1 }).lean();

  // Areas with this sport
  const areas = [...new Set(academies.map(a => a.area).filter(Boolean))];
  const totalStudents = academies.reduce((s, a) => s + (a.students || 0), 0);

  // Schema.org
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${data.label} Academies in Hyderabad`,
    description: data.desc,
    numberOfItems: academies.length,
    itemListElement: academies.slice(0, 20).map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SportsActivityLocation",
        name: a.name,
        url: `${BASE_URL}/academy/${getSlug(a)}`,
        sport: a.sport,
        address: { "@type": "PostalAddress", addressLocality: a.area || "Hyderabad", addressRegion: "Telangana", addressCountry: "IN" },
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: `${data.label} Academies` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `How many ${data.label.toLowerCase()} academies are in Hyderabad?`, acceptedAnswer: { "@type": "Answer", text: `There are ${academies.length}+ verified ${data.label.toLowerCase()} academies listed on GWD Sports in Hyderabad, with ${totalStudents}+ active students across all academies.` } },
      { "@type": "Question", name: `What is the average fee for ${data.label.toLowerCase()} coaching in Hyderabad?`, acceptedAnswer: { "@type": "Answer", text: `${data.label} coaching fees in Hyderabad typically range from ₹1,500 to ₹5,000 per month depending on the academy, batch timings, and coaching level. Visit individual academy pages for exact pricing.` } },
      { "@type": "Question", name: `Can I book a free trial for ${data.label.toLowerCase()} coaching?`, acceptedAnswer: { "@type": "Answer", text: `Yes! Most GWD-listed ${data.label.toLowerCase()} academies offer free trial sessions. Click "Request Free Trial" on any academy's profile page to send a request.` } },
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
            {ALL_SPORTS.slice(0, 4).map(s => (
              <Link key={s} href={`/sport/${s}`} style={s === sport ? { color: "#D97706" } : {}}>{SPORT_DATA[s]?.label || s}</Link>
            ))}
          </div>
        </nav>

        <div className="ap-breadcrumbs">
          <Link href="/">Home</Link><span>›</span>
          <span className="ap-bc-current">{data.label} Academies in Hyderabad</span>
        </div>

        <section className="ap-hero">
          <div className="ap-hero-badge">{data.emoji} {data.label.toUpperCase()}</div>
          <h1 className="ap-hero-name">Best {data.label} Academies in Hyderabad</h1>
          <p className="ap-hero-meta">{data.desc}</p>
          <div className="ap-hero-stats">
            <div className="ap-stat"><div className="ap-stat-val">{academies.length}</div><div className="ap-stat-lbl">Academies</div></div>
            <div className="ap-stat"><div className="ap-stat-val">{totalStudents}</div><div className="ap-stat-lbl">Students</div></div>
            <div className="ap-stat"><div className="ap-stat-val">{areas.length}</div><div className="ap-stat-lbl">Areas</div></div>
          </div>
        </section>

        {/* Area quick links */}
        {areas.length > 0 && (
          <section className="ap-section" style={{ paddingTop: 0 }}>
            <h2 className="ap-subsec-title">{data.label} by Area</h2>
            <div className="ap-tags">
              {areas.map((area, i) => {
                const areaSlug = area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                return <Link key={i} href={`/area/${areaSlug}`} className="ap-tag" style={{ textDecoration: "none" }}>{area}</Link>;
              })}
            </div>
          </section>
        )}

        {/* Academy List */}
        <section className="ap-section">
          <h2 className="ap-sec-title">All {data.label} Academies ({academies.length})</h2>
          <div className="ap-grid-2">
            {academies.map((a, i) => (
              <Link key={i} href={`/academy/${getSlug(a)}`} className="ap-nearby-card">
                <div className="ap-nearby-badge">{a.badge === "founding" ? "GWD FOUNDING" : a.badge === "premium" ? "GWD ELITE" : "GWD VERIFIED"}</div>
                <div className="ap-nearby-name">{a.name}</div>
                <div className="ap-nearby-meta">
                  {a.area || "Hyderabad"} · {a.students || 0} students
                  {a.coach ? ` · Coach: ${a.coach}` : ""}
                  {a.winRate ? ` · ${a.winRate}% win rate` : ""}
                </div>
                <div style={{ fontSize: 14, color: "#D97706", marginTop: 6, letterSpacing: 1 }}>
                  {"★".repeat(Math.min(a.rating || 1, 5))}{"☆".repeat(5 - Math.min(a.rating || 1, 5))}
                </div>
              </Link>
            ))}
          </div>
          {academies.length === 0 && (
            <p className="ap-sec-text">No {data.label.toLowerCase()} academies listed yet. <Link href="/#join" style={{ color: "#D97706" }}>Register your academy</Link> to be the first.</p>
          )}
        </section>

        {/* FAQ */}
        <section className="ap-section">
          <h2 className="ap-sec-title">Frequently Asked Questions — {data.label} in Hyderabad</h2>
          <div className="ap-faq">
            <details className="ap-faq-item">
              <summary>How many {data.label.toLowerCase()} academies are in Hyderabad?</summary>
              <p>There are {academies.length}+ verified {data.label.toLowerCase()} academies listed on GWD Sports in Hyderabad, with {totalStudents}+ active students across all academies.</p>
            </details>
            <details className="ap-faq-item">
              <summary>What is the average fee for {data.label.toLowerCase()} coaching in Hyderabad?</summary>
              <p>{data.label} coaching fees in Hyderabad typically range from ₹1,500 to ₹5,000 per month depending on the academy, batch timings, and coaching level.</p>
            </details>
            <details className="ap-faq-item">
              <summary>Can I book a free trial for {data.label.toLowerCase()} coaching?</summary>
              <p>Yes! Most GWD-listed {data.label.toLowerCase()} academies offer free trial sessions. Click &quot;Request Free Trial&quot; on any academy&apos;s profile page.</p>
            </details>
            <details className="ap-faq-item">
              <summary>What age should my child start {data.label.toLowerCase()} coaching?</summary>
              <p>Most {data.label.toLowerCase()} academies in Hyderabad accept children from age 5-6 for beginner programs. Structured competitive coaching typically begins at age 7-8.</p>
            </details>
            <details className="ap-faq-item">
              <summary>Which areas in Hyderabad have the best {data.label.toLowerCase()} academies?</summary>
              <p>{areas.length > 0 ? `Popular areas for ${data.label.toLowerCase()} coaching include ${areas.slice(0, 5).join(", ")}. Browse each area to find academies near you.` : `We're adding ${data.label.toLowerCase()} academies across Hyderabad. Check back soon.`}</p>
            </details>
          </div>
        </section>

        {/* Other sports */}
        <section className="ap-section">
          <h2 className="ap-subsec-title">Explore Other Sports</h2>
          <div className="ap-tags">
            {ALL_SPORTS.filter(s => s !== sport).map(s => (
              <Link key={s} href={`/sport/${s}`} className="ap-tag" style={{ textDecoration: "none" }}>
                {SPORT_DATA[s]?.emoji} {SPORT_DATA[s]?.label || s}
              </Link>
            ))}
          </div>
        </section>

        <section className="ap-bottom-cta">
          <h2>List Your {data.label} Academy on GWD</h2>
          <p>Get verified, appear in parent searches, receive trial requests. Join Hyderabad&apos;s sports ecosystem.</p>
          <Link href="/#join" className="ap-cta-btn ap-cta-primary">Join GWD Sports →</Link>
        </section>

        <footer className="ap-footer">
          <div className="ap-footer-brand">GWD SPORTS <span>ECOSYSTEM</span></div>
          <div className="ap-footer-links">
            <Link href="/">Home</Link>
            <Link href="/find-academy">Find Academy</Link>
            {ALL_SPORTS.slice(0, 5).map(s => <Link key={s} href={`/sport/${s}`}>{SPORT_DATA[s]?.label}</Link>)}
          </div>
          <div className="ap-footer-copy">© 2026 GWD Global Pvt Ltd · Hyderabad, India</div>
        </footer>
      </main>
    </>
  );
}
