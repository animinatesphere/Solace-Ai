import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SUPABASE_URL = "https://pprbsoonbyksbnausdim.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcmJzb29uYnlrc2JuYXVzZGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NzI2NjIsImV4cCI6MjA4ODU0ODY2Mn0.Pngkadr02RFOZboaW3DSKRj7VxoiE4C36Ey4EDGfjl0";

// Admin credentials — change these!
const ADMIN_EMAIL = "admin@solace.app";
const ADMIN_PASS = "Solace2026!";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STYLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const css = `
.adm-wrap{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;}

/* Login */
.adm-login{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;}
.adm-login-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:40px 36px;max-width:380px;width:100%;text-align:center;box-shadow:0 12px 40px var(--shadow);}
.adm-login-card h1{font-family:'Cormorant Garamond',serif;font-size:26px;margin:0 0 6px;color:var(--text);}
.adm-login-card p{color:var(--text3);font-size:13px;margin:0 0 24px;}
.adm-login-card input{width:100%;padding:12px 14px;border:1px solid var(--border);border-radius:10px;background:var(--bg);color:var(--text);font-size:13px;margin-bottom:12px;outline:none;transition:border 0.2s;box-sizing:border-box;}
.adm-login-card input:focus{border-color:var(--gold);}
.adm-login-card .adm-btn{width:100%;padding:13px;background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:12px;color:#fff;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.2s;}
.adm-login-card .adm-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px var(--glow);}
.adm-err{color:#e74c3c;font-size:12px;margin-bottom:12px;}

/* Dashboard */
.adm-dash{max-width:1200px;margin:0 auto;padding:24px 20px;}
.adm-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;flex-wrap:wrap;gap:12px;}
.adm-header h1{font-family:'Cormorant Garamond',serif;font-size:28px;margin:0;}
.adm-header h1 em{font-style:normal;color:var(--gold);}
.adm-hbtns{display:flex;gap:8px;}
.adm-hbtn{padding:8px 16px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--text2);font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;}
.adm-hbtn:hover{border-color:var(--gold);color:var(--gold);}
.adm-hbtn.gold{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#fff;}

/* Stats Cards */
.adm-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:28px;}
.adm-stat{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;transition:all 0.2s;}
.adm-stat:hover{border-color:var(--border2);transform:translateY(-2px);}
.adm-stat-label{font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;}
.adm-stat-val{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:700;color:var(--text);}
.adm-stat-sub{font-size:11px;color:var(--text3);margin-top:4px;}

/* Tabs */
.adm-tabs{display:flex;gap:4px;margin-bottom:20px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:4px;width:fit-content;}
.adm-tab{padding:8px 18px;border-radius:9px;border:none;background:transparent;color:var(--text3);font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;}
.adm-tab.on{background:var(--glow);color:var(--gold);}
.adm-tab:hover:not(.on){color:var(--text2);}

/* Table */
.adm-table-wrap{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;}
.adm-table{width:100%;border-collapse:collapse;font-size:13px;}
.adm-table th{text-align:left;padding:14px 16px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid var(--border);background:var(--bg);}
.adm-table td{padding:12px 16px;border-bottom:1px solid var(--border);color:var(--text2);max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.adm-table tr:last-child td{border-bottom:none;}
.adm-table tr:hover td{background:var(--glow);}

.adm-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;}
.adm-badge.user{background:rgba(52,152,219,0.15);color:#3498db;}
.adm-badge.assistant{background:rgba(46,204,113,0.15);color:#2ecc71;}
.adm-badge.free{background:rgba(241,196,15,0.15);color:#f1c40f;}
.adm-badge.premium{background:rgba(155,89,182,0.15);color:#9b59b6;}
.adm-badge.pending{background:rgba(241,92,128,0.12);color:#e74c3c;}

/* Chat expand */
.adm-chat-expand{max-width:none;white-space:normal;cursor:pointer;}
.adm-chat-full{background:var(--bg);border:1px solid var(--border);border-radius:12px;padding:16px;margin:8px 0;max-height:300px;overflow-y:auto;font-size:12px;line-height:1.6;}

/* Users list */
.adm-user-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;display:flex;align-items:center;gap:14px;transition:all 0.2s;cursor:pointer;}
.adm-user-card:hover{border-color:var(--border2);transform:translateY(-1px);}
.adm-user-av{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;flex-shrink:0;}
.adm-user-info{flex:1;min-width:0;}
.adm-user-name{font-weight:600;font-size:14px;color:var(--text);}
.adm-user-meta{font-size:11px;color:var(--text3);margin-top:2px;}
.adm-users-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;}

/* Empty state */
.adm-empty{text-align:center;padding:60px 20px;color:var(--text3);}
.adm-empty p{font-size:14px;}

/* Refresh */
.adm-refresh{display:inline-flex;align-items:center;gap:6px;}
.spin{animation:spin 1s linear infinite;}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

@media(max-width:600px){
  .adm-stats{grid-template-columns:1fr 1fr;}
  .adm-table{font-size:11px;}
  .adm-table th,.adm-table td{padding:10px 12px;}
  .adm-dash{padding:16px 12px;}
}
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUPABASE HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function sbGet(table, filter = "", limit = 500) {
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?${filter}&order=created_at.desc&limit=${limit}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    return await r.json();
  } catch {
    return [];
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("overview");
  const [conversations, setConversations] = useState([]);
  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [expandedChat, setExpandedChat] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    if (localStorage.getItem("solace_admin") === "true") {
      setAuthed(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      localStorage.setItem("solace_admin", "true");
      setAuthed(true);
      setErr("");
    } else {
      setErr("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("solace_admin");
    setAuthed(false);
    setEmail("");
    setPass("");
  };

  const loadData = useCallback(async () => {
    setLoadingData(true);
    const [convos, moodLogs, journalLogs, transferLogs] = await Promise.all([
      sbGet("conversations", "", 1000),
      sbGet("mood_logs", "", 500),
      sbGet("journal_entries", "", 500),
      sbGet("transfer_requests", "", 500),
    ]);
    setConversations(Array.isArray(convos) ? convos : []);
    setMoods(Array.isArray(moodLogs) ? moodLogs : []);
    setJournals(Array.isArray(journalLogs) ? journalLogs : []);
    setTransfers(Array.isArray(transferLogs) ? transferLogs : []);
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  // ── Computed stats ──
  const uniqueUsers = [...new Set(conversations.map((c) => c.user_id))];
  const userMessages = conversations.filter((c) => c.role === "user");
  const aiMessages = conversations.filter((c) => c.role === "assistant");
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMessages = conversations.filter(
    (c) => c.created_at?.slice(0, 10) === todayStr,
  );
  const todayUsers = [...new Set(todayMessages.map((c) => c.user_id))];

  // Group conversations by user
  const userConvos = {};
  conversations.forEach((c) => {
    if (!userConvos[c.user_id]) userConvos[c.user_id] = [];
    userConvos[c.user_id].push(c);
  });

  // User mood counts
  const moodCounts = {};
  moods.forEach((m) => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });

  // Messages per day (last 7 days)
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const count = conversations.filter(
      (c) => c.created_at?.slice(0, 10) === ds,
    ).length;
    last7.push({ date: ds.slice(5), count });
  }
  const maxMsg = Math.max(...last7.map((d) => d.count), 1);

  const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <div className="adm-wrap">
        <style>{css}</style>
        <div className="adm-login">
          <form className="adm-login-card" onSubmit={handleLogin}>
            <h1>Admin Panel</h1>
            <p>Solace Dashboard — Authorized access only</p>
            {err && <div className="adm-err">{err}</div>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <button type="submit" className="adm-btn">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  return (
    <div className="adm-wrap">
      <style>{css}</style>
      <div className="adm-dash">
        {/* Header */}
        <div className="adm-header">
          <h1>
            Solace <em>Admin</em>
          </h1>
          <div className="adm-hbtns">
            <button
              className="adm-hbtn"
              onClick={loadData}
              disabled={loadingData}
            >
              <span className={loadingData ? "spin" : ""}>
                {loadingData ? "Loading..." : "Refresh"}
              </span>
            </button>
            <button className="adm-hbtn gold" onClick={() => navigate("/app")}>
              Test AI Chat
            </button>
            <button className="adm-hbtn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="adm-stats">
          <div className="adm-stat">
            <div className="adm-stat-label">Total Users</div>
            <div className="adm-stat-val">{uniqueUsers.length}</div>
            <div className="adm-stat-sub">{todayUsers.length} active today</div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Total Messages</div>
            <div className="adm-stat-val">{conversations.length}</div>
            <div className="adm-stat-sub">
              {userMessages.length} user · {aiMessages.length} AI
            </div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Mood Logs</div>
            <div className="adm-stat-val">{moods.length}</div>
            <div className="adm-stat-sub">
              {Object.entries(moodCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([m, c]) => `${m}: ${c}`)
                .join(" · ") || "No data"}
            </div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Journal Entries</div>
            <div className="adm-stat-val">{journals.length}</div>
            <div className="adm-stat-sub">
              {todayMessages.length} messages today
            </div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-label">Transfer Requests</div>
            <div className="adm-stat-val">{transfers.length}</div>
            <div className="adm-stat-sub">
              {transfers.filter((t) => t.status === "pending").length} pending
            </div>
          </div>
        </div>

        {/* Mini Chart - Messages last 7 days */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text3)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            Messages — Last 7 Days
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: 80,
            }}
          >
            {last7.map((d) => (
              <div
                key={d.date}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontSize: 10, color: "var(--text3)" }}>
                  {d.count}
                </span>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 40,
                    height: `${Math.max((d.count / maxMsg) * 60, 4)}px`,
                    background:
                      "linear-gradient(135deg, var(--gold), var(--gold2))",
                    borderRadius: 6,
                    transition: "height 0.3s",
                  }}
                />
                <span style={{ fontSize: 9, color: "var(--text3)" }}>
                  {d.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="adm-tabs">
          {["overview", "users", "chats", "moods", "journals", "transfers"].map(
            (t) => (
              <button
                key={t}
                className={`adm-tab ${tab === t ? "on" : ""}`}
                onClick={() => {
                  setTab(t);
                  setSelectedUser(null);
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ),
          )}
        </div>

        {/* ── TAB: Overview (recent chats) ── */}
        {tab === "overview" && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Persona</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {conversations.slice(0, 50).map((c, i) => (
                  <tr key={i}>
                    <td>{fmtDate(c.created_at)}</td>
                    <td>{c.user_id?.slice(0, 12)}...</td>
                    <td>
                      <span className={`adm-badge ${c.role}`}>{c.role}</span>
                    </td>
                    <td>{c.persona || "—"}</td>
                    <td
                      className={expandedChat === i ? "adm-chat-expand" : ""}
                      onClick={() =>
                        setExpandedChat(expandedChat === i ? null : i)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {expandedChat === i
                        ? c.content
                        : c.content?.slice(0, 80) +
                          (c.content?.length > 80 ? "..." : "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {conversations.length === 0 && (
              <div className="adm-empty">
                <p>No conversations yet</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Users ── */}
        {tab === "users" && !selectedUser && (
          <div className="adm-users-grid">
            {uniqueUsers.map((uid) => {
              const msgs = userConvos[uid] || [];
              const lastMsg = msgs[0];
              return (
                <div
                  key={uid}
                  className="adm-user-card"
                  onClick={() => setSelectedUser(uid)}
                >
                  <div className="adm-user-av">
                    {uid.replace("u_", "").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="adm-user-info">
                    <div className="adm-user-name">{uid}</div>
                    <div className="adm-user-meta">
                      {msgs.length} messages · Last:{" "}
                      {fmtDate(lastMsg?.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
            {uniqueUsers.length === 0 && (
              <div className="adm-empty">
                <p>No users yet</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Users → Selected user chats ── */}
        {tab === "users" && selectedUser && (
          <>
            <button
              className="adm-hbtn"
              onClick={() => setSelectedUser(null)}
              style={{ marginBottom: 16 }}
            >
              &larr; Back to all users
            </button>
            <div style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>
              Chats for: {selectedUser}
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Role</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {(userConvos[selectedUser] || [])
                    .sort(
                      (a, b) => new Date(a.created_at) - new Date(b.created_at),
                    )
                    .map((c, i) => (
                      <tr key={i}>
                        <td>{fmtDate(c.created_at)}</td>
                        <td>
                          <span className={`adm-badge ${c.role}`}>
                            {c.role}
                          </span>
                        </td>
                        <td
                          className={
                            expandedChat === `u${i}` ? "adm-chat-expand" : ""
                          }
                          onClick={() =>
                            setExpandedChat(
                              expandedChat === `u${i}` ? null : `u${i}`,
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {expandedChat === `u${i}`
                            ? c.content
                            : c.content?.slice(0, 100) +
                              (c.content?.length > 100 ? "..." : "")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── TAB: Chats (all) ── */}
        {tab === "chats" && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Persona</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((c, i) => (
                  <tr key={i}>
                    <td>{fmtDate(c.created_at)}</td>
                    <td>{c.user_id?.slice(0, 12)}...</td>
                    <td>
                      <span className={`adm-badge ${c.role}`}>{c.role}</span>
                    </td>
                    <td>{c.persona || "—"}</td>
                    <td
                      className={
                        expandedChat === `a${i}` ? "adm-chat-expand" : ""
                      }
                      onClick={() =>
                        setExpandedChat(
                          expandedChat === `a${i}` ? null : `a${i}`,
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {expandedChat === `a${i}`
                        ? c.content
                        : c.content?.slice(0, 80) +
                          (c.content?.length > 80 ? "..." : "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {conversations.length === 0 && (
              <div className="adm-empty">
                <p>No chats yet</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Moods ── */}
        {tab === "moods" && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Mood</th>
                </tr>
              </thead>
              <tbody>
                {moods.map((m, i) => (
                  <tr key={i}>
                    <td>{fmtDate(m.created_at)}</td>
                    <td>{m.user_id?.slice(0, 12)}...</td>
                    <td>{m.mood}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {moods.length === 0 && (
              <div className="adm-empty">
                <p>No mood logs yet</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Journals ── */}
        {tab === "journals" && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Mood</th>
                  <th>Content</th>
                </tr>
              </thead>
              <tbody>
                {journals.map((j, i) => (
                  <tr key={i}>
                    <td>{fmtDate(j.created_at)}</td>
                    <td>{j.user_id?.slice(0, 12)}...</td>
                    <td>{j.mood || "—"}</td>
                    <td
                      className={
                        expandedChat === `j${i}` ? "adm-chat-expand" : ""
                      }
                      onClick={() =>
                        setExpandedChat(
                          expandedChat === `j${i}` ? null : `j${i}`,
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {expandedChat === `j${i}`
                        ? j.content
                        : j.content?.slice(0, 100) +
                          (j.content?.length > 100 ? "..." : "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {journals.length === 0 && (
              <div className="adm-empty">
                <p>No journal entries yet</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Transfers ── */}
        {tab === "transfers" && (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Currency</th>
                  <th>Account</th>
                  <th>Status</th>
                  <th>Plan</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t, i) => (
                  <tr key={i}>
                    <td>{fmtDate(t.created_at)}</td>
                    <td>{t.user_name || t.user_id || "—"}</td>
                    <td>{t.currency || "—"}</td>
                    <td>{t.payment_account_number || "—"}</td>
                    <td>
                      <span className={`adm-badge ${t.status || "pending"}`}>
                        {t.status || "pending"}
                      </span>
                    </td>
                    <td>{t.plan_requested || "premium"}</td>
                    <td
                      className={
                        expandedChat === `t${i}` ? "adm-chat-expand" : ""
                      }
                      onClick={() =>
                        setExpandedChat(
                          expandedChat === `t${i}` ? null : `t${i}`,
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {expandedChat === `t${i}`
                        ? t.note
                        : t.note?.slice(0, 80) +
                          (t.note?.length > 80 ? "..." : "")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transfers.length === 0 && (
              <div className="adm-empty">
                <p>No transfer requests yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
