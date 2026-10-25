import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/dashboard/summary");
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard summary", err);
      }
    };

    fetchSummary();
    // Poll every 5 seconds to simulate real-time updates
    const interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !data) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Loading security data...
      </div>
    );
  }

  const { session, monitoring, counts } = data;

  // Determine colors based on real risk level
  const riskColors = {
    low: "var(--success)",
    medium: "var(--warning)",
    high: "var(--danger)",
    unknown: "var(--text-muted)",
  };

  const currentColor = riskColors[session.riskLevel] || riskColors.low;

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginBottom: "32px",
          "@media (min-width: 768px)": {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              letterSpacing: "-1px",
            }}
          >
            Good Morning 👋
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
            Here's what's happening with your account today.
          </p>
        </div>
        <div
          className="liquid-glass"
          style={{
            padding: "10px 20px",
            borderRadius: "30px",
            color:
              session.status === "active" ? "var(--success)" : "var(--danger)",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "fit-content",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background:
                session.status === "active"
                  ? "var(--success)"
                  : "var(--danger)",
              boxShadow: `0 0 10px ${session.status === "active" ? "var(--success)" : "var(--danger)"}`,
            }}
          />
          {session.status === "active"
            ? "Active Session"
            : "Restricted Session"}
        </div>
      </div>

      <div className="grid-responsive" style={{ marginBottom: "24px" }}>
        {/* Trust Score Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="liquid-glass"
          style={{
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "180px",
              height: "180px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r="80"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="12"
              />
              <motion.circle
                cx="90"
                cy="90"
                r="80"
                fill="none"
                stroke={currentColor}
                strokeWidth="12"
                strokeDasharray="502"
                strokeDashoffset={502 - (502 * session.trustScore) / 100}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 502 }}
                animate={{
                  strokeDashoffset: 502 - (502 * session.trustScore) / 100,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                transform="rotate(-90 90 90)"
              />
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "42px",
                  fontWeight: "800",
                  letterSpacing: "-1px",
                }}
              >
                {Math.round(session.trustScore)}%
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: currentColor,
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {session.riskLevel} Risk
              </p>
            </div>
          </div>
        </motion.div>

        {/* Session Overview */}
        <motion.div
          whileHover={{ y: -5 }}
          className="liquid-glass"
          style={{ padding: "32px" }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "24px",
            }}
          >
            Session Overview
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "15px",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>Status</span>
              <span
                style={{
                  color: currentColor,
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}
              >
                {session.status.replace("_", " ")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "15px",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>
                Active Sessions
              </span>
              <span style={{ fontWeight: "500" }}>{counts.activeSessions}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "15px",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>
                Unresolved Alerts
              </span>
              <span
                style={{
                  fontWeight: "500",
                  color:
                    counts.unresolvedAlerts > 0 ? "var(--danger)" : "white",
                }}
              >
                {counts.unresolvedAlerts}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "15px",
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>ML Model</span>
              <span style={{ fontWeight: "500" }}>
                {monitoring.modelStatus}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Risk Level */}
        <motion.div
          whileHover={{ y: -5 }}
          className="liquid-glass"
          style={{ padding: "32px" }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "24px",
            }}
          >
            Risk Level
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
              background: `${currentColor}15`,
              border: `1px solid ${currentColor}30`,
              padding: "16px",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: currentColor,
                boxShadow: `0 0 10px ${currentColor}`,
              }}
            />
            <span
              style={{
                color: currentColor,
                fontWeight: "600",
                fontSize: "16px",
                textTransform: "capitalize",
              }}
            >
              {session.riskLevel} Risk
            </span>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted)",
              lineHeight: "1.5",
            }}
          >
            {session.riskLevel === "low"
              ? "Your behaviour is consistent with your usual pattern."
              : "Behavioural anomaly detected. Verification may be required."}
          </p>
        </motion.div>
      </div>

      <motion.div
        whileHover={{ y: -5 }}
        className="liquid-glass"
        style={{ padding: "32px" }}
      >
        <h3
          style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}
        >
          Behaviour Comparison
        </h3>
        <div
          style={{
            height: "240px",
            display: "flex",
            alignItems: "flex-end",
            gap: "16px",
            paddingBottom: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85, 75, 100].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.8, type: "spring" }}
              style={{
                flex: 1,
                background:
                  i % 2 === 0
                    ? "linear-gradient(to top, #8b5cf6, #d8b4fe)"
                    : "rgba(255,255,255,0.05)",
                borderRadius: "8px 8px 0 0",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
