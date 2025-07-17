
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CookieConsentProvider } from "@/lib/cookiesCheckContext";
import Cookies from "@/component/cookies";
import Navbar from "@/component/navbar";
import Footer from "@/component/footer";
import ReturnTop from "@/component/returnTop";
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
  description: "作為個人部落格，平常分享一些平常學習到的知識與放置作品集，使用Next並部屬在github與vercel上。",
  keywords:["劉星緯","Aila","個人作品","前端","前端工程師","React","NEXT"],
  icons:{
    icon:[
      {url:`/selficon.svg`,media: "(prefers-color-scheme: light)", type:`image/svg+xml`},
      {url:`/selficon_light.svg`,media: "(prefers-color-scheme: dark)", type:`image/svg+xml`}
    ],
  },
  authors:[{name:"劉星緯"}],
  colorScheme:"light dark",
  creator:"劉星緯",

  openGraph:{
    title:"Aila-Web",
    description:"作為個人部落格，平常分享一些平常學習到的知識與放置作品集，使用Next並部屬在github與vercel上。",
    locale:"zh-TW",
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
        <CookieConsentProvider>
          <Navbar></Navbar>
          <Cookies/>
        </CookieConsentProvider>
        {children}
        <ReturnTop></ReturnTop>
        <Footer/> 
      </body>
    </html>
  );
}
