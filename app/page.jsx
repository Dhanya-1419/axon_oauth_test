"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";

/* ─── Brand colors (subtle bg tint per provider) ───────────────── */
const BRAND = {
  github:     { slug: "github",     bg: "rgba(255,255,255,0.08)" },
  slack:      { slug: "slack",      bg: "rgba(74,21,75,0.25)" },
  jira:       { slug: "jira",       bg: "rgba(0,82,204,0.18)" },
  confluence: { slug: "confluence", bg: "rgba(0,82,204,0.18)" },
  notion:     { slug: "notion",     bg: "rgba(255,255,255,0.07)" },
  clickup:    { slug: "clickup",    bg: "rgba(123,104,238,0.18)" },
  asana:      { slug: "asana",      bg: "rgba(240,106,106,0.15)" },
  figma:      { slug: "figma",      bg: "rgba(242,78,30,0.15)" },
  google:     { slug: "google",     bg: "rgba(66,133,244,0.15)" },
  microsoft:  { slug: "microsoft",  bg: "rgba(0,164,239,0.15)" },
  calendly:   { slug: "calendly",   bg: "rgba(0,107,255,0.15)" },
  dropbox:    { slug: "dropbox",    bg: "rgba(0,97,255,0.15)" },
  box:        { slug: "box",        bg: "rgba(0,97,213,0.15)" },
  zoom:       { slug: "zoom",       bg: "rgba(45,140,255,0.15)" },
  docusign:   { slug: "docusign",   bg: "rgba(255,182,0,0.12)" },
  hubspot:    { slug: "hubspot",    bg: "rgba(255,122,89,0.15)" },
  mailchimp:  { slug: "mailchimp",  bg: "rgba(255,224,27,0.10)" },
  eventbrite: { slug: "eventbrite", bg: "rgba(240,85,55,0.15)" },
  stripe:     { slug: "stripe",     bg: "rgba(99,91,255,0.15)" },
  quickbooks: { slug: "quickbooks", bg: "rgba(44,160,28,0.15)" },
  salesforce: { slug: "salesforce", bg: "rgba(0,161,224,0.15)" },
  airtable:   { slug: "airtable",   bg: "rgba(24,191,255,0.12)" },
  jotform:    { slug: "jotform",    bg: "rgba(255,97,0,0.15)" },
  digisign:   { slug: "docusign",   bg: "rgba(255,182,0,0.12)" },
  snowflake:  { slug: "snowflake",  bg: "rgba(41,181,232,0.15)" },
};  

