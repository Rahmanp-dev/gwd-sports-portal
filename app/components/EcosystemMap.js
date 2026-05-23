"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";

/* ═══════════════════════════════════════════
   PROGRESSIVE-DETAIL MARKER SYSTEM
   ─ Zoom ≤13 : Clusters (auto)
   ─ Zoom 14-15: Static ring + core dot
   ─ Zoom ≥16 : Full animated node (pulse ring + hexagon core + glow)
   CSS controls visibility via [data-zoom] on map container
   ═══════════════════════════════════════════ */

function createMarkerIcon(name = "", sport = "", idx = 0) {
  const short = name.length > 22 ? name.slice(0, 20) + "…" : name;
  // Stagger animation delays so pulses aren't all in sync
  const delay = ((idx * 0.37) % 2.4).toFixed(2);
  const delay2 = (((idx * 0.37) + 1.2) % 2.4).toFixed(2);

  return L.divIcon({
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
    html: `<div class="gwd-node">
      <div class="gwd-node-pulse" style="animation-delay:${delay}s"></div>
      <div class="gwd-node-pulse gwd-node-pulse-2" style="animation-delay:${delay2}s"></div>
      <div class="gwd-node-ring"></div>
      <div class="gwd-node-core"></div>
      <div class="gwd-node-label">
        <span class="gwd-node-name">${short}</span>
        <span class="gwd-node-sport">${sport}</span>
      </div>
    </div>`,
  });
}

export default function EcosystemMap({ academies = [], onAcademyClick }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const clusterRef = useRef(null);

  // Initialize map once
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [17.46, 78.39],
      zoom: 12,
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
    });

    L.tileLayer(
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CartoDB</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    map.on("click", () => {
        map.scrollWheelZoom.enable();
        // Clear selection if clicking on empty map area
        if (onAcademyClick) onAcademyClick(null);
    });

    // ── Progressive detail: set data-zoom on container ──
    const updateZoomClass = () => {
      const z = map.getZoom();
      mapRef.current?.setAttribute("data-zoom", Math.floor(z));
    };
    map.on("zoomend", updateZoomClass);
    updateZoomClass();

    mapInstance.current = map;
    if (typeof window !== "undefined") window.__gwdMap = map;

    // Force Leaflet to recalculate container size after layout settles
    setTimeout(() => map.invalidateSize(), 200);
    window.addEventListener("resize", () => map.invalidateSize());

    return () => { map.remove(); mapInstance.current = null; };
  }, [onAcademyClick]);

  // Update markers when academies change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
      clusterRef.current = null;
    }

    const active = academies.filter((a) => a.status === "active");
    if (active.length === 0) return;

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 55,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 15,
      chunkedLoading: true,
      chunkInterval: 100,
      chunkDelay: 10,
      animate: true,
      animateAddingMarkers: false,
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        let sizeClass = "cluster-sm";
        if (count >= 20) sizeClass = "cluster-lg";
        else if (count >= 5) sizeClass = "cluster-md";

        return L.divIcon({
          html: `<div class="gwd-cluster ${sizeClass}">
            <div class="gwd-cluster-pulse"></div>
            <div class="gwd-cluster-ring"></div>
            <span>${count}</span>
          </div>`,
          className: "",
          iconSize: L.point(52, 52),
        });
      },
    });

    active.forEach((a, idx) => {
      const marker = L.marker([parseFloat(a.lat), parseFloat(a.lng)], {
        icon: createMarkerIcon(a.name, a.sport, idx),
      });

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e); // Prevent map click event (which clears selection)
        const lat = parseFloat(a.lat);
        const lng = parseFloat(a.lng);
        const currentZoom = map.getZoom();
        
        // Offset significantly to the left if panel opens on the right
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        // On mobile, panel is at bottom, so offset center down. On desktop, panel is right, so offset center right.
        const offsetLat = isMobile ? 0.005 : 0;
        const offsetLng = isMobile ? 0 : -0.008; 
        
        map.flyTo([lat - offsetLat, lng - offsetLng], Math.max(currentZoom, 16), { duration: 0.5 });
        
        if (onAcademyClick) {
            onAcademyClick(a);
        }
      });

      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    clusterRef.current = cluster;

    if (active.length >= 2) {
      const bounds = L.latLngBounds(active.map((a) => [parseFloat(a.lat), parseFloat(a.lng)]));
      map.fitBounds(bounds.pad(0.15));
    }
  }, [academies, onAcademyClick]);

  return <div id="map" ref={mapRef} />;
}
