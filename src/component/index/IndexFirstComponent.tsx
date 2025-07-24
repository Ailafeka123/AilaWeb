"use client";

import { useState, useEffect, useRef } from "react";
import Style from '@/style/IndexFirst.module.scss'


export default function IndexFirstComponent(){
    // 抓取第一個物件
      const firstRef = useRef<HTMLDivElement | null>(null);
      // 簡單介紹文字 ref = [下一個字串,倒數三秒,減少 = true 增長 = false]
      const selfTextRef = useRef< [string,number,boolean] >(["歡迎來到我的部落格", 0, false]);
      const [firstSelfText,setFirstSelfText] = useState<string>("歡迎來到我的部落格");
      // 是否可見第一個視窗
      const [isVisible, setIsVisible] = useState(false);


  useEffect(()=>{
    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting){
          setIsVisible(entry.isIntersecting);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null, // 預設為 viewport
        threshold: 0.1, // 進入 10% 畫面就算看到
      }
    );
    if (firstRef.current) {
      observer.observe(firstRef.current);
    }

    return () => {
      if (firstRef.current) {
        observer.unobserve(firstRef.current);
      }
    };
  },[])
  
  useEffect(()=>{
    if(isVisible === true){
      setFirstSelfText("歡迎來到我的部落格");
      const textChange = setInterval(()=>{
        setFirstSelfText(index=>{
          let newString : string = "";
          // 刪減 false
          if(selfTextRef.current[2]){
            if(index !== ""){
              newString = index.slice(0,index.length - 1);
            }else{
              if(selfTextRef.current[1] <= 5){
                selfTextRef.current[1]++;
              }else{
                selfTextRef.current[1] = 0;
                selfTextRef.current[2] = false;
              }
            }
          // 增加 true
          }else{
            if(index !== selfTextRef.current[0]){
              newString = selfTextRef.current[0].slice(0,index.length+1);
            }else{
              newString = index;
              if(selfTextRef.current[1] <= 20){
                selfTextRef.current[1]++;
              }else{
                selfTextRef.current[0] = (selfTextRef.current[0] === "歡迎來到我的部落格")? "目前正以前端工程師為目標邁進，興趣是創作東西" :"歡迎來到我的部落格";
                selfTextRef.current[1] = 0;
                selfTextRef.current[2] = true;
              }
            }
          }
          return newString;
        })
      },100);
      return()=>{
        clearInterval(textChange);
      }
    }
  },[isVisible]);



  return(
    <div id="firstIndex" ref={firstRef} className={`${Style.firstSee}` }>
      <div className={` ${Style.FirstIndexH1}  ${isVisible === true? Style.FirstIndexActive:""} `}>
        <h1>
          您好，我是劉星緯
        </h1>
        <p className={Style.firstSelfText}>{firstSelfText}</p>
      </div>
    </div>
  );
}