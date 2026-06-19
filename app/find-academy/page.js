import dbConnect from "@/lib/db";
import Academy from "@/models/Academy";
import Link from "next/link";

const BASE_URL = "https://sports.gwdglobal.in";

export const metadata = {
  title: "Find Sports Academies Near You in Hyderabad — Compare & Book Free Trials",
  description: "Search and compare verified sports academies in Hyderabad. Filter by sport, area, and rating. Cricket, football, badminton, tennis, swimming. Book free trial sessions instantly on GWD Sports.",
  alternates: { canonical: `${BASE_URL}/find-academy` },
  openGraph: {
    title: "Find the Best Sports Academy Near You — GWD Sports Hyderabad",
    description: "Search 20+ verified sports academies. Compare fees, ratings, reviews. Book free trials.",
    url: `${BASE_URL}/find-academy`,
    siteName: "GWD Sports",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Sports Academies in Hyderabad — GWD Sports",
    description: "Compare verified cricket, football, badminton academies. Book free trials.",
  },
};

/* ── SVG Icons ── */
const IconPin = () => (
  <svg className="ap-pin-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "6px", color: "#FF1744" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);

const IconCricket = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px", color: "#FF1744" }}><path d="M18.5 5.5a2.12 2.12 0 0 1 3 3L8 22H5v-3L18.5 5.5Z" /><path d="m15 9 3 3" /><circle cx="4" cy="4" r="2" /></svg>
);

const IconFootball = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px", color: "#FF1744" }}><circle cx="12" cy="12" r="10" /><path d="m12 2-2 3v3.5l3.5 1.5 2.5-3V5L12 2Z" /><path d="M10 5.5 5 8v4.5l3 1.5 3.5-1.5V9.5L10 5.5Z" /><path d="m16 5.5 5 2.5v4.5l-3.5 1.5-2.5-1.5v-3l1-4Z" /><path d="M8.5 14 5 15.5V19l4.5 3 2.5-3.5-1-3L8.5 14Z" /><path d="M15.5 14l3.5 1.5V19l-4.5 3-2.5-3.5 1-3 2.5-1.5Z" /></svg>
);

const IconBadminton = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px", color: "#FF1744" }}><path d="M12 12V2M8 6h8M6 10h12M12 12a4 4 0 0 0-4 4v4a2 2 0 0 0 4 2h0a2 2 0 0 0 2-2v-4a4 4 0 0 0-4-4Z" /><circle cx="12" cy="6" r="1" /></svg>
);

const IconTennis = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px", color: "#FF1744" }}><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" /><path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" /><path d="M2 12h20" /></svg>
);

const IconSwimming = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px", color: "#FF1744" }}><path d="M2 6c3-1.5 5 1.5 8 0s5-1.5 8 0 5 1.5 8 0M2 12c3-1.5 5 1.5 8 0s5-1.5 8 0 5 1.5 8 0M2 18c3-1.5 5 1.5 8 0s5-1.5 8 0 5 1.5 8 0" /></svg>
);

const IconMMA = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px", color: "#FF1744" }}><rect x="3" y="10" width="18" height="12" rx="2" /><path d="M7 10V5a5 5 0 0 1 10 0v5" /><path d="M12 14v4" /></svg>
);

const IconSportGeneric = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px", color: "#FF1744" }}><circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20" /></svg>
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

function getSportLabel(sport) {
  if (!sport) return "Sports";
  return sport.split("/").map(s => s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase()).join(" & ");
}