/* ─── Provider Definitions ─────────────────────────────────────── */
const ALL_PROVIDERS = [
  // ── Collaboration ──
  { id: "github",     name: "GitHub",         category: "Collaboration", authTypes: ["oauth", "token"], hint: "GitHub API v3 — OAuth 2.0 recommended for user-facing apps.", fields: { token: [{ key: "token", label: "Personal Access Token", placeholder: "ghp_..." }] } },
  { id: "slack",      name: "Slack",          category: "Collaboration", authTypes: ["oauth", "token"], hint: "Connect your Slack workspace via OAuth or Bot Token.", fields: { token: [{ key: "token", label: "Bot/User Token", placeholder: "xoxb-..." }] } },
  { id: "jira",       name: "Jira",           category: "Collaboration", authTypes: ["oauth", "basic"], hint: "Atlassian Cloud OAuth 2.0 (3LO) or Basic Auth with API Token.", fields: { basic: [{ key: "siteUrl", label: "Site URL", placeholder: "https://your-domain.atlassian.net" }, { key: "email", label: "Email", placeholder: "you@company.com" }, { key: "apiToken", label: "API Token", placeholder: "Atlassian API token" }] } },
  { id: "confluence", name: "Confluence",     category: "Collaboration", authTypes: ["oauth", "basic"], hint: "Atlassian Cloud OAuth 2.0 or Basic Auth.", fields: { basic: [{ key: "siteUrl", label: "Site URL", placeholder: "https://your-domain.atlassian.net" }, { key: "email", label: "Email", placeholder: "you@company.com" }, { key: "apiToken", label: "API Token", placeholder: "Token" }] } },
  { id: "notion",     name: "Notion",         category: "Collaboration", authTypes: ["oauth", "token"], hint: "Notion API v1 — OAuth for public apps.", fields: { token: [{ key: "token", label: "Integration Secret", placeholder: "secret_..." }] } },
  { id: "clickup",    name: "ClickUp",        category: "Collaboration", authTypes: ["oauth", "token"], hint: "ClickUp API v2.", fields: { token: [{ key: "token", label: "API Key", placeholder: "pk_..." }] } },
  { id: "asana",      name: "Asana",          category: "Collaboration", authTypes: ["oauth", "token"], hint: "Asana API v1.", fields: { token: [{ key: "token", label: "Personal Access Token", placeholder: "1/..." }] } },
  { id: "figma",      name: "Figma",          category: "Collaboration", authTypes: ["oauth", "token"], hint: "Figma API v1.", fields: { token: [{ key: "token", label: "Personal Access Token", placeholder: "figd_" }] } },

  // ── Productivity ──
  { id: "google",     name: "Google",         category: "Productivity",  authTypes: ["oauth"], hint: "Google OAuth 2.0 — Calendar, Drive, Gmail, Contacts, Docs." },
  { id: "microsoft",  name: "Microsoft",      category: "Productivity",  authTypes: ["oauth"], hint: "Microsoft Graph API — Outlook, Teams, OneDrive, SharePoint." },
  { id: "calendly",   name: "Calendly",       category: "Productivity",  authTypes: ["oauth", "token"], hint: "Calendly API v2.", fields: { token: [{ key: "token", label: "Access Token", placeholder: "eyJ..." }] } },
  { id: "dropbox",    name: "Dropbox",        category: "Productivity",  authTypes: ["oauth", "token"], hint: "Dropbox API v2.", fields: { token: [{ key: "token", label: "Access Token", placeholder: "sl." }] } },
  { id: "box",        name: "Box",            category: "Productivity",  authTypes: ["oauth", "token"], hint: "Box API v2.", fields: { token: [{ key: "token", label: "Access Token", placeholder: "..." }] } },
  { id: "zoom",       name: "Zoom",           category: "Productivity",  authTypes: ["oauth"], hint: "Zoom API — Meetings, Webinars, Recordings." },
  { id: "docusign",   name: "DocuSign",       category: "Productivity",  authTypes: ["oauth"], hint: "DocuSign eSignature API via OAuth 2.0." },

  // ── Marketing ──
  { id: "hubspot",    name: "HubSpot",        category: "Marketing",     authTypes: ["oauth", "token"], hint: "HubSpot CRM API v3.", fields: { token: [{ key: "token", label: "Access Token", placeholder: "pat.na1..." }] } },
  { id: "mailchimp",  name: "Mailchimp",      category: "Marketing",     authTypes: ["oauth", "basic"], hint: "Mailchimp Marketing API.", fields: { basic: [{ key: "apiKey", label: "API Key", placeholder: "..." }, { key: "serverPrefix", label: "Server Prefix", placeholder: "usX" }] } },
  { id: "eventbrite", name: "Eventbrite",     category: "Marketing",     authTypes: ["oauth", "token"], hint: "Eventbrite API v3.", fields: { token: [{ key: "token", label: "Private Token", placeholder: "..." }] } },

  // ── Finance ──
  { id: "stripe",     name: "Stripe",         category: "Finance",       authTypes: ["basic"], hint: "Stripe API v1. OAuth available for Connect apps.", fields: { basic: [{ key: "secretKey", label: "Secret Key", placeholder: "sk_live_..." }] } },
  { id: "quickbooks", name: "QuickBooks",     category: "Finance",       authTypes: ["oauth"], hint: "Intuit QuickBooks Online API via OAuth 2.0." },

  // ── CRM & Data ──
  { id: "salesforce", name: "Salesforce",     category: "CRM & Data",    authTypes: ["oauth"], hint: "Salesforce REST API via OAuth 2.0." },
  { id: "airtable",   name: "Airtable",       category: "CRM & Data",    authTypes: ["oauth", "token"], hint: "Airtable API — PAT recommended.", fields: { token: [{ key: "token", label: "Personal Access Token", placeholder: "pat..." }] } },
  { id: "jotform",    name: "Jotform",        category: "CRM & Data",    authTypes: ["token"], hint: "Jotform API via API Key.", fields: { token: [{ key: "apiKey", label: "API Key", placeholder: "..." }] } },
  { id: "digisign",   name: "DigiSigner",     category: "CRM & Data",    authTypes: ["token"], hint: "DigiSigner e-Signature API.", fields: { token: [{ key: "apiKey", label: "API Key", placeholder: "..." }, { key: "baseUrl", label: "Base URL", placeholder: "https://api.digisigner.com/v1" }] } },
  { id: "snowflake",  name: "Snowflake",      category: "CRM & Data",    authTypes: ["custom"], hint: "Snowflake SQL access.", fields: { custom: [{ key: "account", label: "Account", placeholder: "xy12345.eu-central-1" }, { key: "user", label: "User", placeholder: "..." }, { key: "password", label: "Password", placeholder: "..." }, { key: "warehouse", label: "Warehouse", placeholder: "..." }, { key: "role", label: "Role", placeholder: "..." }] } },
];

const CATEGORIES = ["All", "Collaboration", "Productivity", "Marketing", "Finance", "CRM & Data"];

const NAV_ITEMS = [
  { id: "dashboard", label: "Integrations", icon: "dashboard" },
  { id: "connected", label: "Connected",    icon: "connected" },
  { id: "tokens",    label: "Token Vault",  icon: "tokens" },
  { id: "logs",      label: "Activity Logs",icon: "activity", path: "/logs" },
];

