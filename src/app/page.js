import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  UserPlus,
  RefreshCcw,
  ShieldCheck,
  Activity,
} from "lucide-react";

const c = {
  bg: "var(--app-bg)",
  surface: "var(--app-surface)",
  surfaceAlt: "color-mix(in srgb, var(--app-surface) 90%, var(--app-bg) 10%)",
  border: "var(--app-border)",
  borderStrong: "color-mix(in srgb, var(--app-border) 80%, var(--app-text) 20%)",
  text: "var(--app-text)",
  textSecondary: "var(--app-text-secondary)",
  textMuted: "var(--app-text-muted)",
  accentFrom: "var(--accent-from)",
  accentTo: "var(--accent-to)",
};

const feed = [
  {
    icon: UserPlus,
    tone: "#a78bfa",
    title: "New employee onboarded",
    detail: "Sarah Johnson added as Employee · Marketing",
    time: "2m ago",
  },
  {
    icon: RefreshCcw,
    tone: "#60a5fa",
    title: "Task status updated",
    detail: "QA Review moved from In Progress to Done",
    time: "11m ago",
  },
  {
    icon: ShieldCheck,
    tone: "#34d399",
    title: "Role permissions changed",
    detail: "Mike Chen promoted to Admin access",
    time: "48m ago",
  },
  {
    icon: Activity,
    tone: "#f59e0b",
    title: "Sprint milestone reached",
    detail: "Q3 rollout · 18 of 22 tasks complete",
    time: "1h ago",
  },
];

const capabilities = [
  {
    title: "Role-based access",
    description:
      "Every employee gets exactly the access their role requires — nothing assumed, nothing over-shared.",
  },
  {
    title: "Live task state",
    description:
      "Status changes propagate instantly across the team, so standups start with answers instead of questions.",
  },
  {
    title: "One system of record",
    description:
      "Employees, tasks, and history live in a single console — no spreadsheets reconciled by hand on Fridays.",
  },
];

