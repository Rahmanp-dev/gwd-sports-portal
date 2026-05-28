"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";

const EcosystemMap = dynamic(() => import("./components/EcosystemMap"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "#050508" }} />,
});

/* ── CountUp hook ── */
function useCountUp(end, duration = 2000, startOnView = false) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  const endRef = useRef(end);
  endRef.current = end;

  useEffect(() => {
    if (!startOnView) { animate(); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; animate(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  function animate() {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * endRef.current));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  return [val, ref];
}

/* ── Scroll fade-in ── */
function useFadeIn(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Removed the opacity: 0 hack because it was causing the page to go permanently blank on some browsers/devices if IntersectionObserver failed to fire.
    // We'll rely on natural rendering.
  }, [delay]);
  return ref;
}

/* ── SVG Icons ── */
const IconBuilding = () => (
  <svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="9" y1="7" x2="9" y2="7.01" /><line x1="15" y1="7" x2="15" y2="7.01" /><line x1="9" y1="12" x2="9" y2="12.01" /><line x1="15" y1="12" x2="15" y2="12.01" /><line x1="9" y1="17" x2="15" y2="17" /></svg>
);
const IconCard = () => (
  <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><circle cx="8" cy="15" r="1.5" /></svg>
);
const IconNetwork = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="3" /><circle cx="5" cy="19" r="3" /><circle cx="19" cy="19" r="3" /><line x1="12" y1="8" x2="5" y2="16" /><line x1="12" y1="8" x2="19" y2="16" /><line x1="5" y1="19" x2="19" y2="19" /></svg>
);

const BADGE_LABELS = { founding: "GWD FOUNDING MEMBER", verified: "GWD VERIFIED", premium: "GWD PREMIUM" };
const BADGE_SHORT = { founding: "FOUNDING", verified: "VERIFIED", premium: "PREMIUM" };

/* Check if academy is Mastergrade (Founding Academy #1) or Bhavans */
const isMastergrade = (name) => name && /master\s*grade/i.test(name);
const isBhavans = (name) => name && /bhavan/i.test(name);
const FoundingTag = () => <span className="founding-one-tag">#1</span>;

/* ══════════════════════════════════
   ACADEMY DETAILS PANEL
   ══════════════════════════════════ */
