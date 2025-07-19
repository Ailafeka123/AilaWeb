"use client";

import Style from '@/style/index.module.scss';
import { useState,useEffect,useRef } from "react";
import { text } from 'stream/consumers';

export default function IndexComponent(){
  // 抓取第一個物件
  const firstRef = useRef<HTMLDivElement | null>(null);
  // 簡單介紹文字 ref = [下一個字串,倒數三秒,減少 = true 增長 = false]
  const selfTextRef = useRef< [string,number,boolean] >(["歡迎來到我的部落格", 0, false]);
  const [firstSelfText,setFirstSelfText] = useState<string>("歡迎來到我的部落格");
  // 測試是否可見
  const [isVisible, setIsVisible] = useState(false);
  useEffect(()=>{
    //抓取是否進入視窗 觸發之後關閉
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
  // 第一個視窗可見時，觸發動畫。
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

  return (
      <main className={`${Style.main}`}>
          <div id="firstIndex" ref={firstRef} className={`${Style.firstSee}` }>
            <div className={` ${Style.FirstIndexH1}  ${isVisible === true? Style.FirstIndexActive:""} `}>
              <h1>
                您好，我是劉星緯
              </h1>
              <p className={Style.firstSelfText}>{firstSelfText}</p>
            </div>
          </div>

          <div id="secIndex" className={Style.aboutDiv}>
              <h2>個人介紹</h2>
              <div className={Style.aboutMeDiv}>
                <img className={Style.headImg} src="/index/self.jpg"></img>
              </div>
          </div>
          <div id="triIndex" className=''>

          </div>
      </main>
  );
}