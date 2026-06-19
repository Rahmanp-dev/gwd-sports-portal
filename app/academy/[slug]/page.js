import dbConnect from "@/lib/db";
import Academy from "@/models/Academy";
import Link from "next/link";

const BASE_URL = "https://sports.gwdglobal.in";
const BADGE_LABELS = { founding: "GWD FOUNDING MEMBER", verified: "GWD VERIFIED", premium: "GWD ELITE", listed: "LISTED" };

/* ── SVG Icons ── */
const IconPin = () => (
  <svg className="ap-pin-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "6px", color: "#FF1744" }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);

const IconTiming = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "6px", color: "#FF1744" }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

const IconFee = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "6px", color: "#FF1744" }}><rect x="2" y="4" width="20" height="16" rx="2" /><line x1="12" y1="10" x2="12" y2="14" /><path d="M10 10h4" /></svg>
);

const IconEstablished = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "6px", color: "#FF1744" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);

const IconStar = ({ filled }) => (
  <svg className={`ap-star-icon ${filled ? "" : "empty"}`} viewBox="0 0 24 24" width="13" height="13"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
);

const IconChevron = () => (
  <svg className="ap-faq-icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
);

const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.488 2.01 14.039.989 11.417.989 5.981.989 1.56 5.358 1.556 10.787c-.001 1.637.432 3.237 1.256 4.664l-.992 3.613 3.731-.973c1.374.75 2.923 1.144 4.542 1.144-.002.001-.002.001 0 0z" /></svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);

