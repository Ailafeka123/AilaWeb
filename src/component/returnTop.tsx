"use client";
import Style from "@/style/returnTop.module.scss"
import Image from "next/image";
export default function ReturnTop () {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // 平滑滾動
        });
    };
    return (
        <button className={Style.scrollTop} onClick={()=>{
            scrollToTop();
        }}>
            <Image src="/ArrowTop.svg" width={40} height={40} alt="arrowTop"></Image>
        </button>
    );
}