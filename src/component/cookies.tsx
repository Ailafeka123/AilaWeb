"use client";
import { useCookieConsent } from "@/lib/cookiesCheckContext";
import Style from '@/style/cookies.module.scss';
export default function Cookies(){
    const {consent, setConsent} = useCookieConsent();
    return (
    <div　className={` ${Style.Cookies} ${consent === true ? Style.hidden : ""}`}>
        <p>是否同意使用Cookies以便使用登入系統</p>
        <button onClick={()=>{setConsent(true)}}>我同意</button>
    </div>
    )
}