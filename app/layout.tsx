import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "kernel_fix_watch: know when the fixed kernel for your Ubuntu flavor hits -proposed or -updates",
  description:
    "Per Ubuntu release and kernel flavor, one row: fixed kernel in -proposed, in -updates, or not yet, read from Launchpad and the apt archive. Email or Slack when your flavor flips, and a second notice when you can remove the nftables stopgap.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
