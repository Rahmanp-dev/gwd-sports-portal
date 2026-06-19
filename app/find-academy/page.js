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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="academy-profile-page">
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
          <Link href="/">Home</Link><span>›</span>
          <span className="ap-bc-current">Find Academy</span>
        </div>

        <section className="ap-hero">
          <div className="ap-hero-badge">🔍 ACADEMY FINDER</div>
          <h1 className="ap-hero-name">Find the Best Sports Academy Near You in Hyderabad</h1>
          <p className="ap-hero-meta">Search and compare {academies.length}+ GWD Verified sports academies across {areas.length} areas in Hyderabad. Cricket, football, badminton, tennis, swimming — all in one place. Book free trial sessions instantly.</p>
          <div className="ap-hero-stats">
            <div className="ap-stat"><div className="ap-stat-val">{academies.length}+</div><div className="ap-stat-lbl">Verified Academies</div></div>
            <div className="ap-stat"><div className="ap-stat-val">{totalStudents}+</div><div className="ap-stat-lbl">Active Students</div></div>
            <div className="ap-stat"><div className="ap-stat-val">{sports.length}</div><div className="ap-stat-lbl">Sports</div></div>
            <div className="ap-stat"><div className="ap-stat-val">{areas.length}</div><div className="ap-stat-lbl">Areas</div></div>
          </div>
        </section>

        {/* Browse by Sport */}
        <section className="ap-section">
          <h2 className="ap-sec-title">Browse by Sport</h2>
          <div className="ap-grid-3" style={{ gap: 10 }}>
            {[
              { slug: "cricket", emoji: "🏏", label: "Cricket" },
              { slug: "football", emoji: "⚽", label: "Football" },
              { slug: "badminton", emoji: "🏸", label: "Badminton" },
              { slug: "tennis", emoji: "🎾", label: "Tennis" },
              { slug: "swimming", emoji: "🏊", label: "Swimming" },
              { slug: "mma", emoji: "🥊", label: "MMA & Martial Arts" },
            ].map(s => (
              <Link key={s.slug} href={`/sport/${s.slug}`} className="ap-nearby-card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{s.emoji}</div>
                <div className="ap-nearby-name" style={{ fontSize: 15 }}>{s.label}</div>
                <div className="ap-nearby-meta">{academies.filter(a => new RegExp(s.label.split(" ")[0], "i").test(a.sport)).length} academies</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Area */}
        <section className="ap-section">
          <h2 className="ap-sec-title">Browse by Area</h2>
          <div className="ap-grid-3" style={{ gap: 10 }}>
            {areas.map((area, i) => {
              const areaSlug = area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
              const count = academies.filter(a => a.area === area).length;
              return (
                <Link key={i} href={`/area/${areaSlug}`} className="ap-nearby-card">
                  <div className="ap-nearby-name">📍 {area}</div>
                  <div className="ap-nearby-meta">{count} {count === 1 ? "academy" : "academies"}</div>
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
              <Link key={i} href={`/academy/${getSlug(a)}`} className="ap-nearby-card">
                <div className="ap-nearby-badge">{a.badge === "founding" ? "GWD FOUNDING" : "GWD VERIFIED"}</div>
                <div className="ap-nearby-name">{a.name}</div>
                <div className="ap-nearby-meta">
                  {getSportLabel(a.sport)} · {a.area || "Hyderabad"} · {a.students || 0} students
                  {a.coach ? ` · ${a.coach}` : ""}
                </div>
                <div style={{ fontSize: 14, color: "#D97706", marginTop: 6, letterSpacing: 1 }}>
                  {"★".repeat(Math.min(a.rating || 1, 5))}{"☆".repeat(5 - Math.min(a.rating || 1, 5))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mega FAQ */}
        <section className="ap-section">
          <h2 className="ap-sec-title">Frequently Asked Questions</h2>
          <div className="ap-faq">
            <details className="ap-faq-item"><summary>How do I find the best sports academy near me in Hyderabad?</summary><p>Use GWD Sports to search and compare verified sports academies in Hyderabad. Filter by sport (cricket, football, badminton), area (KPHB, Kukatpally, Gachibowli), and rating. Book free trials directly.</p></details>
            <details className="ap-faq-item"><summary>How many sports academies are listed on GWD Sports?</summary><p>GWD Sports currently lists {academies.length}+ verified sports academies in Hyderabad, covering {sports.length} sports with {totalStudents}+ active students.</p></details>
            <details className="ap-faq-item"><summary>Is it free to search for academies?</summary><p>Yes! Searching and comparing academies on GWD Sports is completely free for parents.</p></details>
            <details className="ap-faq-item"><summary>Can I book a free trial at sports academies?</summary><p>Yes! Most academies offer free trials. Click &quot;Request Free Trial&quot; on any profile page.</p></details>
            <details className="ap-faq-item"><summary>What is the average fee for sports coaching in Hyderabad?</summary><p>Fees range from ₹1,500 to ₹5,000/month depending on sport, academy, and batch. Cricket/football: ₹2,000-4,000. Tennis: ₹3,000-6,000.</p></details>
            <details className="ap-faq-item"><summary>At what age should my child start sports coaching?</summary><p>Most academies accept children from age 5-6 for beginners. Competitive coaching begins at 7-8 for cricket/football, 6-7 for swimming/badminton.</p></details>
            <details className="ap-faq-item"><summary>How does GWD verify sports academies?</summary><p>Through on-ground visits, coach credential checks, student count verification, and facility assessment. Verified academies get the GWD Verified badge.</p></details>
            <details className="ap-faq-item"><summary>What areas does GWD Sports cover?</summary><p>GWD Sports covers {areas.length}+ areas including {areas.slice(0, 8).join(", ")}. New areas added regularly.</p></details>
            <details className="ap-faq-item"><summary>How do I list my academy on GWD Sports?</summary><p>Apply for the founding batch via the &quot;Join GWD&quot; section on the homepage. Founding members get verified badge, priority listing, and lead generation.</p></details>
            <details className="ap-faq-item"><summary>What sports are available?</summary><p>Cricket, football, badminton, tennis, swimming, MMA, and more. {sports.length} sports are currently active.</p></details>
          </div>
        </section>

        <section className="ap-bottom-cta">
          <h2>List Your Academy on GWD Sports</h2>
          <p>Get verified, appear in parent searches, receive trial requests. Join Hyderabad&apos;s #1 sports ecosystem.</p>
          <Link href="/#join" className="ap-cta-btn ap-cta-primary">Join GWD Sports →</Link>
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
