import "./globals.css";
import type { Metadata } from "next";
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "RestroWorks - Restaurant Management System",
  description: "A comprehensive restaurant management system with modern features and intuitive design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}