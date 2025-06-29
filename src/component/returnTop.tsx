"use client";
import Style from "@/style/returnTop.module.scss"

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
            Top
        </button>
    );
}