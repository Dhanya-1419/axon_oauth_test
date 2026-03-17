"use client";

import { useState, useMemo, useEffect } from "react";

const APP_DEFS = [
  {
    id: "github",
    name: "GitHub",
    authType: "bearer",
    fields: [{ key: "token", label: "Personal Access Token", placeholder: "ghp_..." }],
    hint: "Uses GET https://api.github.com/user"
  },
  {
    id: "slack",
    name: "Slack",
    authType: "bearer",
    fields: [{ key: "token", label: "Bot/User Token", placeholder: "xoxb-... or xoxp-..." }],
    hint: "Uses POST https://slack.com/api/auth.test"
  },
  {
    id: "stripe",
    name: "Stripe",
    authType: "basic",
    fields: [{ key: "secretKey", label: "Secret Key", placeholder: "sk_live_... or sk_test_..." }],
    hint: "Uses GET https://api.stripe.com/v1/account"
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    authType: "basic",
    fields: [
      { key: "apiKey", label: "API Key", placeholder: "xxxxxxxx-usX" },
      { key: "serverPrefix", label: "Server Prefix", placeholder: "usX" }
    ],
    hint: "Uses GET https://{serverPrefix}.api.mailchimp.com/3.0/ping"
  },
  {
    id: "airtable",
    name: "Airtable",
    authType: "bearer",
    fields: [{ key: "apiKey", label: "Personal Access Token", placeholder: "pat..." }],
    hint: "Uses GET https://api.airtable.com/v0/meta/whoami"
  },
  {
    id: "jotform",
    name: "Jotform",
    authType: "custom",
    fields: [{ key: "apiKey", label: "API Key", placeholder: "..." }],
    hint: "Uses GET https://api.jotform.com/user?apiKey=..."
  },
  {
    id: "ticketbud",
    name: "Ticketbud",
    authType: "bearer",
    fields: [{ key: "apiKey", label: "API Key", placeholder: "..." }],
    hint: "Uses GET https://api.ticketbud.com/v1/"
  },
  {
    id: "digisign",
    name: "digisign",
    authType: "bearer",
    fields: [
      { key: "apiKey", label: "API Key", placeholder: "..." },
      { key: "baseUrl", label: "Base URL", placeholder: "https://api.vendor.com" }
    ],
    hint: "Uses GET {baseUrl}/ (Bearer token). Set DIGISIGN_BASE_URL if you want env-only mode."
  },
  {
    id: "google",
    name: "Google (OAuth token info)",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "ya29..." }],
    hint: "Uses GET https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=..."
  },
  {
    id: "microsoft_graph",
    name: "Microsoft Graph (Outlook/Teams/OneDrive/SharePoint)",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "eyJ..." }],
    hint: "Uses GET https://graph.microsoft.com/v1.0/me"
  },
  {
    id: "jira",
    name: "Jira (OAuth)",
    authType: "oauth",
    fields: [],
    hint: "Uses OAuth 2.0 with Atlassian Cloud"
  },
  {
    id: "atlassian_jira",
    name: "Jira (Atlassian Cloud - Basic)",
    authType: "basic",
    fields: [
      { key: "siteUrl", label: "Site URL", placeholder: "https://your-domain.atlassian.net" },
      { key: "email", label: "Email", placeholder: "you@company.com" },
      { key: "apiToken", label: "API Token", placeholder: "Atlassian API token" }
    ],
    hint: "Uses GET {siteUrl}/rest/api/3/myself"
  },
  {
    id: "atlassian_confluence",
    name: "Confluence (Atlassian Cloud)",
    authType: "basic",
    fields: [
      { key: "siteUrl", label: "Site URL", placeholder: "https://your-domain.atlassian.net" },
      { key: "email", label: "Email", placeholder: "you@company.com" },
      { key: "apiToken", label: "API Token", placeholder: "Atlassian API token" }
    ],
    hint: "Uses GET {siteUrl}/wiki/rest/api/user/current"
  },
  {
    id: "confluence_oauth",
    name: "Confluence (OAuth)",
    authType: "oauth",
    fields: [],
    hint: "Uses OAuth 2.0 flow with Atlassian Cloud"
  },
  {
    id: "salesforce",
    name: "Salesforce",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "00D..." }],
    hint: "Uses GET {instanceUrl}/services/data/v56.0/sobjects/"
  },
  {
    id: "notion_oauth",
    name: "Notion (OAuth)",
    authType: "oauth",
    fields: [],
    hint: "Uses OAuth 2.0 with Notion API"
  },
  {
    id: "notion",
    name: "Notion (Bearer Token)",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "secret_..." }],
    hint: "Uses POST https://api.notion.com/v1/search"
  },
  {
    id: "clickup_oauth",
    name: "ClickUp (OAuth)",
    authType: "oauth",
    fields: [],
    hint: "Uses OAuth 2.0 with ClickUp API"
  },
  {
    id: "clickup",
    name: "ClickUp (API Key)",
    authType: "bearer",
    fields: [{ key: "apiKey", label: "API Key", placeholder: "pk_..." }],
    hint: "Uses GET https://api.clickup.com/api/v2/team"
  },
  {
    id: "asana_oauth",
    name: "Asana (OAuth)",
    authType: "oauth",
    fields: [],
    hint: "Uses OAuth 2.0 with Asana API"
  },
  {
    id: "asana",
    name: "Asana (Access Token)",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "1/..." }],
    hint: "Uses GET https://app.asana.com/api/1.0/users/me"
  },
  {
    id: "calendly_oauth",
    name: "Calendly (OAuth)",
    authType: "oauth",
    fields: [],
    hint: "Uses OAuth 2.0 with Calendly API"
  },
  {
    id: "calendly",
    name: "Calendly (Access Token)",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "eyJ..." }],
    hint: "Uses GET https://api.calendly.com/users/me"
  },
  {
    id: "figma_oauth",
    name: "Figma (OAuth)",
    authType: "oauth",
    fields: [],
    hint: "Uses OAuth 2.0 with Figma API"
  },
  {
    id: "figma",
    name: "Figma (Access Token)",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "figd_" }],
    hint: "Uses GET https://api.figma.com/v1/me"
  },
  {
    id: "dropbox_oauth",
    name: "Dropbox (OAuth)",
    authType: "oauth",
    fields: [],
    hint: "Uses OAuth 2.0 with Dropbox API"
  },
  {
    id: "dropbox",
    name: "Dropbox (Access Token)",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "sl." }],
    hint: "Uses GET https://api.dropboxapi.com/2/users/get_current_account"
  },
  {
    id: "box_oauth",
    name: "Box (OAuth)",
    authType: "oauth",
    fields: [],
    hint: "Uses OAuth 2.0 with Box API"
  },
  {
    id: "box",
    name: "Box (Access Token)",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "..." }],
    hint: "Uses GET https://api.box.com/2.0/users/me"
  },
  {
    id: "zoom",
    name: "Zoom",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "eyJ..." }],
    hint: "Uses GET https://api.zoom.us/v2/users/me"
  },
  {
    id: "docusign",
    name: "DocuSign",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "eyJ..." }],
    hint: "Uses GET https://demo.docusign.net/restapi/v2.1/login_information"
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "eyJ..." }],
    hint: "Uses GET https://quickbooks.api.intuit.com/v3/company/{realmId}/companyinfo/{realmId}"
  },
  {
    id: "eventbrite",
    name: "Eventbrite",
    authType: "custom",
    fields: [
      { key: "clientId", label: "Client ID", placeholder: "ONZXHHOUM7O5PD4EJ4" },
      { key: "clientSecret", label: "Client Secret", placeholder: "2KQOJDWK2V5HNHJGE5G7E2CC4UET7IWVUO2U6KIA5CLHK7UGI6" },
      { key: "privateToken", label: "Private Token", placeholder: "AASGIN34GRB3DFVRPJ4A" },
      { key: "publicToken", label: "Public Token", placeholder: "TXC46VGD466V7Y7CUVMA" }
    ],
    hint: "Uses Eventbrite API v3 with OAuth or Private/Public tokens"
  },
  {
    id: "snowflake",
    name: "Snowflake",
    authType: "custom",
    fields: [
      { key: "account", label: "Account", placeholder: "xy12345.eu-central-1" },
      { key: "user", label: "User", placeholder: "..." },
      { key: "password", label: "Password", placeholder: "..." },
      { key: "warehouse", label: "Warehouse", placeholder: "..." },
      { key: "role", label: "Role", placeholder: "..." }
    ],
    hint: "Uses Snowflake SQL endpoint via POST"
  },
  {
    id: "hubspot_oauth",
    name: "HubSpot (OAuth)",
    authType: "oauth",
    fields: [],
    hint: "Uses OAuth 2.0 with HubSpot CRM API"
  },
  {
    id: "hubspot",
    name: "HubSpot (Access Token)",
    authType: "bearer",
    fields: [{ key: "accessToken", label: "Access Token", placeholder: "pat.na1..." }],
    hint: "Uses GET https://api.hubapi.com/crm/v3/objects/contacts"
  },
  {
    id: "generic_http",
    name: "Generic HTTP",
    authType: "custom",
    fields: [
      { key: "method", label: "Method", placeholder: "GET" },
      { key: "url", label: "URL", placeholder: "https://api.example.com/endpoint" },
      { key: "headers", label: "Headers (JSON)", placeholder: '{ "Authorization": "Bearer ..." }' },
      { key: "body", label: "Body (JSON)", placeholder: '{ "key": "value" }' }
    ],
    hint: "Sends a generic HTTP request. Use extra JSON body to merge/override."
  }
];

