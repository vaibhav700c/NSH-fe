// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Immersive UI Container",
  description: "A Next.js app with an immersive UI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="container">{children}</div>
      </body>
    </html>
  );
}