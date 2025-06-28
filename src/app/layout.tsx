import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aila-Web",
  description: "一個努力邁進前端工程師的人",
  keywords:["劉星緯","Aila","個人作品","前端","前端工程師","React","NEXT"],
  icons:{
    icon:[
      {url:`/selficon.svg`, type:`image/svg+xml`},
    ],
  },
  authors:[{name:"劉星緯"}],
  openGraph:{
    title:"Aila-Web",
    description:"一個努力邁進前端工程師的人",
    type:"website",
  },
};
export const viewport : Viewport = {
  width:"device-width",
  initialScale:1,
};

export default function RootLayout( {children}: Readonly<{children: React.ReactNode;}> ) {
  return (
    <html lang="zh-Hant">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