const REQUIRED_ENV_BY_APP = {
  github: ["GITHUB_TOKEN"],
  slack: ["SLACK_TOKEN"],
  stripe: ["STRIPE_SECRET_KEY"],
  mailchimp: ["MAILCHIMP_API_KEY", "MAILCHIMP_SERVER_PREFIX"],
  airtable: ["AIRTABLE_API_KEY"],
  jotform: ["JOTFORM_API_KEY"],
  ticketbud: ["TICKETBUD_API_KEY"],
  digisign: ["DIGISIGN_API_KEY", "DIGISIGN_BASE_URL"],
  google: ["GOOGLE_ACCESS_TOKEN"],
  microsoft_graph: ["MS_GRAPH_ACCESS_TOKEN"],
  atlassian_jira: ["ATLASSIAN_SITE_URL", "ATLASSIAN_EMAIL", "ATLASSIAN_API_TOKEN"],
  atlassian_confluence: ["ATLASSIAN_SITE_URL", "ATLASSIAN_EMAIL", "ATLASSIAN_API_TOKEN"],
  salesforce: ["SALESFORCE_INSTANCE_URL", "SALESFORCE_ACCESS_TOKEN"],
  notion: ["NOTION_ACCESS_TOKEN"],
  clickup: ["CLICKUP_API_KEY"],
  asana: ["ASANA_ACCESS_TOKEN"],
  calendly: ["CALENDLY_ACCESS_TOKEN"],
  dropbox: ["DROPBOX_ACCESS_TOKEN"],
  box: ["BOX_ACCESS_TOKEN"],
  zoom: ["ZOOM_ACCESS_TOKEN"],
  docusign: ["DOCUSIGN_ACCESS_TOKEN"],
  quickbooks: ["QUICKBOOKS_ACCESS_TOKEN"],
  eventbrite: ["EVENTBRITE_CLIENT_ID", "EVENTBRITE_CLIENT_SECRET", "EVENTBRITE_PRIVATE_TOKEN", "EVENTBRITE_PUBLIC_TOKEN"],
  snowflake: ["SNOWFLAKE_ACCOUNT", "SNOWFLAKE_USER", "SNOWFLAKE_PASSWORD", "SNOWFLAKE_WAREHOUSE", "SNOWFLAKE_ROLE"],
  confluence_oauth: ["ATLASSIAN_CLIENT_ID", "ATLASSIAN_CLIENT_SECRET"],
  hubspot: ["HUBSPOT_ACCESS_TOKEN"],
  hubspot_oauth: ["HUBSPOT_CLIENT_ID", "HUBSPOT_CLIENT_SECRET"],
};

