import "./globals.css";

export const metadata = {
  title: "Integration Tester",
  description: "Test third-party app credentials via server-side checks"
};

// Debug: log a few env vars on every request
export default function RootLayout({ children }) {
  console.log("LAYOUT DEBUG env sample", {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "SET" : "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  });
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
