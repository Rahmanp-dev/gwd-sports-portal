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

/* ── SVG Icons ── */
const IconPin = () => (
  <svg className="ap-pin-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "5px", color: "#FF1744" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);

const IconCricket = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "8px", color: "#FF1744" }}><path d="M18.5 5.5a2.12 2.12 0 0 1 3 3L8 22H5v-3L18.5 5.5Z" /><path d="m15 9 3 3" /><circle cx="4" cy="4" r="2" /></svg>
);

const IconFootball = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "8px", color: "#FF1744" }}><circle cx="12" cy="12" r="10" /><path d="m12 2-2 3v3.5l3.5 1.5 2.5-3V5L12 2Z" /><path d="M10 5.5 5 8v4.5l3 1.5 3.5-1.5V9.5L10 5.5Z" /><path d="m16 5.5 5 2.5v4.5l-3.5 1.5-2.5-1.5v-3l1-4Z" /><path d="M8.5 14 5 15.5V19l4.5 3 2.5-3.5-1-3L8.5 14Z" /><path d="M15.5 14l3.5 1.5V19l-4.5 3-2.5-3.5 1-3 2.5-1.5Z" /></svg>
);

const IconBadminton = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "8px", color: "#FF1744" }}><path d="M12 12V2M8 6h8M6 10h12M12 12a4 4 0 0 0-4 4v4a2 2 0 0 0 4 2h0a2 2 0 0 0 2-2v-4a4 4 0 0 0-4-4Z" /><circle cx="12" cy="6" r="1" /></svg>
);

const IconTennis = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "8px", color: "#FF1744" }}><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" /><path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" /><path d="M2 12h20" /></svg>
);

const IconSwimming = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "8px", color: "#FF1744" }}><path d="M2 6c3-1.5 5 1.5 8 0s5-1.5 8 0 5 1.5 8 0M2 12c3-1.5 5 1.5 8 0s5-1.5 8 0 5 1.5 8 0M2 18c3-1.5 5 1.5 8 0s5-1.5 8 0 5 1.5 8 0" /></svg>
);

const IconMMA = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "8px", color: "#FF1744" }}><rect x="3" y="10" width="18" height="12" rx="2" /><path d="M7 10V5a5 5 0 0 1 10 0v5" /><path d="M12 14v4" /></svg>
);

const IconKabaddi = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "8px", color: "#FF1744" }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

const IconSportGeneric = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-3px", marginRight: "8px", color: "#FF1744" }}><circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20" /></svg>
);

const IconStar = ({ filled }) => (
  <svg className={`ap-star-icon ${filled ? "" : "empty"}`} viewBox="0 0 24 24" width="13" height="13"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
);

