"use client"

import { useState,useEffect,useContext,createContext } from "react";

type cookiesCheckProps={
    consent:boolean,
    setConsent:(value : boolean) => void,    
}

const CookieConsentContext = createContext<cookiesCheckProps>({
    consent: false,
    setConsent: () => {},

})

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    // 頁面載入時讀取 localStorage
    const stored = localStorage.getItem("cookieConsent");
    if (stored === "true") {
      setConsent(true);
    }
  }, []);

  const updateConsent = (value: boolean) => {
    setConsent(value);
    localStorage.setItem("cookieConsent", value ? "true" : "false");
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
