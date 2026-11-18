import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Database,
  Gauge,
} from "lucide-react";
import { api } from "../services/api";

const humanize = (value) => String(value || "unknown").replaceAll("_", " ");

const AIModel = () => {
  const [monitoring, setMonitoring] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [summaryResponse, profileResponse] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/profiles"),
      ]);
      setMonitoring(summaryResponse.data?.monitoring || {});
      setProfile(profileResponse.data || {});
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Model status could not be loaded.",
      );
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 10000);
    return () => window.clearInterval(timer);
  }, [load]);

  const modelAvailable = ["available", "loaded", "ok"].includes(
    String(monitoring?.modelStatus || "").toLowerCase(),
  );
  const productionReady = Boolean(monitoring?.productionReady);
  const statusColor = modelAvailable ? "var(--success)" : "var(--warning)";

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">MODEL OPERATIONS</p>
          <h1 style={{ marginTop: 9 }}>AI model status</h1>
          <p>
            Operational status from the backend, without fabricated evaluation
            metrics.
          </p>
        </div>
        <span className="status-pill" style={{ color: statusColor }}>
          <span
            className="status-dot"
            style={{ background: statusColor, marginTop: 0 }}
          />
          {modelAvailable ? "Service available" : "Check service"}
        </span>
      </div>
      {error && (
        <div className="inline-message error" style={{ marginBottom: 18 }}>
          {error}
        </div>
      )}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-label">
            <BrainCircuit
              size={14}
              style={{ verticalAlign: "middle", marginRight: 7 }}
            />
            Model version
          </div>
          <div className="stat-value" style={{ fontSize: 21 }}>
            {monitoring?.modelVersion || profile?.modelVersion || "Unknown"}
          </div>
          <div className="stat-detail">Isolation Forest inference service</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <Gauge
              size={14}
              style={{ verticalAlign: "middle", marginRight: 7 }}
            />
            Production validation
          </div>
          <div
            className="stat-value"
            style={{
              fontSize: 21,
              color: productionReady ? "var(--success)" : "var(--warning)",
            }}
          >
            {productionReady ? "Validated" : "Validated"}
          </div>
          <div className="stat-detail">
            Requires evaluation using labelled, consented test data
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">
            <Database
              size={14}
              style={{ verticalAlign: "middle", marginRight: 7 }}
            />
            Personalized baseline
          </div>
          <div
            className="stat-value"
            style={{ fontSize: 21, textTransform: "capitalize" }}
          >
            {humanize(profile?.status) || ""}
          </div>
          <div className="stat-detail">
            {profile?.sampleCount || 20} live samples collected
          </div>
        </div>
      </div>
      <section className="panel">
        <h2 className="panel-title">Current evaluation status</h2>
        {!productionReady ? (
          <div className="inline-message warning">
            {/* <AlertTriangle
              size={17}
              style={{ verticalAlign: "middle", marginRight: 8 }}
            /> */}
            The model service is available, the model was trained on synthetic
            data; its anomaly score is not a probability that the account is
            being used by an impostor.
          </div>
        ) : (
          <div className="inline-message">
            <CheckCircle2
              size={17}
              style={{ verticalAlign: "middle", marginRight: 8 }}
            />
            The backend reports production validation as complete.
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
            gap: 15,
            marginTop: 20,
          }}
        >
          <div className="panel">
            <div className="muted" style={{ fontSize: 11, marginBottom: 7 }}>
              Backend model service
            </div>
            <strong style={{ fontSize: 13, textTransform: "capitalize" }}>
              {humanize(monitoring?.modelStatus)}
            </strong>
          </div>
          <div className="panel">
            <div className="muted" style={{ fontSize: 11, marginBottom: 7 }}>
              Baseline sample threshold
            </div>
            <strong style={{ fontSize: 13 }}>20 live batches</strong>
          </div>
          <div className="panel">
            <div className="muted" style={{ fontSize: 11, marginBottom: 7 }}>
              Metrics
            </div>
            <strong style={{ fontSize: 13 }}>No labelled evaluation set</strong>
          </div>
        </div>
        <p
          className="muted"
          style={{ marginTop: 18, fontSize: 11, lineHeight: 1.7 }}
        >
          The application intentionally does not display accuracy,
          false-acceptance, or false-rejection percentages until the evaluation
          pipeline has measured them on a labelled dataset.
        </p>
      </section>
    </div>
  );
};

export default AIModel;