function AcademyDetailsPanel({ academy, onClose }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (academy) {
      // Small delay to allow DOM to mount before triggering transition
      const timer = setTimeout(() => setActive(true), 10);
      return () => clearTimeout(timer);
    } else {
      setActive(false);
    }
  }, [academy]);

  if (!academy && !active) return null;

  const badgeLabel = academy?.badge === "founding" ? "GWD Founding Academy" : academy?.badge === "premium" ? "GWD Premium Partner" : "GWD Verified";
  const stars = Array.from({ length: 3 }, (_, i) =>
    `<span class="star ${i < (academy?.rating || 0) ? "filled" : ""}">&#9733;</span>`
  ).join("");

  return (
    <div className={`academy-panel-overlay ${active ? "active" : ""}`} onClick={(e) => {
      // Close if clicking the overlay (outside the panel)
      if (e.target.classList.contains('academy-panel-overlay')) onClose();
    }}>
      <div className="academy-panel">
        <button className="ap-close" onClick={onClose}>&times;</button>
        
        <div className="ap-header">
          <div className="ap-name">{academy?.name} {isMastergrade(academy?.name) && <FoundingTag />}</div>
          <div className="ap-meta">
            <span className="ap-sport">{academy?.sport}</span>
            <span className="ap-area">{academy?.area || academy?.city}</span>
          </div>
          <div className="ap-stars" dangerouslySetInnerHTML={{ __html: stars }} />
        </div>

        <div className="ap-badge">{badgeLabel}</div>
        
        {academy?.topRank && (
          <div className="ap-top-rank">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffd700" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {academy.topRank}
          </div>
        )}

        {(academy?.matchesPlayed || academy?.trophies || academy?.winRate) && (
          <div className="ap-metrics">
            {academy?.matchesPlayed && <div className="ap-metric-item"><div className="ap-metric-val">{academy.matchesPlayed}</div><div className="ap-metric-lbl">Matches</div></div>}
            {academy?.trophies && <div className="ap-metric-item"><div className="ap-metric-val ap-gold">{academy.trophies}</div><div className="ap-metric-lbl">Trophies</div></div>}
            {academy?.winRate && <div className="ap-metric-item"><div className="ap-metric-val ap-green">{academy.winRate}%</div><div className="ap-metric-lbl">Win Rate</div></div>}
          </div>
        )}

        <div className="ap-divider" />
        
        <div className="ap-stat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          {academy?.students} students &middot; Est. {academy?.founded}{academy?.coach ? ` · Coach: ${academy.coach}` : ""}
        </div>

        {academy?.starPlayers && academy.starPlayers.length > 0 && (
          <div className="ap-section">
            <div className="ap-sec-head">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              STAR PLAYERS
            </div>
            <div className="ap-list">
              {academy.starPlayers.slice(0, 3).map((p, i) => {
                const isNat = p.level === "national";
                const badgeColor = isNat ? "#ffd700" : p.level === "state" ? "#4caf50" : "#4a9eff";
                const badgeBg = isNat ? "rgba(255,215,0,.15)" : p.level === "state" ? "rgba(76,175,80,.12)" : "rgba(74,158,255,.12)";
                return (
                  <div className="ap-row" key={i}>
                    <div className="ap-avatar">{p.name.charAt(0)}</div>
                    <div className="ap-info">
                      <div className="ap-row-name">{p.name}</div>
                      <div className="ap-ach">{p.achievement}</div>
                    </div>
                    <span className="ap-level-badge" style={{ color: badgeColor, background: badgeBg, borderColor: badgeColor }}>{p.level.toUpperCase()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {academy?.teams && academy.teams.length > 0 && (
          <div className="ap-section">
            <div className="ap-sec-head">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1744" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              REGISTERED TEAMS
            </div>
            <div className="ap-list">
              {academy.teams.slice(0, 2).map((t, i) => (
                <div className="ap-team-row" key={i}>
                  <div className="ap-team-icon">⚔</div>
                  <div className="ap-info">
                    <div className="ap-row-name">{t.name}</div>
                    <div className="ap-meta-sub">{t.division} &middot; W{t.wins}–L{t.losses}</div>
                  </div>
                  <div className="ap-team-wr">{Math.round((t.wins / (t.wins + t.losses)) * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <a href="#" className="ap-link">View Full Profile <span>&rarr;</span></a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   STATIC LEADERBOARD + REGION TABS
   ══════════════════════════════════ */
function Leaderboard({ academies }) {
  const [activeTab, setActiveTab] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const active = academies.filter((a) => a.status === "active");

  // Auto-build region tabs from data
  const regions = useMemo(() => {
    const areas = [...new Set(active.map((a) => a.area).filter(Boolean))];
    return areas.sort();
  }, [active]);

  // Filter + sort (Mastergrade 1st, Bhavans 2nd, rest random)
  const filtered = useMemo(() => {
    const list = activeTab === "all" ? [...active] : active.filter((a) => a.area === activeTab);
    return list.sort((a, b) => {
      const aM = isMastergrade(a.name);
      const bM = isMastergrade(b.name);
      if (aM && !bM) return -1;
      if (!aM && bM) return 1;

      const aB = isBhavans(a.name);
      const bB = isBhavans(b.name);
      if (aB && !bB) return -1;
      if (!aB && bB) return 1;

      return Math.random() - 0.5;
    });
  }, [active, activeTab]);

  const maxStudents = Math.max(...active.map((a) => a.students || 0), 1);

  // Zoom map to region when tab clicked
  const handleTabClick = async (tab) => {
    setActiveTab(tab);
    setShowAll(false);
    const map = window.__gwdMap;
    if (!map) return;

    const leaflet = (await import("leaflet")).default;

    if (tab === "all") {
      if (active.length >= 2) {
        const bounds = leaflet.latLngBounds(active.map((a) => [parseFloat(a.lat), parseFloat(a.lng)]));
        map.flyToBounds(bounds.pad(0.15), { duration: 0.8 });
      }
    } else {
      const inRegion = active.filter((a) => a.area === tab);
      if (inRegion.length === 1) {
        map.flyTo([parseFloat(inRegion[0].lat), parseFloat(inRegion[0].lng)], 15, { duration: 0.8 });
      } else if (inRegion.length >= 2) {
        const bounds = leaflet.latLngBounds(inRegion.map((a) => [parseFloat(a.lat), parseFloat(a.lng)]));
        map.flyToBounds(bounds.pad(0.2), { duration: 0.8 });
      }
    }
  };

  // Click academy row → fly to it
  const handleRowClick = (a) => {
    const map = window.__gwdMap;
    if (map) map.flyTo([parseFloat(a.lat), parseFloat(a.lng)], 16, { duration: 0.8 });
  };

  return (
    <div className="lb-panel">
      {/* Header */}
      <div className="lb-head">
        <div className="lb-head-top">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF1744" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
          <span className="lb-title">ACADEMY LEADERBOARD</span>
          <span className="lb-count">{filtered.length}</span>
        </div>

        {/* Region tabs */}
        <div className="lb-tabs">
          <button
            className={`lb-tab ${activeTab === "all" ? "lb-tab-active" : ""}`}
            onClick={() => handleTabClick("all")}
          >All</button>
          {regions.map((r) => (
            <button
              key={r}
              className={`lb-tab ${activeTab === r ? "lb-tab-active" : ""}`}
              onClick={() => handleTabClick(r)}
            >{r}</button>
          ))}
        </div>
      </div>

      {/* Academy list — paginated */}
      <div className="lb-list">
        {(showAll ? filtered : filtered.slice(0, 10)).map((a, i) => (
          <div
            key={a.id}
            className={`lb-row ${i === 0 ? "lb-row-top" : ""}`}
            onClick={() => handleRowClick(a)}
          >
            <div className="lb-pos">
              {i === 0 ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF1744" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <div className="lb-detail">
              <div className="lb-name">{a.name} {isMastergrade(a.name) && <FoundingTag />}</div>
              <div className="lb-meta-row">
                <span className={`lb-badge lb-badge-${a.badge || "verified"}`}>{BADGE_SHORT[a.badge] || "VERIFIED"}</span>
                <span className="lb-sport">{a.sport}</span>
                {a.area && <span className="lb-area-tag">{a.area}</span>}
              </div>
            </div>
            <div className="lb-score">
              <div className="lb-score-num">{a.students || 0}</div>
              <div className="lb-score-bar">
                <div className="lb-score-fill" style={{ width: `${((a.students || 0) / maxStudents) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="lb-empty-msg">No academies in this region yet.</div>
        )}
        {!showAll && filtered.length > 10 && (
          <button className="lb-show-more" onClick={() => setShowAll(true)}>
            Show all {filtered.length} academies
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="lb-foot">
        <span className="lb-signal" />
        Ecosystem Live · Hyderabad
      </div>
    </div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [academies, setAcademies] = useState([]);
  const [selectedAcademy, setSelectedAcademy] = useState(null);

  useEffect(() => {
    fetch("/api/academies").then((r) => r.json()).then(setAcademies).catch(() => {});
  }, []);

  const active = useMemo(() => {
    const list = academies.filter((a) => a.status === "active");
    return list.sort((a, b) => {
      const aM = isMastergrade(a.name);
      const bM = isMastergrade(b.name);
      if (aM && !bM) return -1;
      if (!aM && bM) return 1;

      const aB = isBhavans(a.name);
      const bB = isBhavans(b.name);
      if (aB && !bB) return -1;
      if (!aB && bB) return 1;

      return Math.random() - 0.5;
    });
  }, [academies]);
  const totalStudents = active.reduce((s, a) => s + (a.students || 0), 0);
  const activeSports = [...new Set(active.map((a) => a.sport))].length;

  const [c1] = useCountUp(active.length || 2, 1500);
  const [c2] = useCountUp(activeSports || 1, 1500);
  const [s1, s1Ref] = useCountUp(active.length || 2, 1800, true);
  const [s2, s2Ref] = useCountUp(totalStudents || 105, 2200, true);
  const [s3, s3Ref] = useCountUp(activeSports || 1, 1200, true);
  const [s4, s4Ref] = useCountUp(2025, 1800, true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    if (typeof gsap !== "undefined") {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".map-wrap", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0);
      tl.fromTo(".nav", { y: -56 }, { y: 0, duration: 0.4 }, 0.2);
      tl.fromTo(".cmd-header", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.4);
      tl.fromTo(".hud-strip", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.6);
      tl.fromTo(".lb-panel", { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, 0.7);
      tl.fromTo(".scroll-indicator", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.9);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dirRef = useFadeIn(0);
  const hiwRef = useFadeIn(0);
  const ctaRef = useFadeIn(0);

  const renderStars = (filled, total = 3) =>
    Array.from({ length: total }, (_, i) => (
      <span key={i} className={`star ${i < filled ? "filled" : ""}`}>&#9733;</span>
    ));

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#" className="nav-logo">GWD <span>SPORTS</span></a>
        <div className="nav-links">
          <a href="#ecosystem">Ecosystem</a>
          <a href="#leagues">Leagues</a>
          <a href="#rankings">Rankings</a>
          <a href="#join" className="nav-cta">Join GWD</a>
        </div>
      </nav>

      <section className="hero">
        <div className="map-wrap">
          <EcosystemMap academies={academies} onAcademyClick={setSelectedAcademy} />
          <div className="scanline-overlay" />
          <div className="vignette" />
        </div>

        <div className="hero-content">
          <div className="cmd-header">
            <div className="cmd-label">GWD SPORTS ECOSYSTEM</div>
            <h1 className="cmd-title">Hyderabad&apos;s<br/>Sports Grid</h1>
            <p className="cmd-sub">Every academy. Every student. One living ecosystem.</p>
            <div className="cmd-ctas">
              <button className="btn-primary">Join the Ecosystem</button>
              <button className="btn-secondary">Watch Demo</button>
            </div>
            <div className="cmd-meta">{active.length} academies live &middot; Hyderabad &middot; Est. 2025</div>
          </div>

          <div className="hud-strip">
            <div className="hud-stat">
              <div className="hud-val">{c1}</div>
              <div className="hud-lbl">Academies Live</div>
            </div>
            <div className="hud-stat">
              <div className="hud-val">{c2}</div>
              <div className="hud-lbl">Sports</div>
            </div>
            <div className="hud-stat">
              <div className="hud-val">Hyd</div>
              <div className="hud-lbl">City</div>
            </div>
          </div>

          <Leaderboard academies={academies} />

          <div className="scroll-indicator">
            <span className="scroll-text">SCROLL TO EXPLORE</span>
            <span className="scroll-arrow" />
          </div>

          <div className="mobile-scroll-hint">
            Scroll to Explore &darr;
          </div>

            <div className="custom-zoom">
              <button onClick={() => window.__gwdMap?.zoomIn()} aria-label="Zoom in">+</button>
              <button onClick={() => window.__gwdMap?.zoomOut()} aria-label="Zoom out">&minus;</button>
            </div>
          </div>
          <AcademyDetailsPanel academy={selectedAcademy} onClose={() => setSelectedAcademy(null)} />
        </section>

      <section className="stats-bar" id="ecosystem">
        <div className="stats-row">
          <div className="stat-item" ref={s1Ref}><div className="stat-num">{s1}</div><div className="stat-lbl">Founding Academies</div></div>
          <div className="stat-item" ref={s2Ref}><div className="stat-num">{s2}</div><div className="stat-lbl">Student Athletes</div></div>
          <div className="stat-item" ref={s3Ref}><div className="stat-num">{s3}</div><div className="stat-lbl">Sports Live</div></div>
          <div className="stat-item" ref={s4Ref}><div className="stat-num">{s4}</div><div className="stat-lbl">Established</div></div>
        </div>
      </section>

      <section className="section" ref={dirRef} id="rankings">
        <div className="sec-label">LIVE ACADEMIES</div>
        <h2 className="sec-title">Hyderabad&apos;s Founding Ecosystem</h2>
        <p className="sec-sub">The first academies to join the GWD network. Every student they train is now part of something bigger.</p>
        <div className="academy-grid">
          {active.map((a, i) => (
            <div className="academy-card" key={a.id || i} style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="card-badge">{BADGE_LABELS[a.badge] || "GWD VERIFIED"}</span>
              <div className="card-name">{a.name} {isMastergrade(a.name) && <FoundingTag />}</div>
              <div className="card-sport">{a.sport}{a.area ? ` · ${a.area}` : ""}</div>
              <div className="card-divider" />
              <div className="card-stats">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                  {a.students} students
                </span>
                <span>{a.city}</span>
              </div>
              <div className="card-rating">
                <div className="card-rating-label">GWD RATING</div>
                <div className="card-stars">{renderStars(a.rating)}</div>
                <div className="card-verified">{a.badge === "founding" ? "Verified — Founding Academy" : a.badge === "premium" ? "Premium Partner" : "Verified Academy"}</div>
              </div>
              <div className="card-view">View Academy <span>&rarr;</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="hiw-section" ref={hiwRef} id="leagues">
        <div className="sec-label">THE ECOSYSTEM</div>
        <h2 className="sec-title">One system. Every academy.</h2>
        <div className="hiw-steps">
          <div className="hiw-step">
            <div className="hiw-num">1</div>
            <div className="hiw-icon"><IconBuilding /></div>
            <div className="hiw-name">Academy joins GWD</div>
            <div className="hiw-desc">Onboard in 48 hours. Full platform access. Every student tracked from day one.</div>
          </div>
          <div className="hiw-step">
            <div className="hiw-num">2</div>
            <div className="hiw-icon"><IconCard /></div>
            <div className="hiw-name">Students get their Passport</div>
            <div className="hiw-desc">A digital identity that follows them across sports, academies, and tournaments.</div>
          </div>
          <div className="hiw-step">
            <div className="hiw-num">3</div>
            <div className="hiw-icon"><IconNetwork /></div>
            <div className="hiw-name">Ecosystem grows together</div>
            <div className="hiw-desc">Leagues, rankings, sponsorships, and data — powered by every academy on the grid.</div>
          </div>
        </div>
      </section>

      <section className="cta-section" ref={ctaRef} id="join">
        <div className="cta-box">
          <div className="sec-label">JOIN THE FOUNDING BATCH</div>
          <h2 className="cta-headline">Your academy belongs on this map.</h2>
          <p className="cta-sub">We are onboarding founding academies in Hyderabad right now. Limited slots.</p>
          <button className="cta-btn">Apply for Founding Membership</button>
          <p className="cta-note">No setup fee for founding academies &middot; Full platform access &middot; Founding badge</p>
        </div>
      </section>

      <footer className="footer">
        <div>
          <div className="footer-brand">GWD SPORTS <span>ECOSYSTEM</span></div>
          <div className="footer-tagline">Building the digital backbone of Indian sports. Starting in Hyderabad.</div>
        </div>
        <div className="footer-copy">&copy; 2026 GWD Global Pvt Ltd &middot; Hyderabad, India</div>
      </footer>
    </>
  );
}