const CATEGORIES = [
  {
    title: "Collaboration",
    apps: ["github", "slack", "jira", "atlassian_jira", "atlassian_confluence", "confluence_oauth", "notion_oauth", "notion", "clickup_oauth", "clickup", "asana_oauth", "asana", "calendly_oauth", "calendly", "figma_oauth", "figma"]
  },
  {
    title: "Productivity",
    apps: ["google", "microsoft_graph", "calendly", "dropbox_oauth", "dropbox", "box_oauth", "box", "zoom", "docusign"]
  },
  {
    title: "Marketing",
    apps: ["mailchimp", "eventbrite"]
  },
  {
    title: "Finance",
    apps: ["stripe", "quickbooks"]
  },
  {
    title: "Data & Dev",
    apps: ["airtable", "jotform", "ticketbud", "snowflake", "generic_http"]
  },
  {
    title: "CRM & Sales",
    apps: ["salesforce", "hubspot_oauth", "hubspot"]
  }
];

function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

export default function HomePage() {
  const [selectedId, setSelectedId] = useState(APP_DEFS[0].id);
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [rawBody, setRawBody] = useState("{}");
  const [useEnvOnly, setUseEnvOnly] = useState(true);
  const [envInfo, setEnvInfo] = useState(null);
  const [view, setView] = useState("dashboard");
  const [oauthTokens, setOauthTokens] = useState([]);
  const [apiConnections, setApiConnections] = useState({});

  const selected = useMemo(() => APP_DEFS.find((a) => a.id === selectedId), [selectedId]);

  const requiredEnvKeys = useMemo(() => REQUIRED_ENV_BY_APP[selectedId] || [], [selectedId]);

  const envConfiguredForSelected = useMemo(() => {
    if (!envInfo?.keys) return null;
    if (!requiredEnvKeys.length) return null;
    return requiredEnvKeys.some((k) => Boolean(envInfo.keys[k]));
  }, [envInfo, requiredEnvKeys]);

  // Load env info and OAuth token list on mount
  useEffect(() => {
    let cancelled = false;
    async function loadEnv() {
      try {
        const envRes = await fetch("/api/env");
        const envData = await envRes.json();
        if (!cancelled) {
          setEnvInfo(envData);
          
          // Set API connections based on environment variables
          const connections = {
            airtable: envData.keys?.AIRTABLE_API_KEY || false,
            jotform: envData.keys?.JOTFORM_API_KEY || false,
            digisign: envData.keys?.DIGISIGN_API_KEY || false,
            eventbrite: envData.keys?.EVENTBRITE_CLIENT_ID || false,
          };
          setApiConnections(connections);
        }
      } catch (e) {
        console.error("Failed to load env info:", e);
      }
    }
    async function loadTokens() {
      try {
        const tokenRes = await fetch("/api/oauth/tokens");
        const tokenData = await tokenRes.json();
        if (!cancelled) {
          setOauthTokens(tokenData.providers || []);
        }
      } catch (e) {
        console.error("Failed to load OAuth tokens:", e);
      }
    }
    loadEnv();
    loadTokens();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle OAuth success/error from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("oauth_success");
    const error = params.get("oauth_error");
    if (success) {
      // Reload token list after OAuth success
      fetch("/api/oauth/tokens")
        .then((r) => r.json())
        .then((d) => {
          console.log("OAuth success, token list:", d);
          setOauthTokens(d.providers || []);
        })
        .catch((e) => {
          console.error("Failed to load tokens after OAuth:", e);
          setOauthTokens([]);
        });
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (error) {
      alert(`OAuth error: ${error}`);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  function onChange(key, v) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function testConnection() {
    setBusy(true);
    setResult(null);
    try {
      const extraBody = safeJsonParse(rawBody);
      const res = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: selectedId, values, extraBody }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ ok: false, error: e.message });
    } finally {
      setBusy(false);
    }
  }

  function resetForm() {
    setValues({});
    setResult(null);
  }

  function openTester(appId) {
    setSelectedId(appId);
    setValues({});
    setResult(null);
    setView("tester");
  }

  // Helper to render OAuth status with icon
  function renderOAuthStatus(provider) {
    const isConnected = oauthTokens.includes(provider) ||
                     apiConnections[provider] === true;
    const isSlack = provider === "slack";
    return (
      <span className={`oauth-status ${isConnected ? "connected" : ""}`}>
        {isConnected ? (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {isSlack ? "🔗" : "✓"} Connected
          </span>
        ) : (
          <span>○ Not connected</span>
        )}
      </span>
    );
  }

  function startOAuth(provider) {
    window.location.href = `/api/oauth/start/${provider}`;
  }

  async function disconnect(provider) {
    if (!confirm(`Disconnect ${provider}?`)) return;
    try {
      await fetch("/api/oauth/tokens", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      // Reload token list
      const res = await fetch("/api/oauth/tokens");
      const data = await res.json();
      setOauthTokens(data.providers || []);
    } catch (e) {
      console.error("Failed to disconnect:", e);
    }
  }

  return (
    <main>
      <h1 className="h1">App Integration Tester</h1>
      <p className="sub">Select an app below to open a connection test.</p>

      {view === "dashboard" ? (
        <div className="dashGrid">
          {CATEGORIES.map((c) => (
            <div key={c.title} className="card">
              <div className="cardTitle">{c.title}</div>
              <div className="appList">
                {c.apps.map((appId) => {
                  const app = APP_DEFS.find((a) => a.id === appId);
                  const providerKey = appId === "google" ? "google" : appId === "microsoft_graph" ? "microsoft" : appId === "atlassian_jira" ? "jira" : appId === "notion_oauth" ? "notion" : appId === "clickup_oauth" ? "clickup" : appId === "asana_oauth" ? "asana" : appId === "calendly_oauth" ? "calendly" : appId === "figma_oauth" ? "figma" : appId === "dropbox_oauth" ? "dropbox" : appId === "box_oauth" ? "box" : appId === "confluence_oauth" ? "confluence" : appId;
                  const isConnected = oauthTokens.includes(providerKey) || 
                                   apiConnections[appId] === true;
                  return (
                    <div key={appId} className="appRow" onClick={() => openTester(appId)}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{app?.name || appId}</span>
                        {isConnected && (
                          <span className="pill ok" style={{ fontSize: "10px", padding: "2px 6px", display: "flex", alignItems: "center", gap: "4px" }}>
                            {appId === "slack" ? "🔗" : "✓"} Connected
                          </span>
                        )}
                      </div>
                      <span className="chev">→</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid">
          <div className="card">
            <div className="cardTitle">Test a connection</div>

            <div className="actions" style={{ marginTop: 0, marginBottom: 10 }}>
              <button className="secondary" onClick={() => setView("dashboard")} disabled={busy}>
                Back
              </button>
              {(selectedId === "google" || selectedId === "microsoft_graph" || selectedId === "github" || selectedId === "slack" || selectedId === "jira" || selectedId === "notion_oauth" || selectedId === "clickup_oauth" || selectedId === "asana_oauth" || selectedId === "calendly_oauth" || selectedId === "figma_oauth" || selectedId === "dropbox_oauth" || selectedId === "box_oauth" || selectedId === "confluence_oauth") && (
                <>
                  <button 
                    className={oauthTokens.includes(selectedId === "google" ? "google" : selectedId === "microsoft_graph" ? "microsoft" : selectedId === "atlassian_jira" ? "jira" : selectedId === "notion_oauth" ? "notion" : selectedId === "clickup_oauth" ? "clickup" : selectedId === "asana_oauth" ? "asana" : selectedId === "calendly_oauth" ? "calendly" : selectedId === "figma_oauth" ? "figma" : selectedId === "dropbox_oauth" ? "dropbox" : selectedId === "box_oauth" ? "box" : selectedId) ? "secondary" : ""}
                    onClick={() => startOAuth(selectedId === "google" ? "google" : selectedId === "microsoft_graph" ? "microsoft" : selectedId === "atlassian_jira" ? "jira" : selectedId === "notion_oauth" ? "notion" : selectedId === "clickup_oauth" ? "clickup" : selectedId === "asana_oauth" ? "asana" : selectedId === "calendly_oauth" ? "calendly" : selectedId === "figma_oauth" ? "figma" : selectedId === "dropbox_oauth" ? "dropbox" : selectedId === "box_oauth" ? "box" : selectedId === "confluence_oauth" ? "confluence" : selectedId)} 
                    disabled={busy}
                  >
                    {oauthTokens.includes(selectedId === "google" ? "google" : selectedId === "microsoft_graph" ? "microsoft" : selectedId === "atlassian_jira" ? "jira" : selectedId === "notion_oauth" ? "notion" : selectedId === "clickup_oauth" ? "clickup" : selectedId === "asana_oauth" ? "asana" : selectedId === "calendly_oauth" ? "calendly" : selectedId === "figma_oauth" ? "figma" : selectedId === "dropbox_oauth" ? "dropbox" : selectedId === "box_oauth" ? "box" : selectedId === "confluence_oauth" ? "confluence" : selectedId) ? "Reconnect" : "Connect"} {selectedId === "google" ? "Google" : selectedId === "microsoft_graph" ? "Microsoft" : selectedId === "github" ? "GitHub" : selectedId === "slack" ? "Slack" : selectedId === "jira" ? "Jira" : selectedId === "notion_oauth" ? "Notion" : selectedId === "clickup_oauth" ? "ClickUp" : selectedId === "asana_oauth" ? "Asana" : selectedId === "calendly_oauth" ? "Calendly" : selectedId === "figma_oauth" ? "Figma" : selectedId === "dropbox_oauth" ? "Dropbox" : selectedId === "box_oauth" ? "Box" : selectedId === "confluence_oauth" ? "Confluence" : "App"}
                  </button>
                  {oauthTokens.includes(selectedId === "google" ? "google" : selectedId === "microsoft_graph" ? "microsoft" : selectedId === "atlassian_jira" ? "jira" : selectedId === "notion_oauth" ? "notion" : selectedId === "clickup_oauth" ? "clickup" : selectedId === "asana_oauth" ? "asana" : selectedId === "calendly_oauth" ? "calendly" : selectedId === "figma_oauth" ? "figma" : selectedId === "dropbox_oauth" ? "dropbox" : selectedId === "box_oauth" ? "box" : selectedId) && (
                    <button 
                      className="secondary" 
                      onClick={() => disconnect(selectedId === "google" ? "google" : selectedId === "microsoft_graph" ? "microsoft" : selectedId === "atlassian_jira" ? "jira" : selectedId === "notion_oauth" ? "notion" : selectedId === "clickup_oauth" ? "clickup" : selectedId === "asana_oauth" ? "asana" : selectedId === "calendly_oauth" ? "calendly" : selectedId === "figma_oauth" ? "figma" : selectedId === "dropbox_oauth" ? "dropbox" : selectedId === "box_oauth" ? "box" : selectedId)} 
                      disabled={busy}
                      style={{ color: "var(--danger)" }}
                    >
                      Disconnect
                    </button>
                  )}
                </>
              )}
            </div>

            <div style={{ marginBottom: 10 }}>
              <label>Integration preset</label>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setValues({});
                  setResult(null);
                }}
              >
                {APP_DEFS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <div className="small" style={{ marginTop: 8 }}>
                {selected?.hint}
              </div>
              <div style={{ marginTop: 10 }}>
                <label>Credential source</label>
                <select
                  value={useEnvOnly ? "env" : "manual"}
                  onChange={(e) => {
                    setUseEnvOnly(e.target.value === "env");
                    setResult(null);
                  }}
                >
                  <option value="env">Use server env (.env.local)</option>
                  <option value="manual">Enter manually (sent to server)</option>
                </select>
                <div className="small" style={{ marginTop: 8 }}>
                  Env configured for this app:{" "}
                  {envConfiguredForSelected === null ? (
                    "—"
                  ) : (
                    <span className={envConfiguredForSelected ? "ok" : "bad"}>{envConfiguredForSelected ? "Yes" : "No"}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              {selected.fields.map((f) => (
                <div key={f.key}>
                  <label>{f.label}</label>
                  <input
                    value={values[f.key] || ""}
                    placeholder={f.placeholder}
                    onChange={(e) => onChange(f.key, e.target.value)}
                    disabled={useEnvOnly}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 10 }}>
              <label>Extra JSON body (optional)</label>
              <textarea value={rawBody} onChange={(e) => setRawBody(e.target.value)} />
              <div className="small" style={{ marginTop: 6 }}>
                Only used by some integrations / generic HTTP.
              </div>
            </div>

            <div className="actions">
              <button onClick={testConnection} disabled={busy}>
                {busy ? "Testing..." : "Test Connection"}
              </button>
              <button className="secondary" onClick={resetForm} disabled={busy}>
                Reset
              </button>
              <span className="pill">
                Status: {result ? <span className={result.ok ? "ok" : "bad"}>{result.ok ? "OK" : "FAILED"}</span> : "—"}
              </span>
            </div>
            {useEnvOnly ? (
              <div className="small" style={{ marginTop: 10 }}>
                This test will use credentials from server env (your <code>.env.local</code>). If you get “Missing fields”, you
                need to add the required env variables.
                {requiredEnvKeys.length ? (
                  <div style={{ marginTop: 8 }}>
                    <div>Required env keys for this preset:</div>
                    <pre style={{ marginTop: 8 }}>{requiredEnvKeys.join("\n")}</pre>
                  </div>
                ) : null}
                {(selectedId === "google" || selectedId === "microsoft_graph" || selectedId === "github" || selectedId === "slack" || selectedId === "jira" || selectedId === "notion_oauth" || selectedId === "clickup_oauth" || selectedId === "asana_oauth" || selectedId === "calendly_oauth" || selectedId === "figma_oauth" || selectedId === "dropbox_oauth" || selectedId === "box_oauth" || selectedId === "airtable" || selectedId === "jotform" || selectedId === "digisign" || selectedId === "confluence_oauth") && (
                <div style={{ marginTop: 10 }}>
                  <div>OAuth status:</div>
                  <pre style={{ marginTop: 8 }}>
                    {renderOAuthStatus(selectedId === "google" ? "google" : selectedId === "microsoft_graph" ? "microsoft" : selectedId === "atlassian_jira" ? "jira" : selectedId === "notion_oauth" ? "notion" : selectedId === "clickup_oauth" ? "clickup" : selectedId === "asana_oauth" ? "asana" : selectedId === "calendly_oauth" ? "calendly" : selectedId === "figma_oauth" ? "figma" : selectedId === "dropbox_oauth" ? "dropbox" : selectedId === "box_oauth" ? "box" : selectedId === "confluence_oauth" ? "confluence" : selectedId === "airtable" ? "airtable" : selectedId === "jotform" ? "jotform" : selectedId === "digisign" ? "digisign" : selectedId === "eventbrite" ? "eventbrite" : selectedId)}
                  </pre>
                </div>
              )}
              </div>
            ) : null}
          </div>

          <div className="card">
            <div className="cardTitle">Result</div>
            <pre>{result ? JSON.stringify(result, null, 2) : "Run a test to see results."}</pre>
          </div>
        </div>
      )}
    </main>
  );
}
