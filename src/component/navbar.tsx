"use client";
import Link from "next/link";
import { useState,useEffect,useRef } from "react";
import Style from '@/style/navbar.module.scss'
import Image from "next/image";
import { usePathname } from "next/navigation";


type navbarProps = {
    hiddenHeight ?: number;
}

export default function Navbar({hiddenHeight = 500}:navbarProps){
    // 抓取Router位置
    const pathname = usePathname();
    // 是否開啟nav
    const [navOpen,setNavOpen] = useState<Boolean>(false);
    // 開啟nav的防抖判定
    const navBoolean = useRef<Boolean>(false);
    // nav動畫定時器設定
    const reSizeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    // 上一次畫面寬度
    const lastSizeWidth = useRef<number|null>(null); 
    // 上一次滾動停止
    const lastHeight = useRef<number>(0);
    // 是否要隱藏navbar
    const [scrollMove , setScrollMove] = useState<Boolean>(false);
    // 隱藏navbar的定時器
    const scrollMoveTimeout = useRef<ReturnType<typeof setTimeout> | null> (null);
    // 監聽寬度變化 防抖設定
    const reSizeFunction = () =>{
        if(reSizeTimeout.current) clearTimeout(reSizeTimeout.current);
        reSizeTimeout.current = setTimeout(()=>{
            // 新的寬度為電腦寬 且 舊的是手機寬 則關閉nav開啟
            if(window.innerWidth > 768){
                if(lastSizeWidth.current !== null && lastSizeWidth.current < 768){
                    setNavOpen(false);
                    navBoolean.current = true;
                    setTimeout(() => {
                        navBoolean.current = false;
                    }, 300);
                }
            }
            // 更新寬度 用於下次確認
            lastSizeWidth.current = window.innerWidth;
        },100);
    }
    // 初始化設定
    useEffect(()=>{
        // 更新初始寬度
        lastSizeWidth.current = window.innerWidth;
        // 監聽寬度變化，確認是否要關閉nav
        window.addEventListener("resize",reSizeFunction);
        // navBar收回功能 在第一個視窗內的話 強制顯示 如果是超出之下，則下滑時收回 上滑時顯示
        window.addEventListener("scroll",()=>{
            if(scrollMoveTimeout.current) clearTimeout(scrollMoveTimeout.current);
            if(scrollY < hiddenHeight ){
                setScrollMove(false);
                // 同樣的防抖設定，確保在最上面也會刷新上一次的滾動高度
                scrollMoveTimeout.current = setTimeout(()=>{
                    lastHeight.current = scrollY;
                },100)
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
    },[])
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
    
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hash = window.location.hash?.substring(1);
        if (!hash) return;

        // 等待 DOM 內容渲染完再滾動
        setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }, [pathname]);

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
                <ul onClick={(e)=>{
                    setNavOpen(!navOpen);
                    navBoolean.current = true;
                }}>
                    <li><Link href={`/`}>首頁</Link>
                        <ul>
                            <li><Link href={`/#firstIndex`}>第一個</Link></li>
                            <li><Link href={`/#secIndex`}>第二個</Link></li>
                            <li><Link href={`/#triIndex`}>第三個</Link></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    );

}