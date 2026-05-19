"use client";
import { useEffect, useState } from "react";

const SPORTS = ["Cricket", "Football", "Badminton", "Tennis", "Swimming", "Athletics", "Basketball", "Kabaddi", "Hockey", "Table Tennis"];
const BADGES = [
  { value: "founding", label: "Founding Member" },
  { value: "verified", label: "Verified" },
  { value: "premium", label: "Premium" },
];
const LEVELS = [
  { value: "district", label: "District" },
  { value: "state", label: "State" },
  { value: "national", label: "National" },
];

const EMPTY = { name: "", lat: "", lng: "", sport: "Cricket", students: "", rating: 1, city: "Hyderabad, TG", area: "", founded: "", coach: "", phone: "", status: "active", badge: "verified", matchesPlayed: "", trophies: "", winRate: "", topRank: "", starPlayers: [], teams: [] };
const EMPTY_PLAYER = { name: "", achievement: "", sport: "Cricket", level: "district" };
const EMPTY_TEAM = { name: "", sport: "Cricket", division: "", wins: "", losses: "" };

export default function AdminPage() {
  const [academies, setAcademies] = useState([]);
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("basic"); // basic | players | teams | metrics

  const load = async () => {
    const res = await fetch("/api/academies");
    setAcademies(await res.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const flash = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.lat || !form.lng) { flash("Name, Lat & Lng required", "error"); return; }
    const payload = {
      ...form,
      students: parseInt(form.students) || 0,
      rating: parseInt(form.rating) || 1,
      matchesPlayed: parseInt(form.matchesPlayed) || 0,
      trophies: parseInt(form.trophies) || 0,
      winRate: parseInt(form.winRate) || 0,
    };
    if (editId) {
      await fetch(`/api/academies/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      flash("Academy updated");
    } else {
      await fetch("/api/academies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      flash("Academy added to the grid");
    }
    setForm({ ...EMPTY }); setEditId(null); setShowForm(false); setActiveTab("basic"); load();
  };

  const startEdit = (a) => {
    setForm({
      ...EMPTY,
      ...a,
      starPlayers: a.starPlayers || [],
      teams: a.teams || [],
    });
    setEditId(a.id);
    setShowForm(true);
    setActiveTab("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove "${name}" from the ecosystem?`)) return;
    await fetch(`/api/academies/${id}`, { method: "DELETE" });
    flash("Academy removed");
    load();
  };

  /* ── Star Players CRUD ── */
  const addPlayer = () => setForm({ ...form, starPlayers: [...(form.starPlayers || []), { ...EMPTY_PLAYER, sport: form.sport }] });
  const updatePlayer = (idx, field, val) => {
    const arr = [...(form.starPlayers || [])];
    arr[idx] = { ...arr[idx], [field]: val };
    setForm({ ...form, starPlayers: arr });
  };
  const removePlayer = (idx) => {
    const arr = [...(form.starPlayers || [])];
    arr.splice(idx, 1);
    setForm({ ...form, starPlayers: arr });
  };

  /* ── Teams CRUD ── */
  const addTeam = () => setForm({ ...form, teams: [...(form.teams || []), { ...EMPTY_TEAM, sport: form.sport }] });
  const updateTeam = (idx, field, val) => {
    const arr = [...(form.teams || [])];
    arr[idx] = { ...arr[idx], [field]: val };
    setForm({ ...form, teams: arr });
  };
  const removeTeam = (idx) => {
    const arr = [...(form.teams || [])];
    arr.splice(idx, 1);
    setForm({ ...form, teams: arr });
  };

  const totalStudents = academies.reduce((s, a) => s + (a.students || 0), 0);
  const activeSports = [...new Set(academies.map((a) => a.sport))].length;
  const totalStarPlayers = academies.reduce((s, a) => s + (a.starPlayers?.length || 0), 0);
  const totalTeams = academies.reduce((s, a) => s + (a.teams?.length || 0), 0);

  return (
    <div className="admin-root">
      {/* Toast */}
      {toast && <div className={`admin-toast ${toast.type}`}>{toast.msg}</div>}

      {/* Header */}
      <header className="admin-header">
        <div className="admin-brand">
          <a href="/" className="admin-logo">GWD <span>SPORTS</span></a>
          <div className="admin-tag">COMMAND CENTER</div>
        </div>
        <div className="admin-header-right">
          <a href="/" className="admin-link">View Portal &rarr;</a>
        </div>
      </header>

      {/* Stats row */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="asc-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF1744" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="9" y1="7" x2="15" y2="7" /><line x1="9" y1="12" x2="15" y2="12" /></svg>
          </div>
          <div>
            <div className="asc-val">{academies.length}</div>
            <div className="asc-lbl">Academies</div>
          </div>
          <div className="asc-glow" />
        </div>
        <div className="admin-stat-card">
          <div className="asc-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF1744" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
          </div>
          <div>
            <div className="asc-val">{totalStudents}</div>
            <div className="asc-lbl">Students</div>
          </div>
          <div className="asc-glow" />
        </div>
        <div className="admin-stat-card">
          <div className="asc-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <div>
            <div className="asc-val">{totalStarPlayers}</div>
            <div className="asc-lbl">Star Players</div>
          </div>
          <div className="asc-glow" />
        </div>
        <div className="admin-stat-card">
          <div className="asc-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
          </div>
          <div>
            <div className="asc-val">{totalTeams}</div>
            <div className="asc-lbl">Teams</div>
          </div>
          <div className="asc-glow" />
        </div>
      </div>

      {/* Actions bar */}
      <div className="admin-actions">
        <h2 className="admin-section-title">
          <span className="ast-dot" />Academy Grid
        </h2>
        <button className="admin-add-btn" onClick={() => { setForm({ ...EMPTY }); setEditId(null); setShowForm(!showForm); setActiveTab("basic"); }}>
          {showForm ? "Cancel" : "+ Add Academy"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="af-title">{editId ? "Edit Academy" : "Add New Academy"}</div>

          {/* Tab navigation */}
          <div className="af-tabs">
            <button type="button" className={`af-tab ${activeTab === "basic" ? "af-tab-active" : ""}`} onClick={() => setActiveTab("basic")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="9" y1="7" x2="15" y2="7" /><line x1="9" y1="12" x2="15" y2="12" /></svg>
              Basic Info
            </button>
            <button type="button" className={`af-tab ${activeTab === "metrics" ? "af-tab-active" : ""}`} onClick={() => setActiveTab("metrics")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
              Metrics
            </button>
            <button type="button" className={`af-tab ${activeTab === "players" ? "af-tab-active" : ""}`} onClick={() => setActiveTab("players")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Star Players ({(form.starPlayers || []).length})
            </button>
            <button type="button" className={`af-tab ${activeTab === "teams" ? "af-tab-active" : ""}`} onClick={() => setActiveTab("teams")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              Teams ({(form.teams || []).length})
            </button>
          </div>

          {/* ── BASIC INFO TAB ── */}
          {activeTab === "basic" && (
            <div className="af-grid">
              <div className="af-group af-span2">
                <label>Academy Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. MasterGrade Sports Academy" required />
              </div>
              <div className="af-group">
                <label>Sport *</label>
                <select value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })}>
                  {SPORTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="af-group">
                <label>Students</label>
                <input type="number" value={form.students} onChange={(e) => setForm({ ...form, students: e.target.value })} placeholder="0" />
              </div>
              <div className="af-group">
                <label>Latitude *</label>
                <input value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="17.4947" required />
              </div>
              <div className="af-group">
                <label>Longitude *</label>
                <input value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} placeholder="78.3940" required />
              </div>
              <div className="af-group">
                <label>Area / Locality</label>
                <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Kukatpally" />
              </div>
              <div className="af-group">
                <label>City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="af-group">
                <label>Head Coach</label>
                <input value={form.coach} onChange={(e) => setForm({ ...form, coach: e.target.value })} placeholder="Coach name" />
              </div>
              <div className="af-group">
                <label>Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 ..." />
              </div>
              <div className="af-group">
                <label>Founded Year</label>
                <input value={form.founded} onChange={(e) => setForm({ ...form, founded: e.target.value })} placeholder="2024" />
              </div>
              <div className="af-group">
                <label>GWD Rating (1-3)</label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}>
                  <option value={1}>★ (1 Star)</option>
                  <option value={2}>★★ (2 Stars)</option>
                  <option value={3}>★★★ (3 Stars)</option>
                </select>
              </div>
              <div className="af-group">
                <label>Badge</label>
                <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>
                  {BADGES.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
              <div className="af-group">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}

          {/* ── METRICS TAB ── */}
          {activeTab === "metrics" && (
            <div className="af-grid">
              <div className="af-group">
                <label>Matches Played</label>
                <input type="number" value={form.matchesPlayed} onChange={(e) => setForm({ ...form, matchesPlayed: e.target.value })} placeholder="0" />
              </div>
              <div className="af-group">
                <label>Trophies Won</label>
                <input type="number" value={form.trophies} onChange={(e) => setForm({ ...form, trophies: e.target.value })} placeholder="0" />
              </div>
              <div className="af-group">
                <label>Win Rate (%)</label>
                <input type="number" min="0" max="100" value={form.winRate} onChange={(e) => setForm({ ...form, winRate: e.target.value })} placeholder="0" />
              </div>
              <div className="af-group">
                <label>Top Achievement / Rank</label>
                <input value={form.topRank || ""} onChange={(e) => setForm({ ...form, topRank: e.target.value })} placeholder="e.g. State U-14 Runners-Up" />
              </div>
            </div>
          )}

          {/* ── STAR PLAYERS TAB ── */}
          {activeTab === "players" && (
            <div className="af-dynamic-section">
              <div className="af-dyn-desc">Add athletes who have achieved State or National level recognition. These players appear as &quot;Star Players&quot; in the academy&apos;s map hover card — giving prestige and competitive visibility.</div>
              {(form.starPlayers || []).map((p, i) => (
                <div key={i} className="af-dyn-row">
                  <div className="af-dyn-num">{i + 1}</div>
                  <div className="af-dyn-fields">
                    <input value={p.name} onChange={(e) => updatePlayer(i, "name", e.target.value)} placeholder="Player name" />
                    <input value={p.achievement} onChange={(e) => updatePlayer(i, "achievement", e.target.value)} placeholder="Achievement (e.g. State U-16 Selection)" />
                    <select value={p.level} onChange={(e) => updatePlayer(i, "level", e.target.value)}>
                      {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                    <select value={p.sport} onChange={(e) => updatePlayer(i, "sport", e.target.value)}>
                      {SPORTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <button type="button" className="af-dyn-remove" onClick={() => removePlayer(i)}>✕</button>
                </div>
              ))}
              <button type="button" className="af-dyn-add" onClick={addPlayer}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Star Player
              </button>
            </div>
          )}

          {/* ── TEAMS TAB ── */}
          {activeTab === "teams" && (
            <div className="af-dynamic-section">
              <div className="af-dyn-desc">Registered teams compete in GWD leagues and local tournaments. Team data shows on the map popup and builds competitive prestige for the academy.</div>
              {(form.teams || []).map((t, i) => (
                <div key={i} className="af-dyn-row">
                  <div className="af-dyn-num">{i + 1}</div>
                  <div className="af-dyn-fields">
                    <input value={t.name} onChange={(e) => updateTeam(i, "name", e.target.value)} placeholder="Team name (e.g. Thunder XI)" />
                    <input value={t.division} onChange={(e) => updateTeam(i, "division", e.target.value)} placeholder="Division (e.g. U-14, U-17)" />
                    <select value={t.sport} onChange={(e) => updateTeam(i, "sport", e.target.value)}>
                      {SPORTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <input type="number" value={t.wins} onChange={(e) => updateTeam(i, "wins", e.target.value)} placeholder="Wins" />
                    <input type="number" value={t.losses} onChange={(e) => updateTeam(i, "losses", e.target.value)} placeholder="Losses" />
                  </div>
                  <button type="button" className="af-dyn-remove" onClick={() => removeTeam(i)}>✕</button>
                </div>
              ))}
              <button type="button" className="af-dyn-add" onClick={addTeam}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Team
              </button>
            </div>
          )}

          <div className="af-actions">
            <button type="submit" className="af-submit">{editId ? "Update Academy" : "Add to Grid"}</button>
            <button type="button" className="af-cancel" onClick={() => { setShowForm(false); setEditId(null); setForm({ ...EMPTY }); }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" />
            Loading ecosystem data...
          </div>
        ) : academies.length === 0 ? (
          <div className="admin-empty">
            <div className="ae-icon">📡</div>
            <div className="ae-title">No academies on the grid yet</div>
            <div className="ae-sub">Add your first academy to light up the map.</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Academy</th>
                <th>Sport</th>
                <th>Area</th>
                <th>Students</th>
                <th>Stars</th>
                <th>Teams</th>
                <th>Rating</th>
                <th>Badge</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {academies.map((a) => (
                <tr key={a.id}>
                  <td><span className={`status-dot ${a.status}`} />{a.status}</td>
                  <td>
                    <div className="at-name">{a.name}</div>
                    <div className="at-meta">{a.coach ? `Coach: ${a.coach}` : ""}{a.topRank ? ` · ${a.topRank}` : ""}</div>
                  </td>
                  <td><span className="sport-pill">{a.sport}</span></td>
                  <td>{a.area || "—"}</td>
                  <td className="at-num">{a.students}</td>
                  <td className="at-num">
                    <span style={{ color: "#ffd700" }}>{a.starPlayers?.length || 0}</span>
                  </td>
                  <td className="at-num">
                    <span style={{ color: "#4caf50" }}>{a.teams?.length || 0}</span>
                  </td>
                  <td className="at-stars">{"★".repeat(a.rating)}{Array.from({length: 3 - a.rating}).map((_, i) => <span key={i} style={{ color: "#222" }}>★</span>)}</td>
                  <td><span className={`badge-pill ${a.badge}`}>{a.badge}</span></td>
                  <td className="at-actions">
                    <button className="at-edit" onClick={() => startEdit(a)}>Edit</button>
                    <button className="at-delete" onClick={() => handleDelete(a.id, a.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Coordinate help */}
      <div className="admin-help">
        <div className="ah-title">📍 How to get coordinates</div>
        <p>Go to <a href="https://www.google.com/maps" target="_blank" rel="noopener">Google Maps</a>, right-click any location, and click the coordinates to copy them. Paste latitude and longitude into the form above. The academy pin will appear on the portal map automatically.</p>
      </div>
    </div>
  );
}
