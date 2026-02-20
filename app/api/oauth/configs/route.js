import { NextResponse } from "next/server";
import { upsertConfig, getStoredConfig, listStoredConfigs, deleteStoredConfig } from "../db.js";

export const runtime = "nodejs";

/** GET /api/oauth/configs                              → list all (no secrets)
 *  GET /api/oauth/configs?provider=github             → get one (masked secret)
 *  GET /api/oauth/configs?provider=github&reveal=true → get one WITH raw secret */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider");
  const reveal   = searchParams.get("reveal") === "true";

  if (provider) {
    const config = await getStoredConfig(provider);
    if (!config) return NextResponse.json({ config: null });

    return NextResponse.json({
      config: {
        clientId:          config.clientId,
        clientSecret:      reveal ? (config.clientSecret || "") : "",
        clientSecretSaved: Boolean(config.clientSecret),
        scopes:            config.scopes,
      }
    });
  }

  const rows = await listStoredConfigs();
  return NextResponse.json({
    configs: rows.map(r => ({
      provider:   r.provider,
      clientId:   r.client_id,
      scopes:     r.scopes,
    }))
  });
}

/** POST /api/oauth/configs
 *  Body: { provider, clientId, clientSecret, redirectUri, scopes }
 *  Upserts — only updates fields that are non-empty. */
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { provider, clientId, clientSecret, scopes } = body;

  if (!provider) {
    return NextResponse.json({ error: "Missing provider" }, { status: 400 });
  }

  await upsertConfig(provider, {
    clientId:     clientId     || undefined,
    clientSecret: clientSecret || undefined,
    scopes:       scopes       || undefined,
  });

  return NextResponse.json({ ok: true, provider });
}

/** DELETE /api/oauth/configs
 *  Body: { provider } */
export async function DELETE(req) {
  const { provider } = await req.json().catch(() => ({}));
  if (!provider) return NextResponse.json({ error: "Missing provider" }, { status: 400 });
  await deleteStoredConfig(provider);
  return NextResponse.json({ ok: true, deleted: provider });
}
