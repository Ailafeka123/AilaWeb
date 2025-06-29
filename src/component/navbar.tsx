"use client";
import Link from "next/link";
import { useState,useEffect,useRef } from "react";
import Style from '@/style/navbar.module.scss'
import Image from "next/image";

type navbarProps = {
    hiddenHeight ?: number;
}

export default function Navbar({hiddenHeight = 500}:navbarProps){
    // 是否開啟nav
    const [navOpen,setNavOpen] = useState<Boolean>(false);
    // 開啟nav的防抖判定
    const navBoolean = useRef<Boolean>(false);
    // nav動畫定時器設定
    const reSizeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    // 上一次停止
    const lastHeight = useRef<number>(0);
    // 是否要隱藏navbar
    const [scrollMove , setScrollMove] = useState<Boolean>(false);
    // 隱藏navbar的定時器
    const scrollMoveTimeout = useRef<ReturnType<typeof setTimeout> | null> (null);
    // 監聽寬度變化
    const reSizeFunction = () =>{
        if(reSizeTimeout.current) clearTimeout(reSizeTimeout.current);
        reSizeTimeout.current = setTimeout(()=>{
            if(window.innerWidth > 768 && navOpen === true){
                setNavOpen(false);
                navBoolean.current = true;
            }
        },100);
    }
    window.addEventListener("resize",reSizeFunction);
    

    // navBar收回功能
    window.addEventListener("scroll",()=>{
        if(scrollMoveTimeout.current) clearTimeout(scrollMoveTimeout.current);
        if(scrollY < hiddenHeight){
            setScrollMove(false)
        }else{
            scrollMoveTimeout.current = setTimeout(()=>{
                if( (scrollY - lastHeight.current) > 0){
                    setScrollMove(true);
                }else{
                    setScrollMove(false);
                }
                lastHeight.current = scrollY;
            },100)
        }
        
        
    })




    // 排除第一次渲染 當點擊的時候會進行選單的開關
    useEffect(()=>{
        if(navBoolean.current === true){
            const nav = document.getElementById("HeaderNav");
            const navButtonIcon = document.getElementById("menuButtonIcon");
            if(navOpen === true){
                nav?.classList.add(Style.navOpen);
                navButtonIcon?.classList.add(Style.navIconOpen);
                setTimeout(()=>{
                    navBoolean.current = false;
                },300)
            }else{
                nav?.classList.remove(Style.navOpen);
                navButtonIcon?.classList.remove(Style.navIconOpen);
                setTimeout(()=>{
                    navBoolean.current = false;
                },300)
            }
        }
    },[navOpen])
    


    return (
        <header id="header" className={`${Style.header} ${scrollMove === true? Style.headerHidden:""} ` }>
            <div className={`${Style.menu}`}>
                <Link href={`/`}>
                    <Image src="/selficon.svg" alt="icon" width={40} height={40} priority ></Image>
                </Link>
                <button onClick={(e)=>{
                    if(navBoolean.current === false){
                        setNavOpen(!navOpen);
                        navBoolean.current = true;
                    }
                }} className={`${Style.menuButton}`}>
                    <div id="menuButtonIcon" className={`${Style.menuButtonIcon}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>  
                </button>
            </div>

            <nav id="HeaderNav" className={`${Style.nav}`}>
                <ul>
                    <Link href={`/`}><li>首頁</li></Link>
                </ul>
            </nav>
        </header>
    );

}