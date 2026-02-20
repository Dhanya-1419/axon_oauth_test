import { NextResponse } from "next/server";
import { listLogs, clearLogs } from "../db.js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const logs = await listLogs(50);
    return NextResponse.json({ logs });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearLogs();
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
