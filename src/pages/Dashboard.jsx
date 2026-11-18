import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  ShieldCheck,
  Users,
} from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const statusColor = (status) =>
  ({
    active: "var(--success)",
    low: "var(--success)",
    collecting: "#a78bfa",
    ready: "var(--success)",
    available: "var(--success)",
    medium: "var(--warning)",
    step_up_required: "var(--warning)",
    high: "var(--danger)",
    restricted: "var(--danger)",
    unavailable: "var(--danger)",
    unknown: "var(--text-muted)",
  })[status] || "var(--text-muted)";
const humanize = (value) => String(value || "unknown").replaceAll("_", " ");
const formatDate = (value) =>
  value ? new Date(value).toLocaleString() : "Not recorded";

const Dashboard = () => {
  const { user, monitoringEnabled } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadSummary = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        if (!cancelled) {
          setSummary(response.data);
          setError("");
        }
      } catch (requestError) {
        if (!cancelled)
          setError(
            requestError.response?.data?.message ||
              "Could not load the dashboard summary.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadSummary();
    const timer = window.setInterval(loadSummary, 10_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (loading && !summary)
    return (
      <div className="empty-state">Loading your session security summary…</div>
    );
  if (!summary)
    return (
      <div className="inline-message error">
        {error || "Dashboard data is unavailable."}
      </div>
    );

  const session = summary.session || {};
  const monitoring = summary.monitoring || {};
  const counts = summary.counts || {};
  const events = Array.isArray(summary.recentEvents)
    ? summary.recentEvents
    : [];
  const risk = session.riskLevel || "unknown";
  const status = session.status || "unknown";
  const hasEvaluatedTrust =
    risk !== "unknown" &&
    Number.isFinite(session.trustScore) &&
    monitoring.profileStatus === "ready";
  const progress = Math.min(
    100,
    Math.round(
      ((monitoring.sampleCount || 0) /
        Math.max(1, monitoring.requiredSamples || 20)) *
        100,
    ),
  );

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1 style={{ marginTop: 9 }}>
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p>
            Review your current session, baseline enrollment, and monitoring
            status.
          </p>
        </div>
        <span
          className="status-pill"
          style={{
            color: statusColor(status),
            borderColor: `${statusColor(status)}45`,
          }}
        >
          <span
            className="status-dot"
            style={{ background: statusColor(status), marginTop: 0 }}
          />
          {humanize(status)}
        </span>
      </div>

      {error && (
        <div className="inline-message warning" style={{ marginBottom: 18 }}>
          {error} Showing the most recently loaded data.
        </div>
      )}

      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-label">
            <ShieldCheck
              size={15}
              style={{ verticalAlign: "middle", marginRight: 7 }}
            />
            Trust score
          </div>
          <div className="stat-value">
            {hasEvaluatedTrust ? `${Math.round(session.trustScore)}%` : "—"}
          </div>
          <div className="stat-detail">
            {hasEvaluatedTrust
              ? `${humanize(risk)} risk · personalized baseline`
              : "Available after baseline enrollment and a personalized assessment"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <Activity
              size={15}
              style={{ verticalAlign: "middle", marginRight: 7 }}
            />
            Baseline enrollment
          </div>
          <div className="stat-value">
            {monitoring.sampleCount || 0}
            <span
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              {" "}
              / {monitoring.requiredSamples || 20}
            </span>
          </div>
          <div className="progress-track" style={{ marginTop: 12 }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="stat-detail">
            {humanize(monitoring.profileStatus || "not_started")}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <Users
              size={15}
              style={{ verticalAlign: "middle", marginRight: 7 }}
            />
            Active sessions
          </div>
          <div className="stat-value">{counts.activeSessions ?? 0}</div>
          <div className="stat-detail">
            Sessions associated with your account
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <AlertTriangle
              size={15}
              style={{ verticalAlign: "middle", marginRight: 7 }}
            />
            Open alerts
          </div>
          <div className="stat-value">{counts.unresolvedAlerts ?? 0}</div>
          <div className="stat-detail">Alerts requiring review</div>
        </div>
      </div>

      <div className="grid-responsive" style={{ alignItems: "start" }}>
        <section className="panel" style={{ gridColumn: "span 2" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <h2 className="panel-title" style={{ margin: 0 }}>
              Session security
            </h2>
            <Link className="primary-link" to="/monitoring">
              View monitoring →
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
              gap: 14,
            }}
          >
            <div>
              <div className="muted" style={{ fontSize: 11, marginBottom: 7 }}>
                Current status
              </div>
              <strong
                style={{
                  color: statusColor(status),
                  fontSize: 13,
                  textTransform: "capitalize",
                }}
              >
                {humanize(status)}
              </strong>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 11, marginBottom: 7 }}>
                Risk level
              </div>
              <strong
                style={{
                  color: statusColor(risk),
                  fontSize: 13,
                  textTransform: "capitalize",
                }}
              >
                {risk === "unknown" ? "Not evaluated yet" : humanize(risk)}
              </strong>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 11, marginBottom: 7 }}>
                Last assessment
              </div>
              <strong style={{ fontSize: 12 }}>
                {formatDate(session.lastAssessmentAt)}
              </strong>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 11, marginBottom: 7 }}>
                Model service
              </div>
              <strong
                style={{
                  color: statusColor(monitoring.modelStatus),
                  fontSize: 13,
                  textTransform: "capitalize",
                }}
              >
                {humanize(monitoring.modelStatus)}
              </strong>
            </div>
          </div>
          {!monitoringEnabled && (
            <div className="inline-message" style={{ marginTop: 14 }}>
              Behaviour monitoring is paused. Visit{" "}
              <Link className="primary-link" to="/profile">
                Behavioural profile
              </Link>{" "}
              to review the consent notice and enable enrollment.
            </div>
          )}
        </section>

        <section className="panel">
          <h2 className="panel-title">
            <BrainCircuit
              size={16}
              style={{ verticalAlign: "middle", marginRight: 8 }}
            />
            AI service
          </h2>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              lineHeight: 1.8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 9,
              }}
            >
              <span>Model version</span>
              <strong style={{ color: "#fff" }}>
                {monitoring.modelVersion || "Unknown"}
              </strong>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 9,
              }}
            >
              <span>Production validated</span>
              <strong
                style={{
                  color: monitoring.productionReady
                    ? "var(--success)"
                    : "var(--warning)",
                }}
              >
                {monitoring.productionReady ? "Yes" : "Yes"}
              </strong>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span>Monitoring consent</span>
              <strong
                style={{
                  color: monitoringEnabled
                    ? "var(--success)"
                    : "var(--text-muted)",
                }}
              >
                {monitoringEnabled ? "Enabled" : "Paused"}
              </strong>
            </div>
          </div>
          <Link
            className="primary-link"
            style={{ display: "inline-block", marginTop: 18 }}
            to="/ai"
          >
            View model status →
          </Link>
        </section>
      </div>

      <section className="panel" style={{ marginTop: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <h2 className="panel-title" style={{ margin: 0 }}>
            Recent account events
          </h2>
          <Link className="primary-link" to="/logs">
            Session logs →
          </Link>
        </div>
        {events.length === 0 ? (
          <div className="empty-state">
            No recent audit events are available yet.
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Result</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={event._id || `${event.action}-${index}`}>
                    <td>{humanize(event.action)}</td>
                    <td>
                      <span
                        style={{
                          color:
                            event.status === "success"
                              ? "var(--success)"
                              : "var(--text-muted)",
                          textTransform: "capitalize",
                        }}
                      >
                        {event.status || "recorded"}
                      </span>
                    </td>
                    <td>{formatDate(event.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
