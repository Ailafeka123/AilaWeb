"use client"

import { useState,useEffect,useContext,createContext } from "react";
import LoginOut from "./loginOut";
// 建立context種類
type cookiesCheckProps={
    consent:boolean,
    setConsent:(value : boolean) => void,    
}

const CookieConsentContext = createContext<cookiesCheckProps>({
    consent: false,
    setConsent: (value : boolean) => {},

})

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    // 頁面載入時讀取 localStorage
    const deadTime = localStorage.getItem("cookieConsentDeadTime");
    // 檢查是否授權到期 有的話清除所有localStroage 並登出
    if(deadTime !== null &&  Date.now() > parseInt(deadTime)){
      localStorage.removeItem("cookieConsent");
      localStorage.removeItem("cookieConsentDeadTime");
    }else{
      const stored = localStorage.getItem("cookieConsent");
      if (stored === "true") {
        setConsent(true);
      }
    }
    
  }, []);
  // 同意的情況 建立cookies 保存 時間暫定為一小時
  const updateConsent = (value: boolean) => {
    setConsent(value);
    localStorage.setItem("cookieConsent", value ? "true" : "false");
    const newTime = Date.now();
    // 一天
    const AddTime = 1000*60*60*24;
    const DeadTime:number = newTime + AddTime;
    localStorage.setItem("cookieConsentDeadTime", DeadTime.toString());
  };

  return (
    <CookieConsentContext.Provider value={{ consent, setConsent: updateConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  return useContext(CookieConsentContext);
}
