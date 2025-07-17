"use client";
import Link from "next/link";
import { useState,useEffect,useRef,ReactElement } from "react";
import Style from '@/style/navbar.module.scss'
import Image from "next/image";
import { useRouter,usePathname } from "next/navigation";

import Login from "./login";
import LoginOut from "@/lib/loginOut";

import { Auth } from "@/lib/firebaseAuth";
import { onAuthStateChanged} from "firebase/auth";
import databaseGet from "@/lib/databaseGet";
import databaseSet from "@/lib/databaseSet";

import { useCookieConsent } from "@/lib/cookiesCheckContext";
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
    // 轉跳
    const router = useRouter();
    // 是否有登入測試用
    const [userLogin,setUserLogin] = useState<Boolean>(false);
    // 開啟登入視窗
    const [loginDiv,setLoginDiv] = useState<Boolean>(false);
    // 監聽登入窗
    const loginRef = useRef<HTMLDivElement|null>(null)

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

    // 針對點擊選單外部時時確認
    const headerDiv = useRef<HTMLDivElement|null>(null);

    // 是否使用Cookies
    const {consent, setConsent} = useCookieConsent();

    // 是否為暗色模式
    const [darkMode,setDarkMode] = useState(false);



    // 關閉nav功能
    const closeNav = () =>{
        // 關閉所有複選單
        const newArray = Array(navList.current.length).fill(false);
        setNavListActive(newArray);
        // 關閉主選單
        setNavOpen(false);
        navBoolean.current =true;
        setTimeout(()=>{
            navBoolean.current = false;
        },300)
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
        // 監聽寬度變化 防抖設定 由於vercal 回報window not defined 移入useEffect
        const reSizeFunction = () =>{
            if(reSizeTimeout.current) clearTimeout(reSizeTimeout.current);
            reSizeTimeout.current = setTimeout(()=>{
                // 新的寬度為電腦寬 且 舊的是手機寬 則關閉nav開啟
                if(window.innerWidth > 768){
                    if(lastSizeWidth.current !== null && lastSizeWidth.current < 768){
                        closeNav();
                    }
                }
                // 更新寬度 用於下次確認
                lastSizeWidth.current = window.innerWidth;
            },100);
        }
        // nav滾動收回功能 由於vercal 回報window not defined 移入useEffect   
        const scrollCloseNav = () =>{
            // 如果準備判斷 則重製時間
            if(scrollMoveTimeout.current) clearTimeout(scrollMoveTimeout.current);
            // 如果位於最上面空間
            if(window.scrollY < hiddenHeight ){
                if(lastScrollMove.current[1] === true){
                    lastScrollMove.current[1] = false;
                    setScrollMove(false);
                }
                // 同樣的防抖設定，確保在最上面也會刷新上一次的滾動高度
                scrollMoveTimeout.current = setTimeout(()=>{
                    lastScrollMove.current[0] = window.scrollY;
                },100)
            }else{
                scrollMoveTimeout.current = setTimeout(()=>{
                    if( (window.scrollY - lastScrollMove.current[0]) > 0){
                        lastScrollMove.current[1] = true;
                        setScrollMove(true);
                    }else{
                        lastScrollMove.current[1] = false;
                        setScrollMove(false);
                    }
                    lastScrollMove.current[0] = window.scrollY;
                },100)
            }
        }
        // 抓取是否為暗色模式 是的話就在body加上dark
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        if (media.matches) {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
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
        const unsub =  onAuthStateChanged(Auth,(user)=>{
            if(user){
                setUserLogin(true);
                setLoginDiv(false);
            }else{
                // 沒有登入情況 如果再地方進入 會跳回首頁 但目前來說 只要刷新 都會跳回首頁
                setUserLogin(false);
                router.push('/');
            }

        })
        return () =>{
            window.removeEventListener("resize",reSizeFunction);
            window.removeEventListener("scroll",scrollCloseNav);
            document.removeEventListener("pointerdown",clickOutside);
            unsub();
        }
    },[])
    // 暗色模式切換
    useEffect(()=>{
        if(darkMode){
            document.body.classList.add("dark");
        }else{
            document.body.classList.remove("dark");
        }
    },[darkMode])



    useEffect(()=>{
        if(consent === true){
            const user = Auth.currentUser;
            const unsub =  onAuthStateChanged(Auth,(user)=>{
                if(user){
                    setUserLogin(true);
                    setLoginDiv(false);
                    (async () =>{
                        // 讀取是否有創立帳號訊息
                        const data = await databaseGet("Auth",user.uid);
                        // 沒有話建立建立
                        if(data === null){
                            const dataInput = {
                                id:user.uid,
                                email:user.email || null,
                                level:"guest"
                            }
                            const result = await databaseSet("Auth",dataInput);
                        }
                    })();
                    
                }else{
                    setUserLogin(false);
                }

            })
            return ()=>{
                unsub();
            }
        }else{
            console.log("失去授權 如果有登入將進行登出")
            // const unsub  = onAuthStateChanged(Auth)

        }
    },[consent])

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
    
    // 顯示navListShow的部分 
    const NavListShow = () =>{
        let temp : ReactElement[] = [];
        
        for(const [key,index] of navList.current.entries()){
            let childTemp : ReactElement[] = [];
            let indexTemp : ReactElement[] = [];

            if(index.children){
                let imgSrc = navListActive[key] === true? "/arrow-down-light.svg":"/arrow-up-light.svg";
                indexTemp.push(<span key={`span-${key}`} onClick={(e)=>{
                    if(lastSizeWidth.current && lastSizeWidth.current < 768){
                        setNavListActive(List=>{
                        const newArray = Array(List.length).fill(false);
                        if(List[key] === false){
                            newArray[key] = true;
                        }
                        return newArray;
                    })
                    }
                }}>{index.title}<Image className={Style.imageArrow} src={imgSrc} alt="arrow-up" width={40} height={40}></Image></span>);

                index.children.forEach((childrenIndex, childrenKey )=>{
                    childTemp.push(<li key={`child-${key}-${childrenKey}`}><Link href={childrenIndex.href}>{childrenIndex.title}</Link></li>);
                })
            }else{
                if(index.title === "個人資訊"){
                    // 同意使用cookies才顯示登入
                    if(consent === false) continue;
                    if(userLogin === false){
                        indexTemp.push(<span key={`span-${key}`} onClick={(e)=>{
                            setLoginDiv(true); 
                            closeNav();
                        }}>登入</span>)
                    }else{
                        indexTemp.push(<Link key={`Link-${key}`} href={index.href}> {index.title} </Link>)
                    }
                    
                    
                }else{
                    indexTemp.push(<Link key={`Link-${key}`} href={index.href}> {index.title} </Link>)
                    
                }
            }

            temp.push(
                <li key={key}>
                    {indexTemp}
                    {childTemp.length !== 0?<ul className={`${Style.childUl} ${navListActive[key] === false? Style.childHidden:""}`}>{childTemp}</ul>:null}
                </li>);
        }
        if(userLogin === true && consent === true){
            temp.push(<li key={`li-loginOut`}><span key={`span-loginOut`} onClick={(e)=>{LoginOut()}}>登出</span></li>)
        }

        return(
            <ul>
                {temp}
            </ul>
        );
    }

    // 登入判斷 點擊登入外自動關閉
    useEffect(()=>{
        if (loginDiv && loginRef.current) {
            const handleClick = (e :PointerEvent) => {
                if(loginRef.current && e.target instanceof Node && !loginRef.current.contains(e.target)){
                    setLoginDiv(false);
                }
            };
            document.addEventListener('pointerdown', handleClick);

            // 清除監聽（當 loginDiv 變 false 或元件 unmount）
            return () => {
                document.removeEventListener('pointerdown', handleClick);
            };
        }
    },[loginDiv])

    // 回傳navbar內容
    return (
        <>
            <header ref={headerDiv} id="header" className={`${Style.header} ${scrollMove === true? Style.headerHidden:""} ` }>
                <div className={`${Style.menu}`}>
                    <Link href={`/`}>
                        <Image src={darkMode?"/selficon_light.svg":"/selficon.svg"} alt="icon" width={40} height={40} priority ></Image>
                    </Link>
                    <button onClick={(e)=>{
                        if(navBoolean.current === false){
                            setNavOpen(!navOpen);
                            navBoolean.current = true;
                            let navArray = Array(navList.current.length).fill(false);
                            setNavListActive(navArray);
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
            {loginDiv &&< Login ref={loginRef}/>}
        </>
        
    );

}