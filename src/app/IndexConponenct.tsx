"use client";

import Style from '@/style/index.module.scss';
import { useState,useEffect,useRef } from "react";

export default function IndexComponent(){
// 抓取第一個物件 抓取第一個物件
  const targetRef = useRef<HTMLDivElement | null>(null);
  // 測試是否可見
  const [isVisible, setIsVisible] = useState(false);
  useEffect(()=>{
    //抓取是否進入視窗 觸發之後關閉
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        observer.unobserve(entry.target);
      },
      {
        root: null, // 預設為 viewport
        threshold: 0.1, // 進入 10% 畫面就算看到
      }
    );
    if (targetRef.current) {
      observer.observe(targetRef.current);
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
      <main className={`${Style.main}`}>
          <div id="FirstIndex" ref={targetRef} className={`${Style.firstSee}` }>

            <div className={` ${Style.FirstIndexH1}  ${isVisible === true? Style.FirstIndexActive:""} `}>
              <h1>
                <span>您好，我是劉星緯</span><br/>
                <span>歡迎來到我的網站，這裡會分享一些我的作品與心得記錄</span>
              </h1>
            </div>
                <p></p>
            <div>
              <h2></h2>
            </div>

          </div>
      </main>
  );
}