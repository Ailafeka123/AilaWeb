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
type childListItem = {
    title:string,
    hash:string,
}
// 設定nav裡面的內容與連結
type navListItem = {
    title : string;
    href : string;
    children ?: childListItem[];
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
    // 防止點擊關閉重複觸發 由於監聽 不用的話會抓不到navOpen
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
            {title:"前言", hash:"firstIndex"},
            {title:"個人介紹", hash:"secIndex"},
            {title:"最新作品", hash:"triIndex"},
            {title:"最新文章",hash:""}
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

    // 開關nav功能
    const navButtonFunction = (click:boolean) =>{
        if(navBoolean.current === false && clickCloseNav.current !== click){
            setNavOpen(click);
            navBoolean.current = true;
            let navArray = Array(navList.current.length).fill(false);
            setNavListActive(navArray);
        }
    }
    // 點擊非header的情況 關閉nav
    const clickOutside = (e :PointerEvent) =>{
        // 前兩者避免null 後面兩個條件 點擊外面 = false , clickCloseNav true = 開啟中
        if(headerDiv.current && e.target instanceof Node && !headerDiv.current.contains(e.target)  && clickCloseNav.current === true){
            navButtonFunction(false);
        }
    }
    // 如果是同一頁 則滑動 如果不是則轉跳至最頂
    const routerTo = (routerHref:string,hashString:string = "") =>{
        if(pathname === routerHref){
            if(hashString === ""){
                window.scrollTo({top:0,behavior:"smooth"})
            }else{
                const idPosition = document.getElementById(hashString);
                if(idPosition){
                    const willMoveY = idPosition.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top: willMoveY, behavior: "smooth" });
                }
            }
        }else{
            if(hashString === ""){
                router.push(routerHref);
                window.scrollTo({
                    top:0,
                    behavior:"smooth",
                });
            }else{
                router.push(`${routerHref}#${hashString}`);
            }
        }
        navButtonFunction(false);
    }

    // 初始化設定 抓取寬度 開啟對於寬度與滾動的監聽事件
    useEffect(()=>{
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
        }
    },[consent])

    // 排除第一次渲染 當點擊的時候會進行選單的開關
    useEffect(()=>{
        if(navBoolean.current === true){
            if(navOpen === true){
                clickCloseNav.current = true;
                setTimeout(()=>{
                    navBoolean.current = false;
                },300)
            }else{
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
            // 不予許cookies時 個人資訊跳過
            if(consent === false && index.title === "個人資訊"){
                continue;
            }

            if(index.children){
                let imgString : string = "";
                if(darkMode){
                    imgString =navListActive[key] === true ? "/arrow-down-dark.svg":"/arrow-up-dark.svg";
                }else{
                    imgString = navListActive[key] === true ? "/arrow-down-light.svg":"/arrow-up-light.svg";
                }

                index.children.forEach((childIndex,childKey)=>{
                    childTemp.push(<li key={`child-li-${childKey}`} ><span onClick={()=>{routerTo(index.href,childIndex.hash)}}>{childIndex.title}</span></li>)
                })
                temp.push(<li key={`index-li-${key}`}>
                    <span className={Style.childrenRouterSpan} onClick={()=>{routerTo(index.href,"")}} ></span>
                    <span className={Style.childrenTitleSpan} onClick={navListActive[key]=== true?()=>{setNavListActive(index=>{
                        const newArray : Boolean[] = new Array(index.length).fill(false);
                        return newArray;
                    })}
                    :()=>{setNavListActive(index=>{
                        const newArray : Boolean[] = new Array(index.length).fill(false);
                        newArray[key] = true;
                        return newArray;
                    })}}> {index.title} <img className={Style.imageArrow} src={imgString} alt={`click-img-${key}`} /></span>
                    <ul key={`child-ul-${key}`} className={`${Style.childUl} ${navListActive[key] === true?Style.openChild:null}`}>{childTemp}</ul>
                </li>)
            }else{
                if(index.title === "個人資訊"){
                    // 有登入則選是個人資訊與登出 沒登入則顯示登入
                    if(userLogin){
                        temp.push(<li key={`index-li-${key}`}><span onClick={()=>{routerTo(index.href,"");}}>{index.title}</span></li>)
                        temp.push(<li key={`index-li-loginOut`}><span onClick={()=>{LoginOut(); navButtonFunction(false);}}>登出</span></li>)
                    }else{
                        temp.push(<li key={`index-li-${key}`}><span onClick={()=>{setLoginDiv(true);navButtonFunction(false);}}>登入</span></li>)
                    }
                }else{
                    temp.push(<li key={`index-li-${key}`}><span onClick={()=>{routerTo(index.href,"");}}>{index.title}</span></li>);
                }
            }
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
                    <span onClick={()=>{routerTo("/","");}} className={Style.iconImgSpan}>
                        <Image src={darkMode?"/selficon_light.svg":"/selficon.svg"} alt="icon" width={40} height={40} priority ></Image>
                    </span>
                    <button aria-label="closeMenuButton" onClick={navOpen?()=>navButtonFunction(false):()=>navButtonFunction(true)} className={`${Style.menuButton}`}>
                        <div id="menuButtonIcon" className={`${Style.menuButtonIcon} ${navOpen?Style.navIconOpen:null}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>  
                    </button>
                </div>

                <nav id="HeaderNav" className={`${Style.nav} ${navOpen?Style.navOpen:null}`}>
                    <NavListShow/>
                </nav>
            </header>
            {loginDiv &&< Login ref={loginRef}/>}
        </>
        
    );

}