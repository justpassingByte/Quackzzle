import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Quackzzle | Chào mừng 30/4 - Ngày Giải Phóng",
  description: "Trò chơi đố vui hấp dẫn chào mừng ngày giải phóng miền Nam",
  keywords: ["game", "quiz", "đố vui", "giải trí", "30/4", "giải phóng", "Việt Nam"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="fixed inset-0 -z-10 bg-white dark:bg-gray-900"></div>
        <div className="fixed inset-0 -z-10 soft-pattern opacity-70"></div>
        <div className="fixed top-0 left-0 -z-5 w-full h-2 liberation-gradient"></div>
        <div className="fixed bottom-0 left-0 -z-5 w-full h-2 liberation-gradient"></div>
        <main className="relative z-0">{children}</main>
      </body>
    </html>
  );
}
