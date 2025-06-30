"use client";
import Image from "next/image";
import Navbar from "@/component/navbar";
import Style from '@/style/index.module.scss';
import Footer from "@/component/footer";
import { useState,useEffect,useRef } from "react";
export default function Home() {
  // 第一個物件的高度 預設500
  const IndexFirstHeight = useRef<number>(500)
  // 抓取第一個物件 抓取第一個物件
  const targetRef = useRef<HTMLDivElement | null>(null);
  // 測試是否可見
  const [isVisible, setIsVisible] = useState(false);

  
  useEffect(()=>{
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // 預設為 viewport
        threshold: 0.1, // 進入 10% 畫面就算看到
      }
    );
    if (targetRef.current) {
      observer.observe(targetRef.current);
    }
    const FirstIndex = document.getElementById("FirstIndex");
    if(FirstIndex?.offsetHeight){
      IndexFirstHeight.current = FirstIndex?.offsetHeight;
    }
    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  },[])
  // 測試是否可見 目前成功
  useEffect(()=>{
    console.log(isVisible)
  },[isVisible]);

  return (
    <div>
      <Navbar hiddenHeight={IndexFirstHeight.current}/>
      <main className={`${Style.main}`}>
          <div id="FirstIndex" ref={targetRef} className={`${Style.firstSee}` }>
            <h1>歡迎來到小小部落格</h1>

          </div>
          <div id="secIndex" className={Style.secIndex}>

          </div>
          <div id="triIndex" className={Style.triIndex}>

          </div>
      </main>
      <Footer/>
    </div>
  );
}