/* ─── UIIcon component ────────────────────────────────────────── */
function UIIcon({ name, size = 18 }) {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    connected: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
    tokens:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21L15 15M17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11Z"></path><path d="M7 11H15M11 7V15" strokeOpacity="0.3"></path></svg>,
    search:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    shield:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    save:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>,
    test:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.3 6.1c.3.3.3.9 0 1.2L10 13.6c-.3.3-.9.3-1.2 0l-1.4-1.4c-.3-.3-.3-.9 0-1.2l6.3-6.3c.3-.3.9-.3 1.2 0z"></path><path d="M10 21v-2"></path><path d="M5 21v-2"></path><path d="M15 21v-2"></path><path d="M19 21v-2"></path><path d="M2 13h2"></path><path d="M20 13h2"></path></svg>,
    eye:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    eyeOff:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>,
    edit:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    activity:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
  };
  return icons[name] || null;
}

/* ─── BrandIcon component ───────────────────────────────────────── */
function BrandIcon({ id, size = 22, style = {} }) {
  const b = BRAND[id];
  if (!b) {
    // fallback: first letter
    return (
      <div style={{
        width: size, height: size,
        borderRadius: 6,
        background: "rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.55, fontWeight: 700, color: "#fff",
        ...style
      }}>
        {id[0].toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={`https://cdn.simpleicons.org/${b.slug}`}
      alt={id}
      width={size}
      height={size}
      style={{ objectFit: "contain", display: "block", ...style }}
      onError={e => { e.currentTarget.style.display = "none"; }}
    />
  );
}

/* ─── Helper ────────────────────────────────────────────────────── */
function safeJson(str) { try { return JSON.parse(str); } catch { return {}; } }
function fmtDate(ts) {
  if (!ts) return "—";
  const d = new Date(typeof ts === "number" ? ts : ts);
  return isNaN(d) ? "—" : d.toLocaleString();
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [view,          setView]          = useState("dashboard");
  const [selectedId,    setSelectedId]    = useState(null);
  const [oauthTokens,   setOauthTokens]   = useState([]);
  const [tokenDetails,  setTokenDetails]  = useState([]);
  const [searchQ,       setSearchQ]       = useState("");
  const [catFilter,     setCatFilter]     = useState("All");
  const [connFilter,    setConnFilter]    = useState("all"); // all | connected | notConnected
  const [activeAuthTab, setActiveAuthTab] = useState("oauth");
  const [customConfig,  setCustomConfig]  = useState({ clientId: "", clientSecret: "", redirectUri: "" });
  const [secretSaved,   setSecretSaved]   = useState(false);
  const [cfgSaving,     setCfgSaving]     = useState(false);
  const [cfgSavedOk,    setCfgSavedOk]    = useState(false);
  const [storedConfigs, setStoredConfigs] = useState([]); // List of providers with stored client creds
  const [showSecret,    setShowSecret]    = useState(false);
  const [testValues,    setTestValues]    = useState({});
  const [rawBody,       setRawBody]       = useState("{}");
  const [useEnv,        setUseEnv]        = useState(true);
  const [busy,          setBusy]          = useState(false);
  const [result,        setResult]        = useState(null);
  const [notification,  setNotification]  = useState(null); // { type, msg }
  const [disconnecting, setDisconnecting] = useState(null);
  const [logs,          setLogs]          = useState([]);
  const [loadingLogs,   setLoadingLogs]   = useState(false);

  const selected = useMemo(() => ALL_PROVIDERS.find(p => p.id === selectedId), [selectedId]);

  /* ── Load connected tokens ───────────────────────────────────── */
  const fetchLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch("/api/oauth/logs");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch {}
    setLoadingLogs(false);
  }, []);

  const reloadTokens = useCallback(async () => {
    try {
      const r = await fetch("/api/oauth/tokens");
      const d = await r.json();
      setOauthTokens(d.providers || []);
      setTokenDetails(d.details || d.providers?.map(p => ({ provider: p })) || []);

      const cfgRes = await fetch("/api/oauth/configs");
      const cfgData = await cfgRes.json();
      setStoredConfigs(cfgData.configs?.map(c => c.provider) || []);
      
      fetchLogs();
    } catch (e) {
      console.error("Token load failed:", e);
    }
  }, [fetchLogs]);

  useEffect(() => { reloadTokens(); }, [reloadTokens]);

  /* ── Handle OAuth redirect params ────────────────────────────── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ok  = params.get("oauth_success");
    const err = params.get("oauth_error");
    if (ok || err) {
      window.history.replaceState({}, "", "/");
      reloadTokens();
      if (ok) notify("success", `✅ ${ok.charAt(0).toUpperCase() + ok.slice(1)} connected successfully!`);
      if (err) notify("error",   `❌ OAuth error: ${err}`);
    }
  }, [reloadTokens]);

  /* ── Notification helper ─────────────────────────────────────── */
  function notify(type, msg) {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4500);
  }

  /* ── Derived stats ───────────────────────────────────────────── */
  const totalProviders  = ALL_PROVIDERS.length;
  const connectedCount  = oauthTokens.length;
  const oauthOnlyCount  = ALL_PROVIDERS.filter(p => p.authTypes.includes("oauth")).length;

  /* ── Filtered providers for dashboard ───────────────────────── */
  const filtered = useMemo(() => {
    let list = ALL_PROVIDERS;
    if (catFilter !== "All") list = list.filter(p => p.category === catFilter);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (connFilter === "connected")    list = list.filter(p => oauthTokens.includes(p.id));
    if (connFilter === "notConnected") list = list.filter(p => !oauthTokens.includes(p.id));
    return list;
  }, [catFilter, searchQ, connFilter, oauthTokens]);

  /* ── Nav items with badges ───────────────────────────────────── */
  const navWithBadges = NAV_ITEMS.map(n => ({
    ...n,
    badge: n.id === "connected" ? connectedCount : n.id === "tokens" ? connectedCount : null,
  }));

  /* ── Open provider tester ─────────────────────────────────────── */
  async function openTester(appId) {
    const app = ALL_PROVIDERS.find(a => a.id === appId);
    setSelectedId(appId);
    setActiveAuthTab(app.authTypes[0]);
    setTestValues({});
    setResult(null);
    setCfgSavedOk(false);
    setSecretSaved(false);
    setView("tester");

    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const defaultRedirect = `${base}/api/oauth/callback/${appId}`;

    if (app.authTypes.includes("oauth")) {
      try {
        const res  = await fetch(`/api/oauth/configs?provider=${appId}&reveal=true`);
        const data = await res.json();
        if (data.config) {
          setCustomConfig({
            clientId:     data.config.clientId     || "",
            clientSecret: data.config.clientSecret || "",
            redirectUri:  defaultRedirect,
          });
          setSecretSaved(Boolean(data.config.clientSecretSaved));
          setShowSecret(false);
          return;
        }
      } catch {}
    }
    setCustomConfig({ clientId: "", clientSecret: "", redirectUri: defaultRedirect });
  }

  /* ── Save config to DB ───────────────────────────────────────── */
  async function saveConfig() {
    setCfgSaving(true);
    try {
      await fetch("/api/oauth/configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider:     selected.id,
          clientId:     customConfig.clientId     || undefined,
          clientSecret: customConfig.clientSecret || undefined,
          scopes:       customConfig.scopes       || undefined,
        }),
      });
      setCfgSavedOk(true);
      if (customConfig.clientSecret) setSecretSaved(true);
      setCustomConfig(prev => ({ ...prev, clientSecret: "" }));
      await reloadTokens();
      setTimeout(() => setCfgSavedOk(false), 3000);
      notify("success", "Config saved to Neon DB ✓");
    } catch (e) {
      notify("error", "Failed to save config: " + e.message);
    } finally {
      setCfgSaving(false);
    }
  }

  /* ── Delete config from DB ───────────────────────────────────── */
  async function deleteConfig() {
    if (!confirm(`Are you sure you want to delete stored credentials for ${selected.name}? This will NOT disconnect active tokens.`)) return;
    try {
      await fetch("/api/oauth/configs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: selected.id }),
      });
      setCustomConfig(prev => ({ ...prev, clientId: "", clientSecret: "" }));
      setSecretSaved(false);
      await reloadTokens();
      notify("success", "Configuration deleted from DB");
    } catch (e) {
      notify("error", "Failed to delete config: " + e.message);
    }
  }

  /* ── Clear Logs ────────────────────────────────────────────── */
  async function clearAllLogs() {
    if (!confirm("Are you sure you want to clear all activity logs?")) return;
    try {
      await fetch("/api/oauth/logs", { method: "DELETE" });
      setLogs([]);
      notify("success", "Activity logs cleared");
    } catch (e) {
      notify("error", "Failed to clear logs");
    }
  }

  /* ── Start OAuth Flow ────────────────────────────────────────── */
  function startOAuth() {
    window.location.href = `/api/oauth/start/${selected.id}`;
  }

  /* ── Disconnect token ────────────────────────────────────────── */
  async function disconnect(provider) {
    setDisconnecting(provider);
    try {
      await fetch("/api/oauth/tokens", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      await reloadTokens();
      notify("success", `Disconnected ${provider}`);
      if (selectedId === provider) setResult(null);
    } catch (e) {
      notify("error", "Disconnect failed: " + e.message);
    } finally {
      setDisconnecting(null);
    }
  }

  /* ── Test connection ─────────────────────────────────────────── */
  async function testConnection() {
    setBusy(true);
    setResult(null);
    try {
      let backendId = selectedId;
      if (selectedId === "microsoft") backendId = "microsoft_graph";
      if (selectedId === "jira" && activeAuthTab === "basic") backendId = "atlassian_jira";
      if (selectedId === "confluence" && activeAuthTab === "basic") backendId = "atlassian_confluence";

      const res  = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: backendId, values: testValues, extraBody: safeJson(rawBody), useEnv }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ ok: false, error: e.message });
    } finally {
      setBusy(false);
    }
  }

  const isConnected = useMemo(() => selected && oauthTokens.includes(selected.id), [selected, oauthTokens]);

  /* ─────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────── */
  return (
    <div className="shell">
      {/* ── Notification Toast ───────────────────────────────────── */}
      {notification && (
        <div style={{
          position: "fixed", top: 16, right: 16, zIndex: 9999,
          background: notification.type === "error" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
          border: `1px solid ${notification.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`,
          color: notification.type === "error" ? "#fca5a5" : "#6ee7b7",
          padding: "12px 20px", borderRadius: "12px",
          fontSize: "0.85rem", fontWeight: 600,
          backdropFilter: "blur(12px)",
          animation: "fadeIn 0.3s ease",
          maxWidth: 360,
        }}>
          {notification.msg}
        </div>
      )}

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <UIIcon name="shield" size={18} />
          </div>
          <span className="sidebar-logo-text">Axon Connect</span>
          <span className="sidebar-logo-badge">BETA</span>
        </div>

        <div className="sidebar-section-label">Workspace</div>
        {navWithBadges.map(n => {
          const isActive = view === n.id || (view === "tester" && n.id === "dashboard");
          const content = (
            <>
              <span className="nav-icon">
                <UIIcon name={n.icon} size={18} />
              </span>
              <span>{n.label}</span>
              {n.badge ? (
                <span className={`nav-badge ${n.badge === 0 ? "pending" : ""}`}>{n.badge}</span>
              ) : null}
            </>
          );

          if (n.path) {
            return (
              <Link key={n.id} href={n.path} className="nav-item">
                {content}
              </Link>
            );
          }

          return (
            <div
              key={n.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => { setView(n.id); if (n.id !== "tester") setSelectedId(null); }}
            >
              {content}
            </div>
          );
        })}

        <div className="sidebar-sep" />
        <div className="sidebar-section-label">Providers</div>

        {ALL_PROVIDERS.filter(p => oauthTokens.includes(p.id)).map(p => (
          <div
            key={p.id}
            className={`nav-item ${selectedId === p.id ? "active" : ""}`}
            onClick={() => openTester(p.id)}
          >
            <span className="nav-icon">
              <BrandIcon id={p.id} size={16} />
            </span>
            <span>{p.name}</span>
            <span className="nav-badge">✓</span>
          </div>
        ))}

        {oauthTokens.length === 0 && (
          <div style={{ padding: "10px 20px", fontSize: "0.75rem", color: "var(--text-3)", lineHeight: 1.6 }}>
            No connected providers yet. Connect one from the dashboard.
          </div>
        )}

        <div className="sidebar-footer">
          <div className="small-chip">
            <div className="status-dot" />
            Neon DB · {connectedCount} token{connectedCount !== 1 ? "s" : ""} stored
          </div>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────── */}
      <div className="main">
        {/* Header */}
        <header className="main-header">
          <div className="header-breadcrumb">
            <span>Axon Connect</span>
            <span className="header-sep">/</span>
            <b>
              {view === "dashboard" && "All Integrations"}
              {view === "connected" && "Connected Apps"}
              {view === "tokens"    && "Token Vault"}
              {view === "tester"   && selected?.name}
            </b>
          </div>
          <div className="header-actions">
            {view === "tester" && (
              <button className="btn-ghost btn-sm" onClick={() => setView("dashboard")}>
                ← Back
              </button>
            )}
            <button className="icon-btn" title="Refresh" onClick={reloadTokens}>↻</button>
            <div className="pill pill-green">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
              DB Live
            </div>
          </div>
        </header>

        {/* Pages */}
        <div className="page-content">

          {/* ═══════════════════════════════════════════════════════
               DASHBOARD
          ══════════════════════════════════════════════════════ */}
          {view === "dashboard" && (
            <div className="anim-fade-up">
              {/* Page header */}
              <div className="page-header">
                <div className="page-title">All Integrations</div>
                <div className="page-subtitle">
                  Connect your tools via OAuth. Credentials are stored securely in Neon PostgreSQL.
                </div>
              </div>

              {/* Stats */}
              <div className="stats-bar stagger">
                <div className="stat-card anim-fade-up">
                  <div className="stat-label">Total Providers</div>
                  <div className="stat-value">{totalProviders}</div>
                  <div className="stat-sub">Across 5 categories</div>
                </div>
                <div className="stat-card anim-fade-up">
                  <div className="stat-label">Connected</div>
                  <div className="stat-value stat-dot-green">{connectedCount}</div>
                  <div className="stat-sub">Active OAuth tokens</div>
                </div>
                <div className="stat-card anim-fade-up">
                  <div className="stat-label">OAuth Capable</div>
                  <div className="stat-value">{oauthOnlyCount}</div>
                  <div className="stat-sub">Providers with OAuth 2.0</div>
                </div>
                <div className="stat-card anim-fade-up">
                  <div className="stat-label">Remaining</div>
                  <div className="stat-value stat-dot-amber">{totalProviders - connectedCount}</div>
                  <div className="stat-sub">Not yet connected</div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="toolbar">
                <div className="search-wrap">
                  <span className="search-icon">
                    <UIIcon name="search" size={16} />
                  </span>
                  <input
                    placeholder="Search integrations…"
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                  />
                </div>
                <div className="filter-chips">
                  {["all", "connected", "notConnected"].map(f => (
                    <div
                      key={f}
                      className={`chip ${connFilter === f ? "active" : ""}`}
                      onClick={() => setConnFilter(f)}
                    >
                      {f === "all" ? "All" : f === "connected" ? "✓ Connected" : "Not Connected"}
                    </div>
                  ))}
                </div>
              </div>

              {/* Category tabs */}
              <div className="filter-chips" style={{ marginBottom: 16, flexWrap: "wrap", gap: 6 }}>
                {CATEGORIES.map(c => (
                  <div
                    key={c}
                    className={`chip ${catFilter === c ? "active" : ""}`}
                    onClick={() => setCatFilter(c)}
                  >
                    {c}
                  </div>
                ))}
              </div>

              {/* Provider grid */}
              <div className="provider-grid stagger">
                {filtered.map(p => {
                  const isConnected = oauthTokens.includes(p.id);
                  const isConfigured = storedConfigs.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`provider-card anim-fade-up ${isConnected ? "connected" : ""}`}
                      onClick={() => openTester(p.id)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div className="provider-logo">
                          <BrandIcon id={p.id} size={24} />
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          {isConfigured && !isConnected && <span className="pill pill-indigo" style={{ fontSize: '0.65rem' }}>Configured</span>}
                          {isConnected && <span className="pill pill-green">✓</span>}
                        </div>
                      </div>
                      <div>
                        <div className="provider-name">{p.name}</div>
                        <div className="provider-category">{p.category}</div>
                      </div>
                      <div className={`provider-status ${isConnected ? "ok" : "pending"}`}>
                        <span className="dot" />
                        {isConnected ? "Connected" : p.authTypes.includes("oauth") ? "OAuth Ready" : "API Key"}
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: "var(--text-3)" }}>
                    No integrations match your filters.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
               CONNECTED VIEW
          ══════════════════════════════════════════════════════ */}
          {view === "connected" && (
            <div className="anim-fade-up">
              <div className="page-header">
                <div className="page-title">Connected Apps</div>
                <div className="page-subtitle">{connectedCount} active OAuth connection{connectedCount !== 1 ? "s" : ""}. Tokens stored in Neon DB.</div>
              </div>

              {connectedCount === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-3)" }}>
                  <div style={{ marginBottom: 24, opacity: 0.2, display: "flex", justifyContent: "center" }}>
                    <UIIcon name="connected" size={64} />
                  </div>
                  <div style={{ fontSize: "0.95rem" }}>No connected providers yet.</div>
                  <div style={{ fontSize: "0.82rem", marginTop: 8 }}>Go to All Integrations and connect your first app.</div>
                  <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => setView("dashboard")}>
                    Browse Integrations
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {ALL_PROVIDERS.filter(p => oauthTokens.includes(p.id)).map(p => (
                    <div key={p.id} style={{
                      background: "var(--surface)",
                      border: "1px solid rgba(16,185,129,0.2)",
                      borderRadius: "var(--radius-md)",
                      padding: "18px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}>
                      <BrandIcon id={p.id} size={32} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{p.name}</div>
                        <div style={{ fontSize: "0.76rem", color: "var(--text-2)", marginTop: 2 }}>{p.category}</div>
                      </div>
                      <span className="pill pill-green">● Connected</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn-ghost btn-sm" onClick={() => openTester(p.id)} title="Test Connection">Test →</button>
                        <button className="btn-ghost btn-sm" onClick={() => openTester(p.id)} title="Edit Configuration">
                          <UIIcon name="edit" size={14} />
                        </button>
                        <button
                          className="btn-danger btn-sm"
                          disabled={disconnecting === p.id}
                          onClick={() => disconnect(p.id)}
                        >
                          {disconnecting === p.id ? "…" : "Disconnect"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
               TOKEN VAULT VIEW
          ══════════════════════════════════════════════════════ */}
          {view === "tokens" && (
            <div className="anim-fade-up">
              <div className="page-header">
                <div className="page-title">Token Vault</div>
                <div className="page-subtitle">All OAuth tokens stored in Neon DB. Secrets are never sent to the client.</div>
              </div>

              <div className="panel" style={{ marginBottom: 20 }}>
                <div className="panel-header">
                  <UIIcon name="tokens" size={16} style={{ marginRight: 8 }} />
                  <span className="panel-title">Stored Tokens</span>
                  <span className="pill pill-indigo" style={{ marginLeft: "auto" }}>{connectedCount} active</span>
                </div>
                <div className="panel-body" style={{ padding: 0 }}>
                  {connectedCount === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-3)", fontSize: "0.85rem" }}>
                      No tokens stored yet.
                    </div>
                  ) : (
                    <table className="token-table">
                      <thead>
                        <tr>
                          <th>Provider</th>
                          <th>Status</th>
                          <th>Stored At</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ALL_PROVIDERS.filter(p => oauthTokens.includes(p.id)).map(p => (
                          <tr key={p.id}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <BrandIcon id={p.id} size={18} />
                                <span className="token-name">{p.id}</span>
                              </div>
                            </td>
                            <td><span className="pill pill-green">● Active</span></td>
                            <td>{new Date().toLocaleDateString()}</td>
                            <td>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button className="btn-ghost btn-sm" onClick={() => openTester(p.id)}>Test</button>
                                <button className="btn-ghost btn-sm" onClick={() => openTester(p.id)} title="Edit Config">
                                  <UIIcon name="edit" size={14} />
                                </button>
                                <button className="btn-danger btn-sm" disabled={disconnecting === p.id} onClick={() => disconnect(p.id)}>
                                  {disconnecting === p.id ? "…" : "Revoke"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
               LOGS VIEW
          ══════════════════════════════════════════════════════ */}
          {view === "logs" && (
            <div className="anim-fade-up">
              <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <div className="page-title">Activity Logs</div>
                  <div className="page-subtitle">Historical log of OAuth connection attempts and results.</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-ghost" onClick={fetchLogs} disabled={loadingLogs}>
                    {loadingLogs ? "Refreshing..." : "Refresh"}
                  </button>
                  <button className="btn-danger btn-sm" onClick={clearAllLogs}>Clear All</button>
                </div>
              </div>

              <div className="panel" style={{ overflow: 'hidden' }}>
                <div className="panel-body" style={{ padding: 0 }}>
                  {logs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-3)" }}>
                      <UIIcon name="activity" size={32} style={{ opacity: 0.2, marginBottom: 12 }} />
                      <div style={{ fontSize: "0.85rem" }}>No activity recorded yet.</div>
                    </div>
                  ) : (
                    <table className="token-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Provider</th>
                          <th>Status</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map(log => (
                          <tr key={log.id}>
                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.72rem', color: 'var(--text-3)' }}>
                              {new Date(log.created_at).toLocaleString()}
                            </td>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <BrandIcon id={log.provider} size={16} />
                                <span style={{ textTransform: 'capitalize' }}>{log.provider}</span>
                              </div>
                            </td>
                            <td>
                              <span className={`pill ${log.status === "SUCCESS" ? "pill-green" : "pill-red"}`}>
                                {log.status}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.78rem', opacity: 0.8 }}>
                              {log.message || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* ═══════════════════════════════════════════════════════
               TESTER VIEW
          ══════════════════════════════════════════════════════ */}
          {view === "tester" && selected && (
            <div className="tester-layout anim-fade-up">

              {/* Left panel: Config + Auth */}
              <div className="panel">
                {/* Provider hero */}
                <div className="provider-hero">
                  <div className="provider-hero-icon">
                    <BrandIcon id={selected.id} size={32} />
                  </div>
                  <div>
                    <div className="provider-hero-name">{selected.name}</div>
                    <div className="provider-hero-desc">{selected.category}</div>
                  </div>
                  <div className="provider-hero-status">
                    <span className={`pill ${isConnected ? "pill-green" : "pill-gray"}`}>
                      {isConnected ? "● Connected" : "Not Connected"}
                    </span>
                    {isConnected && (
                      <button
                        className="btn-danger btn-sm"
                        disabled={disconnecting === selected.id}
                        onClick={() => disconnect(selected.id)}
                      >
                        {disconnecting === selected.id ? "…" : "Disconnect"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Auth type tabs */}
                <div className="auth-tabs">
                  {selected.authTypes.map(t => (
                    <div
                      key={t}
                      className={`auth-tab ${activeAuthTab === t ? "active" : ""}`}
                      onClick={() => { setActiveAuthTab(t); setResult(null); }}
                    >
                      {t === "oauth" ? "OAuth 2.0" : t === "token" ? "API Token" : t === "basic" ? "Basic Auth" : "Custom"}
                    </div>
                  ))}
                </div>

                {/* Panel body */}
                <div className="panel-body">

                  {/* ── OAuth Tab ── */}
                  {activeAuthTab === "oauth" && (
                    <div className="form-block">
                      <div className="hint-box">{selected.hint}</div>

                      <div className="form-row">
                        <div className="form-label">
                          Client ID
                          {customConfig.clientId && <span className="form-label-badge">✓ saved</span>}
                        </div>
                        <input
                          placeholder="Paste your Client ID"
                          value={customConfig.clientId}
                          onChange={e => setCustomConfig({ ...customConfig, clientId: e.target.value })}
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-label">
                          Client Secret
                          {secretSaved && (
                            <span className="form-label-badge">✓ stored in DB</span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input
                            type={showSecret ? "text" : "password"}
                            placeholder={secretSaved && !customConfig.clientSecret ? "Leave blank to keep existing secret" : "Paste your Client Secret"}
                            value={customConfig.clientSecret}
                            onChange={e => setCustomConfig({ ...customConfig, clientSecret: e.target.value })}
                            style={{ flex: 1, fontFamily: showSecret && customConfig.clientSecret ? '"JetBrains Mono", monospace' : 'inherit', fontSize: showSecret && customConfig.clientSecret ? '0.78rem' : 'inherit' }}
                          />
                          <button
                            className="btn-ghost btn-sm"
                            type="button"
                            title={showSecret ? "Hide secret" : "Show secret"}
                            onClick={() => setShowSecret(s => !s)}
                            style={{ padding: "0 12px", flexShrink: 0 }}
                          >
                            <UIIcon name={showSecret ? "eyeOff" : "eye"} size={16} />
                          </button>
                        </div>
                      </div>


                      <div className="form-row">
                        <div className="form-label">Redirect URI</div>
                        <div className="input-with-copy">
                          <input value={customConfig.redirectUri} readOnly />
                          <button className="btn-ghost btn-sm" onClick={() => { navigator.clipboard.writeText(customConfig.redirectUri); notify("success", "Redirect URI copied!"); }}>
                            Copy
                          </button>
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 5 }}>
                          Add this URI in your provider's developer portal.
                        </div>
                      </div>

                      <button
                        className="btn-save btn-full"
                        onClick={saveConfig}
                        disabled={cfgSaving}
                      >
                        {cfgSaving ? (
                          <span className="spin" style={{ marginRight: 8 }}>↻</span>
                        ) : cfgSavedOk ? (
                          <span style={{ marginRight: 8 }}>✓</span>
                        ) : (
                          <UIIcon name="save" size={16} />
                        )}
                        <span style={{ marginLeft: 8 }}>
                          {cfgSaving ? "Saving…" : cfgSavedOk ? "Saved to Neon DB" : "Save Config to Database"}
                        </span>
                      </button>

                      {storedConfigs.includes(selected.id) && (
                        <button
                          className="btn-ghost btn-sm btn-full"
                          style={{ marginTop: 8, color: "var(--red)", opacity: 0.7 }}
                          onClick={deleteConfig}
                        >
                          Delete Stored Credentials
                        </button>
                      )}

                      <div className="sep" />

                      <div className="actions-row">
                        <button
                          className="btn-primary"
                          style={{ flex: 1 }}
                          onClick={startOAuth}
                        >
                          {isConnected ? "🔄 Reconnect via OAuth" : "🔐 Connect via OAuth"}
                        </button>
                      </div>

                      {isConnected && (
                        <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: "14px 16px", fontSize: "0.8rem", color: "#6ee7b7" }}>
                          ✅ Token is active. You can run a connection test below.
                        </div>
                      )}

                      {isConnected && (
                        <div>
                          <div className="sep" />
                          <div className="form-label" style={{ marginBottom: 10 }}>Test Connected Token</div>
                          <button className="btn-success btn-full" onClick={testConnection} disabled={busy}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              {busy ? <span className="spin">↻</span> : <UIIcon name="test" size={16} />}
                              <span>{busy ? "Testing…" : "Run API Test"}</span>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Token / Basic / Custom Tab ── */}
                  {activeAuthTab !== "oauth" && (
                    <div className="form-block">
                      <div className="hint-box">{selected.hint}</div>

                      <div className="form-row">
                        <div className="form-label">Credential Source</div>
                        <select value={useEnv ? "env" : "manual"} onChange={e => setUseEnv(e.target.value === "env")}>
                          <option value="env">Use Server Environment (.env.local)</option>
                          <option value="manual">Manual Input</option>
                        </select>
                      </div>

                      {!useEnv && selected.fields?.[activeAuthTab]?.map(f => (
                        <div className="form-row" key={f.key}>
                          <div className="form-label">{f.label}</div>
                          <input
                            placeholder={f.placeholder}
                            value={testValues[f.key] || ""}
                            onChange={e => setTestValues({ ...testValues, [f.key]: e.target.value })}
                          />
                        </div>
                      ))}

                      <div className="form-row">
                        <div className="form-label">Extra JSON Body <span style={{ opacity: 0.5, textTransform: "none", fontWeight: 400 }}>(optional)</span></div>
                        <textarea
                          value={rawBody}
                          onChange={e => setRawBody(e.target.value)}
                          placeholder="{}"
                        />
                      </div>

                      <div className="actions-row">
                        <button className="btn-primary" style={{ flex: 1 }} onClick={testConnection} disabled={busy}>
                          {busy ? <span className="spin">↻</span> : "🧪"} {busy ? "Testing…" : "Run Connection Test"}
                        </button>
                        <button className="btn-ghost" onClick={() => { setTestValues({}); setResult(null); }}>Reset</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right panel: Result */}
              <div className="panel">
                <div className="panel-header">
                  <span>📡</span>
                  <span className="panel-title">Test Result</span>
                  {result && (
                    <span className={`pill ${result.ok ? "pill-green" : "pill-red"}`} style={{ marginLeft: "auto" }}>
                      {result.ok ? "✓ SUCCESS" : "✗ FAILED"}
                    </span>
                  )}
                </div>
                <div className="panel-body">
                  {!result && !busy && (
                    <div className="result-empty">
                      <div className="result-empty-icon">📡</div>
                      <div className="result-empty-text">
                        Configure credentials and run a test to see results here.
                      </div>
                    </div>
                  )}
                  {busy && (
                    <div className="result-empty">
                      <div className="spin" style={{ fontSize: "2rem" }}>↻</div>
                      <div className="result-empty-text">Sending request…</div>
                    </div>
                  )}
                  {result && !busy && (
                    <div>
                      <div className="result-header">
                        <div className="result-status">
                          <span>Status:</span>
                          <span className={`pill ${result.ok ? "pill-green" : "pill-red"}`}>
                            {result.ok ? "SUCCESS" : "FAILED"}
                          </span>
                        </div>
                        <button className="btn-ghost btn-sm" onClick={() => setResult(null)}>Clear</button>
                      </div>
                      <pre>{JSON.stringify(result, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
