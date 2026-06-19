import dbConnect from "@/lib/db";
import Academy from "@/models/Academy";
import Link from "next/link";

const BASE_URL = "https://sports.gwdglobal.in";
const BADGE_LABELS = { founding: "GWD FOUNDING MEMBER", verified: "GWD VERIFIED", premium: "GWD ELITE", listed: "LISTED" };

function getSlug(a) {
  return a.slug || a.id || a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getSportLabel(sport) {
  if (!sport) return "Sports";
  return sport.split("/").map(s => s.trim().charAt(0).toUpperCase() + s.trim().slice(1).toLowerCase()).join(" & ");
}

// Generate all academy pages at build time
export async function generateStaticParams() {
  await dbConnect();
  const academies = await Academy.find({ status: "active" }).select("slug id name").lean();
  return academies.map((a) => ({ slug: getSlug(a) }));
}

// Dynamic SEO metadata per academy
export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  let academy = await Academy.findOne({ slug }).lean();
  if (!academy) academy = await Academy.findOne({ id: slug }).lean();
  if (!academy) return { title: "Academy Not Found" };

  const sport = getSportLabel(academy.sport);
  const area = academy.area || "Hyderabad";
  const title = academy.metaTitle || `${academy.name} | ${sport} Academy in ${area}, Hyderabad`;
  const desc = academy.description ||
    `${academy.name} is a GWD ${academy.badge === "founding" ? "Founding" : "Verified"} ${sport.toLowerCase()} academy in ${area}, Hyderabad. ${academy.students || 0} students enrolled. ${academy.coach ? `Head Coach: ${academy.coach}.` : ""} Book a free trial today.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `${BASE_URL}/academy/${slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${BASE_URL}/academy/${slug}`,
      siteName: "GWD Sports",
      type: "article",
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function AcademyPage({ params }) {
  const { slug } = await params;
  await dbConnect();
  let academy = await Academy.findOne({ slug }).lean();
  if (!academy) academy = await Academy.findOne({ id: slug }).lean();

  if (!academy) {
    return (
      <main style={{ background: "#0a0a0a", color: "#ccc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 28, color: "#fff", marginBottom: 8 }}>Academy Not Found</h1>
          <p style={{ color: "#666" }}>This academy doesn't exist or has been removed.</p>
          <Link href="/" style={{ color: "#D97706", marginTop: 16, display: "inline-block" }}>← Back to GWD Sports</Link>
        </div>
      </main>
    );
  }

  const sport = getSportLabel(academy.sport);
  const area = academy.area || "";
  const areaSlug = area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const sportSlug = (academy.sport || "").toLowerCase().split("/")[0].trim();

  // Nearby academies
  const nearby = await Academy.find({
    status: "active",
    _id: { $ne: academy._id },
    ...(area ? { area } : {}),
  }).limit(4).lean();

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "LocalBusiness"],
    name: academy.name,
    description: academy.description || `${sport} academy in ${area}, Hyderabad`,
    sport: academy.sport,
    url: `${BASE_URL}/academy/${slug}`,
    telephone: academy.phone || undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: area || "Hyderabad",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: academy.lat,
      longitude: academy.lng,
    },
    aggregateRating: academy.rating ? {
      "@type": "AggregateRating",
      ratingValue: Math.min(academy.rating * 1.5, 5).toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: String(academy.students || 10),
    } : undefined,
    ...(academy.feeRange ? { priceRange: academy.feeRange } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      ...(sportSlug ? [{ "@type": "ListItem", position: 2, name: `${sport} Academies`, item: `${BASE_URL}/sport/${sportSlug}` }] : []),
      ...(areaSlug ? [{ "@type": "ListItem", position: 3, name: area, item: `${BASE_URL}/area/${areaSlug}` }] : []),
      { "@type": "ListItem", position: (sportSlug ? 3 : 2) + (areaSlug ? 1 : 0), name: academy.name },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What sports does ${academy.name} offer?`,
        acceptedAnswer: { "@type": "Answer", text: `${academy.name} offers professional coaching in ${sport}. ${academy.ageGroups?.length ? `Age groups: ${academy.ageGroups.join(", ")}.` : ""}` },
      },
      {
        "@type": "Question",
        name: `Where is ${academy.name} located?`,
        acceptedAnswer: { "@type": "Answer", text: `${academy.name} is located in ${area || "Hyderabad"}, Telangana, India.` },
      },
      {
        "@type": "Question",
        name: `How many students are at ${academy.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `${academy.name} currently has ${academy.students || 0} active students enrolled in their ${sport.toLowerCase()} program.` },
      },
      {
        "@type": "Question",
        name: `Can I book a free trial at ${academy.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `Yes! You can request a free trial at ${academy.name} through the GWD Sports portal. Click the "Request Free Trial" button on their profile page.` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="academy-profile-page">
        {/* Nav */}
        <nav className="ap-nav">
          <Link href="/" className="ap-nav-logo">GWD <span>SPORTS</span></Link>
          <div className="ap-nav-links">
            <Link href="/find-academy">Find Academy</Link>
            <Link href={`/sport/${sportSlug}`}>{sport}</Link>
            {areaSlug && <Link href={`/area/${areaSlug}`}>{area}</Link>}
          </div>
        </nav>

        {/* Breadcrumbs */}
        <div className="ap-breadcrumbs">
          <Link href="/">Home</Link>
          <span>›</span>
          {sportSlug && <><Link href={`/sport/${sportSlug}`}>{sport} Academies</Link><span>›</span></>}
          {areaSlug && <><Link href={`/area/${areaSlug}`}>{area}</Link><span>›</span></>}
          <span className="ap-bc-current">{academy.name}</span>
        </div>

        {/* Hero */}
        <section className="ap-hero">
          <div className="ap-hero-badge">{BADGE_LABELS[academy.badge] || "GWD VERIFIED"}</div>
          <h1 className="ap-hero-name">{academy.name}</h1>
          <p className="ap-hero-meta">
            {sport} · {area || "Hyderabad"}{academy.founded ? ` · Est. ${academy.founded}` : ""}
          </p>
          <div className="ap-hero-stats">
            <div className="ap-stat"><div className="ap-stat-val">{academy.students || 0}</div><div className="ap-stat-lbl">Students</div></div>
            <div className="ap-stat"><div className="ap-stat-val">{academy.matchesPlayed || 0}</div><div className="ap-stat-lbl">Matches</div></div>
            <div className="ap-stat"><div className="ap-stat-val">{academy.winRate || 0}%</div><div className="ap-stat-lbl">Win Rate</div></div>
            <div className="ap-stat"><div className="ap-stat-val">{academy.trophies || 0}</div><div className="ap-stat-lbl">Trophies</div></div>
          </div>
          <div className="ap-hero-rating">
            {"★".repeat(Math.min(academy.rating || 1, 5))}{"☆".repeat(5 - Math.min(academy.rating || 1, 5))}
            <span className="ap-rating-text">GWD Rating</span>
          </div>
        </section>

        {/* CTA */}
        <section className="ap-cta-bar">
          <a href={`https://wa.me/${(academy.phone || "").replace(/[^0-9]/g, "")}`} className="ap-cta-btn ap-cta-primary" target="_blank" rel="noopener noreferrer">
            📱 Request Free Trial
          </a>
          {academy.phone && (
            <a href={`tel:${academy.phone}`} className="ap-cta-btn ap-cta-secondary">
              📞 Call Academy
            </a>
          )}
          {academy.googleMapsUrl && (
            <a href={academy.googleMapsUrl} className="ap-cta-btn ap-cta-secondary" target="_blank" rel="noopener noreferrer">
              📍 Get Directions
            </a>
          )}
        </section>

        {/* About */}
        <section className="ap-section">
          <h2 className="ap-sec-title">About {academy.name}</h2>
          <p className="ap-sec-text">
            {academy.description || `${academy.name} is a ${academy.badge === "founding" ? "founding member" : "verified"} ${sport.toLowerCase()} academy on the GWD Sports platform, located in ${area || "Hyderabad"}, Telangana. ${academy.coach ? `The academy is led by Coach ${academy.coach}` : "The academy"} currently trains ${academy.students || 0} student athletes. ${academy.matchesPlayed ? `With ${academy.matchesPlayed} competitive matches and a ${academy.winRate || 0}% win rate, ` : ""}${academy.name} is part of Hyderabad's growing sports ecosystem.`}
          </p>
          {academy.coach && (
            <div className="ap-info-card">
              <div className="ap-info-label">Head Coach</div>
              <div className="ap-info-value">{academy.coach}</div>
            </div>
          )}
          <div className="ap-info-grid">
            {academy.timing && <div className="ap-info-card"><div className="ap-info-label">Timings</div><div className="ap-info-value">{academy.timing}</div></div>}
            {academy.feeRange && <div className="ap-info-card"><div className="ap-info-label">Fee Range</div><div className="ap-info-value">{academy.feeRange}</div></div>}
            {academy.founded && <div className="ap-info-card"><div className="ap-info-label">Established</div><div className="ap-info-value">{academy.founded}</div></div>}
          </div>
          {academy.facilities?.length > 0 && (
            <>
              <h3 className="ap-subsec-title">Facilities</h3>
              <div className="ap-tags">{academy.facilities.map((f, i) => <span key={i} className="ap-tag">{f}</span>)}</div>
            </>
          )}
          {academy.ageGroups?.length > 0 && (
            <>
              <h3 className="ap-subsec-title">Age Groups</h3>
              <div className="ap-tags">{academy.ageGroups.map((g, i) => <span key={i} className="ap-tag">{g}</span>)}</div>
            </>
          )}
        </section>

        {/* Star Players */}
        {academy.starPlayers?.length > 0 && (
          <section className="ap-section">
            <h2 className="ap-sec-title">Star Players</h2>
            <div className="ap-grid-3">
              {academy.starPlayers.map((p, i) => (
                <div key={i} className="ap-player-card">
                  <div className="ap-player-name">{p.name}</div>
                  <div className="ap-player-achievement">{p.achievement}</div>
                  <div className="ap-player-level">{(p.level || "district").toUpperCase()}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Teams */}
        {academy.teams?.length > 0 && (
          <section className="ap-section">
            <h2 className="ap-sec-title">Teams</h2>
            <div className="ap-grid-2">
              {academy.teams.map((t, i) => (
                <div key={i} className="ap-team-card">
                  <div className="ap-team-name">{t.name}</div>
                  <div className="ap-team-meta">{t.sport} · {t.division}</div>
                  <div className="ap-team-record">{t.wins}W - {t.losses}L</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="ap-section">
          <h2 className="ap-sec-title">Frequently Asked Questions</h2>
          <div className="ap-faq">
            <details className="ap-faq-item">
              <summary>What sports does {academy.name} offer?</summary>
              <p>{academy.name} offers professional coaching in {sport}. {academy.ageGroups?.length ? `Available age groups: ${academy.ageGroups.join(", ")}.` : "Contact the academy for age group details."}</p>
            </details>
            <details className="ap-faq-item">
              <summary>Where is {academy.name} located?</summary>
              <p>{academy.name} is located in {area || "Hyderabad"}, Telangana, India. {academy.googleMapsUrl ? "Click 'Get Directions' above for navigation." : ""}</p>
            </details>
            <details className="ap-faq-item">
              <summary>How many students are enrolled at {academy.name}?</summary>
              <p>{academy.name} currently has {academy.students || 0} active students enrolled in their {sport.toLowerCase()} program.</p>
            </details>
            <details className="ap-faq-item">
              <summary>Can I book a free trial at {academy.name}?</summary>
              <p>Yes! You can request a free trial at {academy.name} through GWD Sports. Click the &quot;Request Free Trial&quot; button above to send a trial request via WhatsApp.</p>
            </details>
            {academy.feeRange && (
              <details className="ap-faq-item">
                <summary>What are the fees at {academy.name}?</summary>
                <p>Fees at {academy.name} range from {academy.feeRange}. Contact the academy for exact pricing for your preferred batch and age group.</p>
              </details>
            )}
          </div>
        </section>

        {/* Nearby */}
        {nearby.length > 0 && (
          <section className="ap-section">
            <h2 className="ap-sec-title">Other Academies {area ? `in ${area}` : "Nearby"}</h2>
            <div className="ap-grid-2">
              {nearby.map((n, i) => (
                <Link key={i} href={`/academy/${getSlug(n)}`} className="ap-nearby-card">
                  <div className="ap-nearby-badge">{BADGE_LABELS[n.badge] || "VERIFIED"}</div>
                  <div className="ap-nearby-name">{n.name}</div>
                  <div className="ap-nearby-meta">{getSportLabel(n.sport)} · {n.area || "Hyderabad"} · {n.students || 0} students</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="ap-bottom-cta">
          <h2>Your Academy Should Be Here</h2>
          <p>Join {academy.students || 0}+ student athletes on GWD Sports. Get verified, get discovered by parents, get more students.</p>
          <Link href="/#join" className="ap-cta-btn ap-cta-primary">Join GWD Sports →</Link>
        </section>

        {/* Footer */}
        <footer className="ap-footer">
          <div className="ap-footer-brand">GWD SPORTS <span>ECOSYSTEM</span></div>
          <div className="ap-footer-links">
            <Link href="/">Home</Link>
            <Link href="/find-academy">Find Academy</Link>
            <Link href="/sport/cricket">Cricket</Link>
            <Link href="/sport/football">Football</Link>
            <Link href="/sport/badminton">Badminton</Link>
          </div>
          <div className="ap-footer-copy">© 2026 GWD Global Pvt Ltd · Hyderabad, India</div>
        </footer>
      </main>
    </>
  );
}
