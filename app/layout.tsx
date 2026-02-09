import type { Metadata } from "next";
import { jbMonoRegular } from "./ui/fonts"
import "./globals.css";

export const metadata: Metadata = {
  title: "ClickHouse DAG Flow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jbMonoRegular.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