const IconChevron = () => (
  <svg className="ap-faq-icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
);

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
  const data = SPORT_DATA[sport] || { label: sport.charAt(0).toUpperCase() + sport.slice(1), emoji: "🏆", desc: "" };

  await dbConnect();
  const regex = new RegExp(data.label.split(" ")[0], "i");
  const academies = await Academy.find({ status: "active", sport: regex }).sort({ students: -1 }).lean();

  const areas = [...new Set(academies.map(a => a.area).filter(Boolean))];
  const totalStudents = academies.reduce((s, a) => s + (a.students || 0), 0);

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

  const sportHeaderIcons = {
    cricket: <IconCricket />,
    football: <IconFootball />,
    badminton: <IconBadminton />,
    tennis: <IconTennis />,
    swimming: <IconSwimming />,
    mma: <IconMMA />,
    kabaddi: <IconKabaddi />,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="academy-profile-page ap-fade-in">
        <nav className="ap-nav">
          <Link href="/" className="ap-nav-logo">GWD <span>SPORTS</span></Link>
          <div className="ap-nav-links">
            <Link href="/find-academy">Find Academy</Link>
            {ALL_SPORTS.slice(0, 4).map(s => (
              <Link key={s} href={`/sport/${s}`} style={s === sport ? { color: "#FF1744" } : {}}>{SPORT_DATA[s]?.label || s}</Link>
            ))}
          </div>
        </nav>

        <div className="ap-breadcrumbs">
          <Link href="/">Home</Link>
          <span className="ap-bc-separator">›</span>
          <span className="ap-bc-current">{data.label} Academies in Hyderabad</span>
        </div>

        <section className="ap-hero">
          <div className="ap-hero-badge">
            {sportHeaderIcons[sport] || <IconSportGeneric />}
            <span>{data.label}</span>
          </div>
          <h1 className="ap-hero-name">Best {data.label} Academies in Hyderabad</h1>
          <p className="ap-hero-meta">{data.desc || `Compare fee structures, coordinates, and coaching quality of the top ${data.label.toLowerCase()} training schools.`}</p>
          <div className="ap-hero-stats">
            <div className="ap-stat-shell"><div className="ap-stat-core"><div className="ap-stat-val">{academies.length}</div><div className="ap-stat-lbl">Academies</div></div></div>
            <div className="ap-stat-shell"><div className="ap-stat-core"><div className="ap-stat-val">{totalStudents}</div><div className="ap-stat-lbl">Students</div></div></div>
            <div className="ap-stat-shell"><div className="ap-stat-core"><div className="ap-stat-val">{areas.length}</div><div className="ap-stat-lbl">Areas</div></div></div>
          </div>
        </section>

        {/* Area quick links */}
        {areas.length > 0 && (
          <section className="ap-section" style={{ paddingTop: 0 }}>
            <h2 className="ap-subsec-title">{data.label} by Area</h2>
            <div className="ap-tags">
              {areas.map((area, i) => {
                const areaSlug = area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                return (
                  <Link key={i} href={`/area/${areaSlug}`} className="ap-tag" style={{ textDecoration: "none" }}>
                    <IconPin /> {area}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Academy List */}
        <section className="ap-section">
          <h2 className="ap-sec-title">All {data.label} Academies ({academies.length})</h2>
          <div className="ap-grid-2">
            {academies.map((a, i) => (
              <Link key={i} href={`/academy/${getSlug(a)}`} className="ap-card-shell">
                <div className="ap-card-core">
                  <div className={`ap-nearby-badge ${a.badge === "founding" ? "founding" : ""}`}>
                    {a.badge === "founding" ? "GWD FOUNDING" : a.badge === "premium" ? "GWD ELITE" : "GWD VERIFIED"}
                  </div>
                  <div className="ap-nearby-name" style={{ marginTop: 4 }}>{a.name}</div>
                  <div className="ap-nearby-meta" style={{ marginTop: 2, flexGrow: 1 }}>
                    {a.area || "Hyderabad"} · {a.students || 0} students
                    {a.coach ? ` · Coach: ${a.coach}` : ""}
                    {a.winRate ? ` · ${a.winRate}% win rate` : ""}
                  </div>
                  <div className="ap-hero-rating" style={{ marginTop: 12 }}>
                    {Array.from({ length: 5 }, (_, idx) => (
                      <IconStar key={idx} filled={idx < Math.min(a.rating || 1, 5)} />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {academies.length === 0 && (
            <p className="ap-sec-text">No {data.label.toLowerCase()} academies listed yet. <Link href="/#join" style={{ color: "#FF1744", textDecoration: "underline" }}>Register your academy</Link> to be the first.</p>
          )}
        </section>

        {/* FAQ */}
        <section className="ap-section">
          <h2 className="ap-sec-title">Frequently Asked Questions — {data.label} in Hyderabad</h2>
          <div className="ap-faq">
            <details className="ap-faq-item">
              <summary>How many {data.label.toLowerCase()} academies are in Hyderabad? <IconChevron /></summary>
              <p>There are {academies.length}+ verified {data.label.toLowerCase()} academies listed on GWD Sports in Hyderabad, with {totalStudents}+ active students across all academies.</p>
            </details>
            <details className="ap-faq-item">
              <summary>What is the average fee for {data.label.toLowerCase()} coaching in Hyderabad? <IconChevron /></summary>
              <p>{data.label} coaching fees in Hyderabad typically range from ₹1,500 to ₹5,000 per month depending on the academy, batch timings, and coaching level.</p>
            </details>
            <details className="ap-faq-item">
              <summary>Can I book a free trial for {data.label.toLowerCase()} coaching? <IconChevron /></summary>
              <p>Yes! Most GWD-listed {data.label.toLowerCase()} academies offer free trial sessions. Click &quot;Request Free Trial&quot; on any academy&apos;s profile page.</p>
            </details>
            <details className="ap-faq-item">
              <summary>What age should my child start {data.label.toLowerCase()} coaching? <IconChevron /></summary>
              <p>Most {data.label.toLowerCase()} academies in Hyderabad accept children from age 5-6 for beginner programs. Structured competitive coaching typically begins at age 7-8.</p>
            </details>
            <details className="ap-faq-item">
              <summary>Which areas in Hyderabad have the best {data.label.toLowerCase()} academies? <IconChevron /></summary>
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
                <span>{SPORT_DATA[s]?.label || s}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="ap-bottom-cta">
          <h2>List Your {data.label} Academy on GWD</h2>
          <p>Get verified, appear in parent searches, receive trial requests. Join Hyderabad&apos;s sports ecosystem.</p>
          <Link href="/#join" className="ap-cta-btn ap-cta-primary">
            Join GWD Sports
            <span className="ap-btn-icon-wrap">→</span>
          </Link>
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
