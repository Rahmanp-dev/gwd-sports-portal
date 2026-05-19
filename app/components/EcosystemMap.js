"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";

function createMarkerIcon(name = "", sport = "", delayClass = "") {
  // Shorten long names for the label
  const short = name.length > 22 ? name.slice(0, 20) + "…" : name;
  return L.divIcon({
    className: "",
    iconSize: [40, 56],
    iconAnchor: [20, 20],
    popupAnchor: [24, 10],
    html: `<div class="marker-container ${delayClass}">
      <div class="marker-pulse"></div>
      <div class="marker-mid"></div>
      <div class="marker-dot"></div>
      <div class="marker-label"><span class="marker-label-name">${short}</span><span class="marker-label-sport">${sport}</span></div>
    </div>`,
  });
}

/* ── Level badge colors ── */
function levelBadge(level) {
  const map = {
    national: { bg: "rgba(255,215,0,.15)", border: "rgba(255,215,0,.5)", color: "#ffd700", label: "NATIONAL" },
    state:    { bg: "rgba(76,175,80,.12)", border: "rgba(76,175,80,.4)", color: "#4caf50", label: "STATE" },
    district: { bg: "rgba(74,158,255,.12)", border: "rgba(74,158,255,.4)", color: "#4a9eff", label: "DISTRICT" },
  };
  const s = map[level] || map.district;
  return `<span class="sp-level" style="background:${s.bg};border-color:${s.border};color:${s.color}">${s.label}</span>`;
}

/* ── Build rich popup HTML ── */
function popupContent(a) {
  const badgeLabel = a.badge === "founding" ? "GWD Founding Academy" : a.badge === "premium" ? "GWD Premium Partner" : "GWD Verified";
  const stars = Array.from({ length: 3 }, (_, i) =>
    `<span class="star ${i < a.rating ? "filled" : ""}">&#9733;</span>`
  ).join("");

  // Star players section
  const playersArr = a.starPlayers || [];
  const playersHTML = playersArr.length > 0
    ? `<div class="popup-section">
        <div class="popup-sec-head">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          STAR PLAYERS
        </div>
        <div class="sp-list">${playersArr.slice(0, 3).map(p =>
          `<div class="sp-row">
            <div class="sp-avatar">${p.name.charAt(0)}</div>
            <div class="sp-info">
              <div class="sp-name">${p.name}</div>
              <div class="sp-ach">${p.achievement}</div>
            </div>
            ${levelBadge(p.level)}
          </div>`
        ).join("")}</div>
      </div>`
    : "";

  // Teams section
  const teamsArr = a.teams || [];
  const teamsHTML = teamsArr.length > 0
    ? `<div class="popup-section">
        <div class="popup-sec-head">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF1744" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          REGISTERED TEAMS
        </div>
        <div class="team-list">${teamsArr.slice(0, 2).map(t =>
          `<div class="team-row">
            <div class="team-icon">⚔</div>
            <div class="team-info">
              <div class="team-name">${t.name}</div>
              <div class="team-meta">${t.division} · W${t.wins}–L${t.losses}</div>
            </div>
            <div class="team-wr">${Math.round((t.wins / (t.wins + t.losses)) * 100)}%</div>
          </div>`
        ).join("")}</div>
      </div>`
    : "";

  // Metrics bar
  const metricsHTML = (a.matchesPlayed || a.trophies || a.winRate)
    ? `<div class="popup-metrics">
        ${a.matchesPlayed ? `<div class="pm-item"><div class="pm-val">${a.matchesPlayed}</div><div class="pm-lbl">Matches</div></div>` : ""}
        ${a.trophies ? `<div class="pm-item"><div class="pm-val pm-gold">${a.trophies}</div><div class="pm-lbl">Trophies</div></div>` : ""}
        ${a.winRate ? `<div class="pm-item"><div class="pm-val pm-green">${a.winRate}%</div><div class="pm-lbl">Win Rate</div></div>` : ""}
      </div>`
    : "";

  // Top rank badge
  const rankHTML = a.topRank
    ? `<div class="popup-top-rank"><svg width="10" height="10" viewBox="0 0 24 24" fill="#ffd700" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>${a.topRank}</div>`
    : "";

  return `<div class="popup-inner popup-rich">
    <div class="popup-header">
      <div class="popup-header-left">
        <div class="popup-name">${a.name}</div>
        <div class="popup-header-meta">
          <span class="popup-sport">${a.sport}</span>
          <span class="popup-area-tag">${a.area || a.city}</span>
        </div>
      </div>
      <div class="popup-stars">${stars}</div>
    </div>
    <div class="popup-badge">${badgeLabel}</div>
    ${rankHTML}
    ${metricsHTML}
    <div class="popup-divider"></div>
    <div class="popup-stat"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>${a.students} students · Est. ${a.founded}${a.coach ? " · Coach: " + a.coach : ""}</div>
    ${playersHTML}
    ${teamsHTML}
    <a href="#" class="popup-link">View Full Profile <span>&rarr;</span></a>
  </div>`;
}

