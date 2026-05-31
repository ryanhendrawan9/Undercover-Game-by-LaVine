import "./globals.css";

export const metadata = {
  title: "Undercover by LaVine — The Secret Word Game",
  description:
    "Say less. Think fast. Lie better. One of you is clueless. One of you is dangerous.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased font-body">{children}</body>
    </html>
  );
}
