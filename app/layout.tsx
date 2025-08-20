import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frontend App",
  description: "A Next.js app with Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}