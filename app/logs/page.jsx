"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/oauth/logs");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  async function clearLogs() {
    if (!confirm("Clear all logs?")) return;
    await fetch("/api/oauth/logs", { method: "DELETE" });
    setLogs([]);
  }

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif", color: "#f1f5f9" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ margin: 0 }}>Activity Logs</h1>
          <p style={{ color: "#94a3b8", margin: "5px 0 0" }}>OAuth Connection History & Error Diagnostic</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={fetchLogs} style={btnStyle}>Refresh</button>
          <button onClick={clearLogs} style={{ ...btnStyle, backgroundColor: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>Clear All</button>
          <Link href="/" style={{ ...btnStyle, textDecoration: "none" }}>Back to Dashboard</Link>
        </div>
      </div>

      <div style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
        {loading && logs.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Loading logs...</div>
        ) : logs.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No activity logs found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: "left" }}>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>Provider</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Details / Error Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={tdStyle}>{new Date(log.created_at).toLocaleString()}</td>
                  <td style={{ ...tdStyle, textTransform: "capitalize", fontWeight: "bold" }}>{log.provider}</td>
                  <td style={tdStyle}>
                    <span style={{ 
                      padding: "2px 8px", 
                      borderRadius: "10px", 
                      fontSize: "0.75rem", 
                      fontWeight: "bold",
                      backgroundColor: log.status === "SUCCESS" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                      color: log.status === "SUCCESS" ? "#6ee7b7" : "#fca5a5"
                    }}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: log.status === "ERROR" ? "#fca5a5" : "#cbd5e1" }}>
                    {log.message || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const btnStyle = {
  backgroundColor: "rgba(99,102,241,0.15)",
  color: "#a5b4fc",
  border: "1px solid rgba(99,102,241,0.3)",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: "600"
};

const thStyle = { padding: "12px 20px", color: "#475569", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" };
const tdStyle = { padding: "12px 20px" };
