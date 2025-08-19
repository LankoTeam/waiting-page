import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { ThemeScript } from "@/components/ui/theme-script";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LANKO - 即将上线",
  description: "LANKO项目即将上线，加入我们的Waiting List获取最新消息",
  icons: {
    icon: '/lanko-main-logo-320x320.ico',
    shortcut: '/lanko-main-logo-320x320.ico',
    apple: '/lanko-main-logo-320x320.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,600;1,600&display=swap" rel="stylesheet" />
        <script 
          src="https://ca.turing.captcha.qcloud.com/TJNCaptcha-global.js" 
          async
        ></script>
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeScript />
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
