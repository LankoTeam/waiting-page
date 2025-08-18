import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LANKO蓝扣 - 即将上线",
  description: "LANKO蓝扣项目即将上线，加入我们的Waiting List获取最新消息",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script 
          src="https://ca.turing.captcha.qcloud.com/TJNCaptcha-global.js" 
          async
        ></script>
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
