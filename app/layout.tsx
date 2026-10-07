import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aarambh | Education Companion",
  description: "A personal mathematics companion, teacher feedback desk, and curriculum workshop.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