export default function Home() {
  return (
    <div style={{ background: c.bg, color: c.text, minHeight: "100vh" }}>
      {/* ============ HERO ============ */}
      <section style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${c.border}` }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-180px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "420px",
            background: `radial-gradient(closest-side, ${c.accentFrom}22, transparent)`,
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "56px",
              padding: "72px 0 88px",
              position: "relative",
              zIndex: 1,
            }}
            className="hero-grid"
          >
            {/* Left: copy */}
            <div style={{ maxWidth: "560px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: "#c4b5fd",
                  border: "1px solid rgba(124,58,237,0.35)",
                  background: "rgba(124,58,237,0.08)",
                  borderRadius: "999px",
                  padding: "6px 14px",
                  marginBottom: "22px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: "#34d399",
                    display: "inline-block",
                  }}
                />
                OPERATING · 247 TEAMS
              </div>

              <h1
                style={{
                  fontSize: "44px",
                  lineHeight: 1.08,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Run your team like an{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  operations desk
                </span>
                , not a spreadsheet.
              </h1>

              <p style={{ fontSize: "16px", lineHeight: 1.7, color: c.textSecondary, marginTop: "22px" }}>
                Employee TMS is the console for assigning work, tracking status, and
                managing access — built for teams that treat task management as
                infrastructure, not a chore.
              </p>

              <div style={{ display: "flex", gap: "14px", marginTop: "32px", flexWrap: "wrap" }}>
                <Link
                  href="/dashboard"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "10px",
                    padding: "13px 22px",
                    textDecoration: "none",
                    boxShadow: "0 10px 28px -10px rgba(124,58,237,0.55)",
                  }}
                >
                  Open Dashboard <ArrowRight size={16} />
                </Link>
                <Link
                  href="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: c.text,
                    border: `1px solid ${c.borderStrong}`,
                    borderRadius: "10px",
                    padding: "13px 22px",
                    textDecoration: "none",
                  }}
                >
                  Sign in to your team
                </Link>
              </div>

              <div style={{ display: "flex", gap: "28px", marginTop: "40px", flexWrap: "wrap" }}>
                <Stat value="12,400+" label="Tasks tracked" />
                <Stat value="99.95%" label="Console uptime" />
                <Stat value="<40ms" label="Status sync" />
              </div>
            </div>

            {/* Right: live console preview */}
            <div
              style={{
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 40px 100px -50px rgba(0,0,0,0.8)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: `1px solid ${c.border}`,
                }}
              >
                <div>
                  <div style={{ fontSize: "10px", letterSpacing: "0.14em", color: c.textMuted }}>
                    ACTIVITY
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 600, marginTop: "2px" }}>
                    Live console feed
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#34d399",
                    background: "rgba(52,211,153,0.12)",
                    border: "1px solid rgba(52,211,153,0.3)",
                    borderRadius: "999px",
                    padding: "4px 10px",
                  }}
                >
                  ● Live
                </span>
              </div>

              <div>
                {feed.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      style={{
                        display: "flex",
                        gap: "14px",
                        alignItems: "flex-start",
                        padding: "16px 20px",
                        borderBottom: i === feed.length - 1 ? "none" : `1px solid ${c.border}`,
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "9px",
                          background: c.surfaceAlt,
                          border: `1px solid ${c.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={15} color={item.tone} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: c.text }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: "12px", color: c.textSecondary, marginTop: "2px" }}>
                          {item.detail}
                        </div>
                      </div>
                      <div style={{ fontSize: "11px", color: c.textMuted, flexShrink: 0, whiteSpace: "nowrap" }}>
                        {item.time}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CAPABILITIES ============ */}
      <section style={{ maxWidth: "1120px", margin: "0 auto", padding: "88px 20px" }}>
        <div style={{ maxWidth: "560px", marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", color: c.textMuted }}>
            WHY TEAMS SWITCH
          </div>
          <h2 style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "-0.01em", marginTop: "12px" }}>
            Built for the work that actually happens.
          </h2>
        </div>

        <div className="capability-grid" style={{ display: "grid", gap: "20px" }}>
          {capabilities.map((cap, i) => (
            <div
              key={cap.title}
              style={{
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: "16px",
                padding: "26px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: c.textMuted,
                  marginBottom: "16px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 style={{ fontSize: "17px", fontWeight: 600, margin: 0 }}>{cap.title}</h3>
              <p style={{ fontSize: "14px", color: c.textSecondary, lineHeight: 1.65, marginTop: "10px" }}>
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section style={{ borderTop: `1px solid ${c.border}`, background: c.surfaceAlt }}>
        <div
          style={{
            maxWidth: "780px",
            margin: "0 auto",
            padding: "80px 20px",
            textAlign: "center",
          }}
        >
          <CheckCircle2 size={28} color="#34d399" style={{ marginBottom: "20px" }} />
          <h2 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.01em", margin: 0 }}>
            Your team's next sprint starts with one login.
          </h2>
          <p style={{ fontSize: "15px", color: c.textSecondary, marginTop: "14px", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
            No setup calls, no onboarding deck. Sign in and your dashboard is already there.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginTop: "30px", flexWrap: "wrap" }}>
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: `linear-gradient(135deg, ${c.accentFrom}, ${c.accentTo})`,
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                borderRadius: "10px",
                padding: "13px 24px",
                textDecoration: "none",
                boxShadow: "0 10px 28px -10px rgba(124,58,237,0.55)",
              }}
            >
              Open Dashboard <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "14px",
                fontWeight: 600,
                color: c.text,
                border: `1px solid ${c.borderStrong}`,
                borderRadius: "10px",
                padding: "13px 24px",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${c.border}`, padding: "24px 20px" }}>
        <p style={{ fontSize: "12px", color: c.textMuted, textAlign: "center", margin: 0 }}>
          Employee TMS · Premium Ops · v1.0
        </p>
      </footer>

      {/* Responsive rules that inline styles can't express */}
      <style>{`
        @media (min-width: 900px) {
          .hero-grid {
            grid-template-columns: 1.05fr 0.95fr !important;
            align-items: center;
          }
          .capability-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 640px) and (max-width: 899px) {
          .capability-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div style={{ fontSize: "20px", fontWeight: 700, color: "#f3f4f6" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#54565f", marginTop: "2px" }}>{label}</div>
    </div>
  );
}