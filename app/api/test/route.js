import { NextResponse } from "next/server";

export const runtime = "nodejs";

function json(data, init) {
  return NextResponse.json(data, init);
}

function pick(values, key, envKey) {
  const v = values?.[key];
  if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  const e = process.env[envKey];
  if (e !== undefined && e !== null && String(e).trim() !== "") return String(e);
  return "";
}

function pickAny(values, key, envKeys) {
  const v = values?.[key];
  if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  for (const k of envKeys) {
    const e = process.env[k];
    if (e !== undefined && e !== null && String(e).trim() !== "") return String(e);
  }
  return "";
}

function required(picked, keys) {
  const missing = keys.filter((k) => !picked?.[k] || String(picked[k]).trim() === "");
  if (missing.length) {
    const err = new Error(`Missing fields: ${missing.join(", ")}`);
    err.status = 400;
    throw err;
  }
}

async function fetchJson(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();

  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return { ok: res.ok, status: res.status, headers: Object.fromEntries(res.headers.entries()), body };
}

function b64(s) {
  return Buffer.from(s, "utf8").toString("base64");
}

export async function POST(req) {
  try {
    const { appId, values, extraBody } = await req.json();

    if (!appId) return json({ error: "Missing appId" }, { status: 400 });

    switch (appId) {
      case "github": {
        const picked = { token: pick(values, "token", "GITHUB_TOKEN") };
        // Fallback to OAuth-stored token if not provided manually
        if (!picked.token) {
          const { getToken } = await import("../oauth/tokens/route.js");
          const stored = getToken("github");
          if (stored) picked.token = stored.access_token;
        }
        required(picked, ["token"]);
        const r = await fetchJson("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${picked.token}`,
            "User-Agent": "integration-tester"
          }
        });
        return json({ appId, request: { url: "https://api.github.com/user", method: "GET" }, response: r }, { status: r.ok ? 200 : 400 });
      }

      case "slack": {
        const picked = { token: pick(values, "token", "SLACK_TOKEN") };
        // Fallback to OAuth-stored token if not provided manually
        if (!picked.token) {
          const { getToken } = await import("../oauth/tokens/route.js");
          const stored = getToken("slack");
          if (stored) picked.token = stored.access_token;
        }
        required(picked, ["token"]);
        const r = await fetchJson("https://slack.com/api/auth.test", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${picked.token}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: ""
        });
        const ok = r.ok && r.body && typeof r.body === "object" ? Boolean(r.body.ok) : false;
        return json({ appId, request: { url: "https://slack.com/api/auth.test", method: "POST" }, response: r }, { status: ok ? 200 : 400 });
      }

      case "stripe": {
        const picked = { secretKey: pickAny(values, "secretKey", ["STRIPE_SECRET_KEY", "STRIPE_API_KEY"]) };
        required(picked, ["secretKey"]);
        const r = await fetchJson("https://api.stripe.com/v1/account", {
          headers: {
            Authorization: `Basic ${b64(`${picked.secretKey}:`)}`
          }
        });
        return json({ appId, request: { url: "https://api.stripe.com/v1/account", method: "GET" }, response: r }, { status: r.ok ? 200 : 400 });
      }

      case "google": {
        const picked = { accessToken: pick(values, "accessToken", "GOOGLE_ACCESS_TOKEN") };
        // Fallback to OAuth-stored token if not provided manually
        if (!picked.accessToken) {
          const { getToken } = await import("../oauth/tokens/route.js");
          const stored = getToken("google");
          if (stored) picked.accessToken = stored.access_token;
        }
        required(picked, ["accessToken"]);
        const url = `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${encodeURIComponent(picked.accessToken)}`;
        const r = await fetchJson(url);
        return json({ appId, request: { url, method: "GET" }, response: r }, { status: r.ok ? 200 : 400 });
      }

      case "microsoft_graph": {
        const picked = { accessToken: pick(values, "accessToken", "MS_GRAPH_ACCESS_TOKEN") };
        // Fallback to OAuth-stored token if not provided manually
        if (!picked.accessToken) {
          const { getToken } = await import("../oauth/tokens/route.js");
          const stored = getToken("microsoft");
          if (stored) picked.accessToken = stored.access_token;
        }
        required(picked, ["accessToken"]);
        const r = await fetchJson("https://graph.microsoft.com/v1.0/me", {
          headers: {
            Authorization: `Bearer ${picked.accessToken}`
          }
        });
        return json({ appId, request: { url: "https://graph.microsoft.com/v1.0/me", method: "GET" }, response: r }, { status: r.ok ? 200 : 400 });
      }

      case "atlassian_jira": {
        const picked = {
          siteUrl: pick(values, "siteUrl", "ATLASSIAN_SITE_URL"),
          email: pick(values, "email", "ATLASSIAN_EMAIL"),
          apiToken: pick(values, "apiToken", "ATLASSIAN_API_TOKEN")
        };
        required(picked, ["siteUrl", "email", "apiToken"]);
        const base = String(picked.siteUrl).replace(/\/+$/, "");
        const url = `${base}/rest/api/3/myself`;
        const r = await fetchJson(url, {
          headers: {
            Authorization: `Basic ${b64(`${picked.email}:${picked.apiToken}`)}`,
            Accept: "application/json"
          }
        });
        return json({ appId, request: { url, method: "GET" }, response: r }, { status: r.ok ? 200 : 400 });
      }

      case "atlassian_confluence": {
        const picked = {
          siteUrl: pick(values, "siteUrl", "ATLASSIAN_SITE_URL"),
          email: pick(values, "email", "ATLASSIAN_EMAIL"),
          apiToken: pick(values, "apiToken", "ATLASSIAN_API_TOKEN")
        };
        required(picked, ["siteUrl", "email", "apiToken"]);
        const base = String(picked.siteUrl).replace(/\/+$/, "");
        const url = `${base}/wiki/rest/api/user/current`;
        const r = await fetchJson(url, {
          headers: {
            Authorization: `Basic ${b64(`${picked.email}:${picked.apiToken}`)}`,
            Accept: "application/json"
          }
        });
        return json({ appId, request: { url, method: "GET" }, response: r }, { status: r.ok ? 200 : 400 });
      }

      case "salesforce": {
        const picked = {
          instanceUrl: pick(values, "instanceUrl", "SALESFORCE_INSTANCE_URL"),
          accessToken: pick(values, "accessToken", "SALESFORCE_ACCESS_TOKEN")
        };
        required(picked, ["instanceUrl", "accessToken"]);
        const base = String(picked.instanceUrl).replace(/\/+$/, "");
        const url = `${base}/services/data/v58.0/`;
        const r = await fetchJson(url, {
          headers: {
            Authorization: `Bearer ${picked.accessToken}`,
            Accept: "application/json"
          }
        });
        return json({ appId, request: { url, method: "GET" }, response: r }, { status: r.ok ? 200 : 400 });
      }

      case "generic_http": {
        required(values, ["url"]);
        const method = (values.method ? String(values.method) : "GET").toUpperCase();

        const headers = {};
        if (values.authHeader && String(values.authHeader).trim() !== "") headers.Authorization = String(values.authHeader).trim();

        let body;
        if (method !== "GET" && method !== "HEAD" && extraBody && typeof extraBody === "object") {
          headers["Content-Type"] = "application/json";
          body = JSON.stringify(extraBody);
        }

        const r = await fetchJson(String(values.url), { method, headers, body });
        return json(
          { appId, request: { url: String(values.url), method, headers: Object.keys(headers).length ? headers : undefined }, response: r },
          { status: r.ok ? 200 : 400 }
        );
      }

      case "mailchimp": {
        const picked = {
          apiKey: pick(values, "apiKey", "MAILCHIMP_API_KEY"),
          serverPrefix: pick(values, "serverPrefix", "MAILCHIMP_SERVER_PREFIX")
        };
        required(picked, ["apiKey", "serverPrefix"]);
        const url = `https://${picked.serverPrefix}.api.mailchimp.com/3.0/ping`;
        const r = await fetchJson(url, {
          headers: {
            Authorization: `Basic ${b64(`anystring:${picked.apiKey}`)}`
          }
        });
        return json({ appId, request: { url, method: "GET" }, response: r }, { status: r.ok ? 200 : 400 });
      }

      case "airtable": {
        const picked = { apiKey: pick(values, "apiKey", "AIRTABLE_API_KEY") };
        required(picked, ["apiKey"]);
        const url = "https://api.airtable.com/v0/meta/whoami";
        const r = await fetchJson(url, {
          headers: {
            Authorization: `Bearer ${picked.apiKey}`
          }
        });
        return json({ appId, request: { url, method: "GET" }, response: r }, { status: r.ok ? 200 : 400 });
      }

      case "jotform": {
        const picked = { apiKey: pick(values, "apiKey", "JOTFORM_API_KEY") };
        required(picked, ["apiKey"]);
        const url = `https://api.jotform.com/user?apiKey=${encodeURIComponent(picked.apiKey)}`;
        const r = await fetchJson(url);
        return json({ appId, request: { url, method: "GET" }, response: r }, { status: r.ok ? 200 : 400 });
      }

      case "ticketbud": {
        const picked = { apiKey: pick(values, "apiKey", "TICKETBUD_API_KEY") };
        required(picked, ["apiKey"]);
        const url = "https://api.ticketbud.com/v1/";
        const r = await fetchJson(url, {
          headers: {
            Authorization: `Bearer ${picked.apiKey}`
          }
        });
        return json({ appId, request: { url, method: "GET" }, response: r }, { status: r.ok ? 200 : 400 });
      }

      case "digisign": {
        const picked = {
          apiKey: pick(values, "apiKey", "DIGISIGN_API_KEY"),
          baseUrl: pick(values, "baseUrl", "DIGISIGN_BASE_URL")
        };
        required(picked, ["apiKey"]);

        if (!picked.baseUrl) {
          return json(
            {
              appId,
              error: "Missing fields: baseUrl",
              help: "Set DIGISIGN_BASE_URL in .env.local (example: https://api.vendor.com) or enter Base URL manually for this preset. DigiSign APIs differ by provider."
            },
            { status: 400 }
          );
        }

        const base = String(picked.baseUrl).replace(/\/+$/, "");
        const url = `${base}/`;

        const r = await fetchJson(url, {
          headers: {
            Authorization: `Bearer ${picked.apiKey}`
          }
        });

        return json(
          {
            appId,
            request: { url, method: "GET", headers: { Authorization: "Bearer <redacted>" } },
            response: r
          },
          { status: r.ok ? 200 : 400 }
        );
      }

      default:
        return json(
          {
            error: `Unknown appId: ${appId}`,
            supportedAppIds: [
              "github",
              "slack",
              "stripe",
              "google",
              "microsoft_graph",
              "atlassian_jira",
              "atlassian_confluence",
              "salesforce",
              "generic_http",
              "mailchimp",
              "airtable",
              "jotform",
              "ticketbud",
              "digisign",
              "eventbrite"
            ]
          },
          { status: 400 }
        );
    }
  } catch (e) {
    const status = e?.status && Number.isInteger(e.status) ? e.status : 500;
    return json({ error: e?.message || "Unknown error" }, { status });
  }
}