export default async function FindAcademyPage() {
  await dbConnect();
  const academies = await Academy.find({ status: "active" }).sort({ students: -1 }).lean();

  const sports = [...new Set(academies.flatMap(a => (a.sport || "").split("/").map(s => s.trim())).filter(Boolean))];
  const areas = [...new Set(academies.map(a => a.area).filter(Boolean))];
  const totalStudents = academies.reduce((s, a) => s + (a.students || 0), 0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "How do I find the best sports academy near me in Hyderabad?", acceptedAnswer: { "@type": "Answer", text: "Use GWD Sports to search and compare verified sports academies in Hyderabad. Filter by sport (cricket, football, badminton), area (KPHB, Kukatpally, Gachibowli), and rating. Each academy has detailed profiles with student count, win rates, and coach information. Book free trials directly." } },
      { "@type": "Question", name: "How many sports academies are listed on GWD Sports?", acceptedAnswer: { "@type": "Answer", text: `GWD Sports currently lists ${academies.length}+ verified sports academies in Hyderabad, covering ${sports.length} sports with ${totalStudents}+ active students.` } },
      { "@type": "Question", name: "Is it free to search for academies on GWD Sports?", acceptedAnswer: { "@type": "Answer", text: "Yes! Searching for and comparing sports academies on GWD Sports is completely free for parents. You can browse all listed academies, compare ratings and facilities, and book free trial sessions at no cost." } },
      { "@type": "Question", name: "What sports are available on GWD Sports?", acceptedAnswer: { "@type": "Answer", text: `GWD Sports lists academies for cricket, football, badminton, tennis, swimming, MMA, and more in Hyderabad. ${sports.length} sports are currently active on the platform.` } },
      { "@type": "Question", name: "Can I book a free trial at sports academies?", acceptedAnswer: { "@type": "Answer", text: "Yes! Most academies on GWD Sports offer free trial sessions. Click 'Request Free Trial' on any academy's profile page and your request will be sent directly to the academy via WhatsApp." } },
      { "@type": "Question", name: "What areas in Hyderabad does GWD Sports cover?", acceptedAnswer: { "@type": "Answer", text: `GWD Sports covers ${areas.length}+ areas in Hyderabad including ${areas.slice(0, 8).join(", ")}. New areas are added regularly as more academies join the platform.` } },
      { "@type": "Question", name: "How does GWD verify sports academies?", acceptedAnswer: { "@type": "Answer", text: "GWD Sports verifies academies through on-ground visits, coach credential checks, student count verification, and facility assessment. Verified academies receive the GWD Verified badge visible on their profile." } },
      { "@type": "Question", name: "What is the average fee for sports coaching in Hyderabad?", acceptedAnswer: { "@type": "Answer", text: "Sports coaching fees in Hyderabad typically range from ₹1,500 to ₹5,000 per month depending on the sport, academy quality, batch timings, and coaching level. Cricket and football coaching tends to be ₹2,000-4,000/month, while specialized sports like tennis can be ₹3,000-6,000/month." } },
      { "@type": "Question", name: "At what age should my child start sports coaching?", acceptedAnswer: { "@type": "Answer", text: "Most sports academies accept children from age 5-6 for beginner/introductory programs. Structured competitive coaching typically begins at age 7-8 for cricket and football, and age 6-7 for swimming and badminton. The ideal age varies by sport — visit individual academy pages for age group details." } },
      { "@type": "Question", name: "How do I list my academy on GWD Sports?", acceptedAnswer: { "@type": "Answer", text: "Academy owners can join GWD Sports by applying for the founding batch. Visit the 'Join GWD' section on the homepage. Founding members get verified badge, priority listing, lead generation, and content creation included." } },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Find Academy" },
    ],
  };

  const sportIcons = {
    cricket: <IconCricket />,
    football: <IconFootball />,
    badminton: <IconBadminton />,
    tennis: <IconTennis />,
    swimming: <IconSwimming />,
    mma: <IconMMA />,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="academy-profile-page ap-fade-in">
        <nav className="ap-nav">
          <Link href="/" className="ap-nav-logo">GWD <span>SPORTS</span></Link>
          <div className="ap-nav-links">
            <Link href="/sport/cricket">Cricket</Link>
            <Link href="/sport/football">Football</Link>
            <Link href="/sport/badminton">Badminton</Link>
            <Link href="/sport/tennis">Tennis</Link>
          </div>
        </nav>

        <div className="ap-breadcrumbs">
          <Link href="/">Home</Link>
          <span className="ap-bc-separator">›</span>
          <span className="ap-bc-current">Find Academy</span>
        </div>

        <section className="ap-hero">
          <div className="ap-hero-badge">🔍 ACADEMY FINDER</div>
          <h1 className="ap-hero-name">Find the Best Sports Academy Near You in Hyderabad</h1>
          <p className="ap-hero-meta">Search and compare {academies.length}+ GWD Verified sports academies across {areas.length} areas in Hyderabad. Cricket, football, badminton, tennis, swimming — all in one place. Book free trial sessions instantly.</p>
          
          <div className="ap-hero-stats">
            <div className="ap-stat-shell"><div className="ap-stat-core"><div className="ap-stat-val">{academies.length}+</div><div className="ap-stat-lbl">Verified Academies</div></div></div>
            <div className="ap-stat-shell"><div className="ap-stat-core"><div className="ap-stat-val">{totalStudents}+</div><div className="ap-stat-lbl">Active Students</div></div></div>
            <div className="ap-stat-shell"><div className="ap-stat-core"><div className="ap-stat-val">{sports.length}</div><div className="ap-stat-lbl">Sports</div></div></div>
            <div className="ap-stat-shell"><div className="ap-stat-core"><div className="ap-stat-val">{areas.length}</div><div className="ap-stat-lbl">Areas</div></div></div>
          </div>
        </section>

        {/* Browse by Sport */}
        <section className="ap-section">
          <h2 className="ap-sec-title">Browse by Sport</h2>
          <div className="ap-grid-3">
            {[
              { slug: "cricket", label: "Cricket" },
              { slug: "football", label: "Football" },
              { slug: "badminton", label: "Badminton" },
              { slug: "tennis", label: "Tennis" },
              { slug: "swimming", label: "Swimming" },
              { slug: "mma", label: "MMA & Martial Arts" },
            ].map(s => (
              <Link key={s.slug} href={`/sport/${s.slug}`} className="ap-card-shell" style={{ textAlign: "center" }}>
                <div className="ap-card-core">
                  {sportIcons[s.slug] || <IconSportGeneric />}
                  <div className="ap-nearby-name" style={{ fontSize: 15, marginTop: 4 }}>{s.label}</div>
                  <div className="ap-nearby-meta" style={{ marginTop: 2 }}>
                    {academies.filter(a => new RegExp(s.label.split(" ")[0], "i").test(a.sport)).length} academies
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Area */}
        <section className="ap-section">
          <h2 className="ap-sec-title">Browse by Area</h2>
          <div className="ap-grid-3">
            {areas.map((area, i) => {
              const areaSlug = area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              const count = academies.filter(a => a.area === area).length;
              return (
                <Link key={i} href={`/area/${areaSlug}`} className="ap-card-shell">
                  <div className="ap-card-core">
                    <div className="ap-nearby-name"><IconPin /> {area}</div>
                    <div className="ap-nearby-meta" style={{ marginTop: 4 }}>{count} {count === 1 ? "academy" : "academies"}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Academies */}
        <section className="ap-section">
          <h2 className="ap-sec-title">All Verified Academies ({academies.length})</h2>
          <div className="ap-grid-2">
            {academies.map((a, i) => (
              <Link key={i} href={`/academy/${getSlug(a)}`} className="ap-card-shell">
                <div className="ap-card-core">
                  <div className={`ap-nearby-badge ${a.badge === "founding" ? "founding" : ""}`}>
                    {a.badge === "founding" ? "GWD FOUNDING" : "GWD VERIFIED"}
                  </div>
                  <div className="ap-nearby-name" style={{ marginTop: 4 }}>{a.name}</div>
                  <div className="ap-nearby-meta" style={{ marginTop: 2, flexGrow: 1 }}>
                    {getSportLabel(a.sport)} · {a.area || "Hyderabad"} · {a.students || 0} students
                    {a.coach ? ` · ${a.coach}` : ""}
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
        </section>

        {/* Mega FAQ */}
        <section className="ap-section">
          <h2 className="ap-sec-title">Frequently Asked Questions</h2>
          <div className="ap-faq">
            <details className="ap-faq-item">
              <summary>How do I find the best sports academy near me in Hyderabad? <IconChevron /></summary>
              <p>Use GWD Sports to search and compare verified sports academies in Hyderabad. Filter by sport (cricket, football, badminton), area (KPHB, Kukatpally, Gachibowli), and rating. Book free trials directly.</p>
            </details>
            <details className="ap-faq-item">
              <summary>How many sports academies are listed on GWD Sports? <IconChevron /></summary>
              <p>GWD Sports currently lists {academies.length}+ verified sports academies in Hyderabad, covering {sports.length} sports with {totalStudents}+ active students.</p>
            </details>
            <details className="ap-faq-item">
              <summary>Is it free to search for academies? <IconChevron /></summary>
              <p>Yes! Searching and comparing academies on GWD Sports is completely free for parents.</p>
            </details>
            <details className="ap-faq-item">
              <summary>Can I book a free trial at sports academies? <IconChevron /></summary>
              <p>Yes! Most academies offer free trials. Click &quot;Request Free Trial&quot; on any profile page.</p>
            </details>
            <details className="ap-faq-item">
              <summary>What is the average fee for sports coaching in Hyderabad? <IconChevron /></summary>
              <p>Fees range from ₹1,500 to ₹5,000/month depending on sport, academy, and batch. Cricket/football: ₹2,000-4,000. Tennis: ₹3,000-6,000.</p>
            </details>
            <details className="ap-faq-item">
              <summary>At what age should my child start sports coaching? <IconChevron /></summary>
              <p>Most academies accept children from age 5-6 for beginners. Competitive coaching begins at 7-8 for cricket/football, 6-7 for swimming/badminton.</p>
            </details>
            <details className="ap-faq-item">
              <summary>How does GWD verify sports academies? <IconChevron /></summary>
              <p>Through on-ground visits, coach credential checks, student count verification, and facility assessment. Verified academies get the GWD Verified badge.</p>
            </details>
            <details className="ap-faq-item">
              <summary>What areas does GWD Sports cover? <IconChevron /></summary>
              <p>GWD Sports covers {areas.length}+ areas including {areas.slice(0, 8).join(", ")}. New areas added regularly.</p>
            </details>
            <details className="ap-faq-item">
              <summary>How do I list my academy on GWD Sports? <IconChevron /></summary>
              <p>Apply for the founding batch via the &quot;Join GWD&quot; section on the homepage. Founding members get verified badge, priority listing, and lead generation.</p>
            </details>
            <details className="ap-faq-item">
              <summary>What sports are available? <IconChevron /></summary>
              <p>Cricket, football, badminton, tennis, swimming, MMA, and more. {sports.length} sports are currently active.</p>
            </details>
          </div>
        </section>

        <section className="ap-bottom-cta">
          <h2>List Your Academy on GWD Sports</h2>
          <p>Get verified, appear in parent searches, receive trial requests. Join Hyderabad&apos;s #1 sports ecosystem.</p>
          <Link href="/#join" className="ap-cta-btn ap-cta-primary">
            Join GWD Sports
            <span className="ap-btn-icon-wrap">→</span>
          </Link>
        </section>

        <footer className="ap-footer">
          <div className="ap-footer-brand">GWD SPORTS <span>ECOSYSTEM</span></div>
          <div className="ap-footer-links">
            <Link href="/">Home</Link>
            <Link href="/sport/cricket">Cricket</Link>
            <Link href="/sport/football">Football</Link>
            <Link href="/sport/badminton">Badminton</Link>
            <Link href="/area/kphb">KPHB</Link>
            <Link href="/area/kukatpally">Kukatpally</Link>
          </div>
          <div className="ap-footer-copy">© 2026 GWD Global Pvt Ltd · Hyderabad, India</div>
        </footer>
      </main>
    </>
  );
}
