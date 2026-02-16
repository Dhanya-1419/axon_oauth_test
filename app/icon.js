export const runtime = "nodejs";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/svg+xml";

export default function Icon() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#6ea8ff"/>
      <stop offset="1" stop-color="#43d19e"/>
    </linearGradient>
  </defs>
  <rect x="6" y="6" width="52" height="52" rx="14" fill="url(#g)"/>
  <text x="32" y="39" text-anchor="middle" font-size="22" font-family="ui-sans-serif, system-ui" font-weight="800" fill="#0b1220">IT</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