export default function EcosystemMap({ academies = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  // Initialize map once
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [17.485, 78.3867],
      zoom: 13,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer(
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CartoDB</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    map.on("click", () => map.scrollWheelZoom.enable());

    L.circle([17.4885, 78.3868], {
      radius: 3000, color: "#FF1744", weight: 0.5,
      fillOpacity: 0, dashArray: "4 8", className: "radar-ring",
    }).addTo(map);

    mapInstance.current = map;
    if (typeof window !== "undefined") window.__gwdMap = map;

    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  // Update markers when academies change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
    if (polylineRef.current) { map.removeLayer(polylineRef.current); polylineRef.current = null; }

    const active = academies.filter((a) => a.status === "active");
    if (active.length === 0) return;

    if (active.length >= 2) {
      polylineRef.current = L.polyline(
        active.map((a) => [parseFloat(a.lat), parseFloat(a.lng)]),
        { color: "rgba(255,23,68,0.3)", weight: 1, dashArray: "4 6" }
      ).addTo(map);
    }

    const markers = active.map((a, i) => {
      const marker = L.marker([parseFloat(a.lat), parseFloat(a.lng)], {
        icon: createMarkerIcon(a.name, a.sport, i > 0 ? "marker-delay" : ""),
      }).addTo(map);

      // Determine popup width — smaller on mobile
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const hasPlayers = a.starPlayers && a.starPlayers.length > 0;
      const hasTeams = a.teams && a.teams.length > 0;
      const popupWidth = isMobile ? 260 : (hasPlayers || hasTeams) ? 320 : 260;
      const maxH = isMobile ? 320 : 420;

      marker.bindPopup(popupContent(a), {
        closeButton: true, offset: [4, 0], maxWidth: popupWidth, minWidth: isMobile ? 240 : popupWidth,
        maxHeight: maxH,
        autoPan: true, autoPanPaddingTopLeft: [60, 100], autoPanPaddingBottomRight: [60, 40],
        className: "popup-right",
      });

      // Gentle pan — offset center so popup has room on screen
      marker.on("click", () => {
        const lat = parseFloat(a.lat);
        const lng = parseFloat(a.lng);
        const currentZoom = map.getZoom();
        // Move marker slightly down-left so popup (right side, tall) is fully visible
        const offsetLat = isMobile ? 0.002 : 0.003;
        const offsetLng = isMobile ? 0 : -0.008;
        map.flyTo([lat - offsetLat, lng + offsetLng], Math.max(currentZoom, 13), { duration: 0.5 });
      });
      marker.on("popupclose", () => {
        if (active.length >= 2) {
          map.flyToBounds(L.latLngBounds(active.map((ac) => [parseFloat(ac.lat), parseFloat(ac.lng)])).pad(0.3), { duration: 0.8 });
        } else {
          map.flyTo([17.485, 78.3867], 13, { duration: 0.8 });
        }
      });

      return marker;
    });

    markersRef.current = markers;

    if (active.length >= 2) {
      map.fitBounds(L.latLngBounds(active.map((a) => [parseFloat(a.lat), parseFloat(a.lng)])).pad(0.3));
    }

    setTimeout(() => {
      markers.forEach((m, i) => {
        const el = m.getElement();
        if (el) {
          el.style.transform += " scale(0)";
          el.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
          setTimeout(() => {
            el.style.transform = el.style.transform.replace("scale(0)", "scale(1)");
          }, 400 + i * 200);
        }
      });
    }, 100);
  }, [academies]);

  return <div id="map" ref={mapRef} />;
}
