"use client";
import Link from "next/link";
import { useState,useEffect,useRef } from "react";
import Style from '@/style/navbar.module.scss'
import Image from "next/image";
import { usePathname } from "next/navigation";
import Login from "./login";
// 導入第一個視窗的高度，預設500
type navbarProps = {
    hiddenHeight ?: number;
}
// 設定nav裡面的內容與連結
type navListItem = {
    title : string;
    href : string;
    children ?: navListItem[];
}

export default function Navbar({hiddenHeight = 500}:navbarProps){
    // 抓取Router位置
    const pathname = usePathname();
    // 是否有登入測試用
    const [userLogin,setUserLogin] = useState<Boolean>(false);

    // 針對手機板nav的開啟參數
    // 是否開啟nav
    const [navOpen,setNavOpen] = useState<Boolean>(false);
    // 開啟nav的防抖判定 true = 冷卻中
    const navBoolean = useRef<Boolean>(false);
    // nav動畫定時器設定
    const reSizeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    // 上一次畫面寬度
    const lastSizeWidth = useRef<number|null>(null);
    // 防止點擊關閉重複觸發
    const clickCloseNav = useRef<Boolean>(false);

    // 針對滾動的縮放參數
    // 上一次滾動停止位置 第二參數避免重複觸發確認
    const lastScrollMove = useRef<[number,Boolean]>( [0,false]);
    // 是否要隱藏navbar
    const [scrollMove , setScrollMove] = useState<Boolean>(false);
    // 隱藏navbar的定時器
    const scrollMoveTimeout = useRef<ReturnType<typeof setTimeout> | null> (null);

    // 針對副nav的開啟設定 首頁 作品集 文章 登入/個人資訊
    const [navListActive,setNavListActive] = useState<Boolean[]>([false,false,false,false])
    const navList = useRef<navListItem[]>([
        {title:"首頁", href:"/", children:[
            {title:"前言", href:"/#firstIndex"},
            {title:"個人介紹", href:"/#secIndex"},
            {title:"最新作品", href:"/#triIndex"},
            {title:"最新文章",href:"/"}
        ]},
        {title:"作品集", href:"/project"},
        {title:"文章",href:"/blogdata"},
        {title:"個人資訊",href:"/selfdata"}
    ]);

    // 針對點擊外部時時確認
    const headerDiv = useRef<HTMLDivElement|null>(null);

    // 監聽寬度變化 防抖設定
    const reSizeFunction = () =>{
        if(reSizeTimeout.current) clearTimeout(reSizeTimeout.current);
        reSizeTimeout.current = setTimeout(()=>{
            // 新的寬度為電腦寬 且 舊的是手機寬 則關閉nav開啟
            if(window.innerWidth > 768){
                if(lastSizeWidth.current !== null && lastSizeWidth.current < 768){
                    setNavOpen(false);
                    navBoolean.current = true;
                    // 把副選單也全都關閉
                    let navArray = Array(navList.current.length).fill(false);
                    setNavListActive(navArray);
                    setTimeout(() => {
                        navBoolean.current = false;
                    }, 300);
                }
            }
            // 更新寬度 用於下次確認
            lastSizeWidth.current = window.innerWidth;
        },100);
    }
    // nav滾動收回功能
    const scrollCloseNav = () =>{
        // 如果準備判斷 則重製時間
        if(scrollMoveTimeout.current) clearTimeout(scrollMoveTimeout.current);
        // 如果位於最上面空間
        if(scrollY < hiddenHeight ){
            if(lastScrollMove.current[1] === true){
                lastScrollMove.current[1] = false;
                setScrollMove(false);
            }
            // 同樣的防抖設定，確保在最上面也會刷新上一次的滾動高度
            scrollMoveTimeout.current = setTimeout(()=>{
                lastScrollMove.current[0] = scrollY;
            },100)
        }else{
            scrollMoveTimeout.current = setTimeout(()=>{
                if( (scrollY - lastScrollMove.current[0]) > 0){
                    lastScrollMove.current[1] = true;
                    setScrollMove(true);
                }else{
                    lastScrollMove.current[1] = false;
                    setScrollMove(false);
                }
                lastScrollMove.current[0] = scrollY;
            },100)
        }
    }
    // 點擊非header的情況 關閉nav
    const clickOutside = (e :PointerEvent) =>{
        if(headerDiv.current && e.target instanceof Node && !headerDiv.current.contains(e.target)  && clickCloseNav.current === true){
            if(navBoolean.current === false){
                navBoolean.current = true;
                setNavOpen(false);
                let navArray = Array(navList.current.length).fill(false);
                setNavListActive(navArray);
                setTimeout(() => {
                    navBoolean.current = false;
                }, 300);
            }
        }
    }
    // 初始化設定 抓取寬度 開啟對於寬度與滾動的監聽事件
    useEffect(()=>{
        // 更新初始寬度
        lastSizeWidth.current = window.innerWidth;
        // 監聽寬度變化，確認是否要關閉nav
        window.addEventListener("resize",reSizeFunction);
        // navBar收回功能 在第一個視窗內的話 強制顯示 如果是超出之下，則下滑時收回 上滑時顯示
        window.addEventListener("scroll",scrollCloseNav);
        // 監聽點擊 點擊非nav的情況  關閉選單
        document.addEventListener("pointerdown",clickOutside);
        
        // 確保符合nav長度 避免後續忘記修正
        let navArray = Array(navList.current.length).fill(false);
        setNavListActive(navArray);
        return () =>{
            window.removeEventListener("resize",reSizeFunction);
            window.removeEventListener("scroll",scrollCloseNav);
            document.removeEventListener("pointerdown",clickOutside);
        }
    },[])
    // 排除第一次渲染 當點擊的時候會進行選單的開關
    useEffect(()=>{
        if(navBoolean.current === true){
            const nav = document.getElementById("HeaderNav");
            const navButtonIcon = document.getElementById("menuButtonIcon");
            if(navOpen === true){
                nav?.classList.add(Style.navOpen);
                navButtonIcon?.classList.add(Style.navIconOpen);
                clickCloseNav.current = true;
                setTimeout(()=>{
                    navBoolean.current = false;
                },300)
            }else{
                nav?.classList.remove(Style.navOpen);
                navButtonIcon?.classList.remove(Style.navIconOpen);
                clickCloseNav.current = false;
                setTimeout(()=>{
                    navBoolean.current = false;
                },300)
            }
        }
    },[navOpen])
    
    // 進行轉跳的部分 待修正 最終效果希望達到同頁進行smooth轉跳
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

    // 顯示navListShow的部分 
    const NavListShow = () =>{
        let temp : HTMLElement[] = [];
        return(
            <ul>
                {navList.current.map( (index,key) => (
                    <li key={key} className={navListActive[key] === true? Style.childrenActive:""} onClick={(e)=>{
                        if(window.innerWidth < 768 && index.children){
                            setNavListActive(oddNavList =>{
                                let newOddNavList = [...oddNavList];
                                newOddNavList[key] = !newOddNavList[key];
                                return newOddNavList;
                            })
                        }
                    }}>
                        <Link href={index.href}>{index.title}</Link> 
                        {index.children? <ul className={`${Style.childUl} ${navListActive[key] === true ?  " ": Style.childHidden}`}>
                            {index.children.map((childIndex,childKey)=>(
                                <li key={childKey} className={Style.ChildItem} onClick={(e)=>{
                                    if(navBoolean.current === false){
                                        setNavOpen(!navOpen);
                                        navBoolean.current = true;
                                        let navArray = Array(navList.current.length).fill(false);
                                        setNavListActive(navArray);
                                    }
                                }}><Link href={childIndex.href}>{childIndex.title}</Link></li>
                            ))}
                        </ul> :null}
                    </li>
            
                ))}
            </ul>
        )
    }


    return (
        <>
            <header ref={headerDiv} id="header" className={`${Style.header} ${scrollMove === true? Style.headerHidden:""} ` }>
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
                    <NavListShow/>
                </nav>
            </header>
            {/* <Login/> */}
        </>
        
    );

}