const IconDirection = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
);

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
      <main style={{ background: "#050508", color: "#a1a1aa", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 28, color: "#fff", marginBottom: 8 }}>Academy Not Found</h1>
          <p style={{ color: "#666" }}>This academy doesn't exist or has been removed.</p>
          <Link href="/" style={{ color: "#FF1744", marginTop: 16, display: "inline-block", textDecoration: "underline" }}>← Back to GWD Sports</Link>
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

      <main className="academy-profile-page ap-fade-in">
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
          <span className="ap-bc-separator">›</span>
          {sportSlug && <><Link href={`/sport/${sportSlug}`}>{sport} Academies</Link><span className="ap-bc-separator">›</span></>}
          {areaSlug && <><Link href={`/area/${areaSlug}`}>{area}</Link><span className="ap-bc-separator">›</span></>}
          <span className="ap-bc-current">{academy.name}</span>
        </div>

        {/* Hero */}
        <section className="ap-hero">
          <div className={`ap-hero-badge ${academy.badge === "founding" ? "founding" : ""}`}>
            {BADGE_LABELS[academy.badge] || "GWD VERIFIED"}
          </div>
          <h1 className="ap-hero-name">{academy.name}</h1>
          <p className="ap-hero-meta">
            {sport} · {area || "Hyderabad"}{academy.founded ? ` · Est. ${academy.founded}` : ""}
          </p>
          <div className="ap-hero-stats">
            <div className="ap-stat-shell"><div className="ap-stat-core"><div className="ap-stat-val">{academy.students || 0}</div><div className="ap-stat-lbl">Students</div></div></div>
            <div className="ap-stat-shell"><div className="ap-stat-core"><div className="ap-stat-val">{academy.matchesPlayed || 0}</div><div className="ap-stat-lbl">Matches</div></div></div>
            <div className="ap-stat-shell"><div className="ap-stat-core"><div className="ap-stat-val">{academy.winRate || 0}%</div><div className="ap-stat-lbl">Win Rate</div></div></div>
            <div className="ap-stat-shell"><div className="ap-stat-core"><div className="ap-stat-val">{academy.trophies || 0}</div><div className="ap-stat-lbl">Trophies</div></div></div>
          </div>
          <div className="ap-hero-rating">
            {Array.from({ length: 5 }, (_, idx) => (
              <IconStar key={idx} filled={idx < Math.min(academy.rating || 1, 5)} />
            ))}
            <span className="ap-rating-text">GWD Rating</span>
          </div>
        </section>

        {/* CTA */}
        <section className="ap-cta-bar">
          <a href={`https://wa.me/${(academy.phone || "").replace(/[^0-9]/g, "")}`} className="ap-cta-btn ap-cta-primary" target="_blank" rel="noopener noreferrer">
            <IconWhatsApp />
            <span>Request Free Trial</span>
            <span className="ap-btn-icon-wrap">→</span>
          </a>
          {academy.phone && (
            <a href={`tel:${academy.phone}`} className="ap-cta-btn ap-cta-secondary">
              <IconPhone />
              <span>Call Academy</span>
              <span className="ap-btn-icon-wrap">→</span>
            </a>
          )}
          {academy.googleMapsUrl && (
            <a href={academy.googleMapsUrl} className="ap-cta-btn ap-cta-secondary" target="_blank" rel="noopener noreferrer">
              <IconDirection />
              <span>Get Directions</span>
              <span className="ap-btn-icon-wrap">→</span>
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
            {academy.timing && (
              <div className="ap-info-card">
                <div className="ap-info-label"><IconTiming /> Timings</div>
                <div className="ap-info-value">{academy.timing}</div>
              </div>
            )}
            {academy.feeRange && (
              <div className="ap-info-card">
                <div className="ap-info-label"><IconFee /> Fee Range</div>
                <div className="ap-info-value">{academy.feeRange}</div>
              </div>
            )}
            {academy.founded && (
              <div className="ap-info-card">
                <div className="ap-info-label"><IconEstablished /> Established</div>
                <div className="ap-info-value">{academy.founded}</div>
              </div>
            )}
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
                <div key={i} className="ap-card-shell">
                  <div className="ap-card-core ap-player-card">
                    <div className="ap-player-name">{p.name}</div>
                    <div className="ap-player-achievement" style={{ flexGrow: 1 }}>{p.achievement}</div>
                    <div style={{ marginTop: 10 }}>
                      <div className="ap-player-level">{(p.level || "district")}</div>
                    </div>
                  </div>
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
                <div key={i} className="ap-card-shell">
                  <div className="ap-card-core ap-team-card">
                    <div className="ap-team-name">{t.name}</div>
                    <div className="ap-team-meta">{t.sport} · {t.division}</div>
                    <div className="ap-team-record">{t.wins}W - {t.losses}L</div>
                  </div>
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
              <summary>What sports does {academy.name} offer? <IconChevron /></summary>
              <p>{academy.name} offers professional coaching in {sport}. {academy.ageGroups?.length ? `Available age groups: ${academy.ageGroups.join(", ")}.` : "Contact the academy for age group details."}</p>
            </details>
            <details className="ap-faq-item">
              <summary>Where is {academy.name} located? <IconChevron /></summary>
              <p>{academy.name} is located in {area || "Hyderabad"}, Telangana, India. {academy.googleMapsUrl ? "Click 'Get Directions' above for navigation." : ""}</p>
            </details>
            <details className="ap-faq-item">
              <summary>How many students are enrolled at {academy.name}? <IconChevron /></summary>
              <p>{academy.name} currently has {academy.students || 0} active students enrolled in their {sport.toLowerCase()} program.</p>
            </details>
            <details className="ap-faq-item">
              <summary>Can I book a free trial at {academy.name}? <IconChevron /></summary>
              <p>Yes! You can request a free trial at {academy.name} through GWD Sports. Click the &quot;Request Free Trial&quot; button above to send a trial request via WhatsApp.</p>
            </details>
            {academy.feeRange && (
              <details className="ap-faq-item">
                <summary>What are the fees at {academy.name}? <IconChevron /></summary>
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
                <Link key={i} href={`/academy/${getSlug(n)}`} className="ap-card-shell">
                  <div className="ap-card-core ap-nearby-card">
                    <div className={`ap-nearby-badge ${n.badge === "founding" ? "founding" : ""}`}>
                      {BADGE_LABELS[n.badge] || "VERIFIED"}
                    </div>
                    <div className="ap-nearby-name" style={{ marginTop: 4 }}>{n.name}</div>
                    <div className="ap-nearby-meta" style={{ marginTop: 2, flexGrow: 1 }}>{getSportLabel(n.sport)} · {n.area || "Hyderabad"} · {n.students || 0} students</div>
                    <div className="ap-hero-rating" style={{ marginTop: 12 }}>
                      {Array.from({ length: 5 }, (_, idx) => (
                        <IconStar key={idx} filled={idx < Math.min(n.rating || 1, 5)} />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="ap-bottom-cta">
          <h2>Your Academy Should Be Here</h2>
          <p>Join {academy.students || 0}+ student athletes on GWD Sports. Get verified, get discovered by parents, get more students.</p>
          <Link href="/#join" className="ap-cta-btn ap-cta-primary">
            Join GWD Sports
            <span className="ap-btn-icon-wrap">→</span>
          </Link>
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
