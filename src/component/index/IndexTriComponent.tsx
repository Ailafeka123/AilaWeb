"use client";

import { useState,useEffect,useRef } from "react";
import { useRouter } from "next/navigation";
import Style from "@/style/IndexFir.module.scss"

import { databaseGetAll } from "@/lib/databaseGetAll";

type indexProps ={
    moduleType:"Project"|"Blog",
    idName:string
}

type dataType = {
  id:string,
  title:string,
  category:string[],
  editTime:string
}

export default function IndexTriComponent({moduleType,idName}:indexProps){
    // 轉跳
    const router = useRouter();
    // 抓取project前三個
    const [projectData,setProjectData] = useState<dataType[]>([]);
    // ref 指向projectCardDiv
    const projectRef = useRef<HTMLDivElement|null>(null);
    // 當前位置 與最大值
    const [projectCardMove,setProjectCardMove] = useState<[number,number]>([3,7]);
    // 移動動作
    const [projectCardActive,setProjectCardActive] = useState<boolean>(false);
    // 預計移動紀錄
    const projectCardDiv = useRef<number>(3);
    // 抓取ref的translateX位置
    const reftranslateX = useRef<number>(0);
    // 判斷是否點擊
    const ClickRef = useRef<boolean>(false);


    // 初始化 抓取資料
    useEffect(()=>{
        // 抓取作品前三
        const getProjectData = async() =>{
            const getData = await databaseGetAll(moduleType,"","editTime","desc",false,3);
            const data = getData.map((index:any)=>{
            return ({
                id:index.id,
                title:index.title,
                category:index.category,
                editTime:index.editTime,
            })
            })
            setProjectData(data);
        }
        getProjectData();
    },[])

    useEffect(()=>{
        let lestStyleString = `move-${projectCardMove[0]}`
        if(projectCardActive === false){
            if(!projectRef.current)return;
            // 點擊位置，移動位置
            let downX:number = 0;
            let moveX:number = 0;
            // move冷卻 避免太多
            let coldDown = false;
            // 使用requestAnimationFrame的id 用於down啟動 up關閉
            let animationId: number | null = null;
            const animationMove = () =>{
                if(!projectRef.current)return;
                projectRef.current.style.transform =`translateX(${reftranslateX.current - (downX - moveX)}px)`;
                // 循環啟動
                animationId = requestAnimationFrame(animationMove);
            }
            // 電腦按下功能
            const MouseDownFuc = (e:MouseEvent)=>{
                if(projectRef.current?.contains(e.target as Node)){
                    // 確認本次使用click，關閉touch
                    document.removeEventListener("touchstart",touchStartFuc);
                    // 抓取當下位置
                    let position:number = parseInt(getComputedStyle(projectRef.current).transform.split(",")[4]);
                    // 設定ref框架位置，從class設定改為手動設定
                    reftranslateX.current = position;
                    downX = e.clientX;
                    moveX = e.clientX;
                    projectRef.current.style.transform =`translateX(${position}px)`;
                    projectRef.current?.classList.remove(Style[lestStyleString]);
                    projectRef.current?.classList.add(Style.moving);
                    // 啟動move與up的監聽，以及使用requestAnimation去處發動畫
                    document.addEventListener("mousemove",MouseMoveFuc);
                    document.addEventListener("mouseup",MouseUpFuc);
                    animationId = requestAnimationFrame(animationMove);
                    // 移除點擊 避免再度觸發
                    document.removeEventListener("mousedown",MouseDownFuc);
                }
            }
            // 刷新位置 由requestAnimationFrame 去解決
            const MouseMoveFuc = (e:MouseEvent) =>{
                const moveToX = e.clientX;
                if(coldDown === false){
                    coldDown = true;
                    requestAnimationFrame(()=>{
                        moveX = moveToX;
                        coldDown = false;
                    })
                }
                
            }
            // 滑鼠放開時產生
            const MouseUpFuc = (e:MouseEvent) =>{
                // 移除移動與放開監聽
                document.removeEventListener("mousemove",MouseMoveFuc);
                document.removeEventListener("mouseup",MouseUpFuc);
                if(!projectRef.current)return;
                // 關閉requestAnimationFrame
                if(animationId !== null){
                    cancelAnimationFrame(animationId);
                }
                // 移動結尾 交回給calss控制 小於30判斷是單純點擊
                projectRef.current.style.transform =``;
                if(Math.abs(downX - moveX) <= 30 ){
                    // 回到原本節點 0.1s再開移動事件，因為基本的transition設定0.1s
                    projectRef.current.classList.add(Style[lestStyleString]);
                    ClickRef.current = true;
                    setTimeout(()=>{
                        projectRef.current?.classList.remove(Style.moving);
                        document.addEventListener("mousedown",MouseDownFuc);
                        document.addEventListener("touchstart",touchStartFuc);
                    },100)
                }else{
                    projectRef.current?.classList.remove(Style.moving);
                    projectRef.current?.classList.add(Style.classMoving);
                    if( (downX - moveX) < 0){
                        projectCardDiv.current--;
                    }else{
                        projectCardDiv.current++;
                    }
                    let StyleString = `move-${projectCardDiv.current}`;
                    projectRef.current?.classList.add(Style[StyleString]);
                    setTimeout(()=>{
                        setProjectCardActive(true);
                    },501)
                }
                
            }
            // 手機 同上 改成手機板
            const touchStartFuc = (e:TouchEvent)=>{
                if(projectRef.current?.contains(e.target as Node)){
                    // 確認本次使用touch 關閉click
                    document.removeEventListener("mousedown",MouseDownFuc);
                    // 抓取當下位置
                    let position:number = parseInt(getComputedStyle(projectRef.current).transform.split(",")[4]);
                    // 設定ref框架位置，從class設定改為手動設定
                    reftranslateX.current = position;
                    downX = e.touches[0].clientX;
                    moveX = e.touches[0].clientX;
                    projectRef.current.style.transform =`translateX(${position}px)`;
                    projectRef.current?.classList.remove(Style[lestStyleString]);
                    projectRef.current?.classList.add(Style.moving);
                    // 啟動move與up的監聽，以及使用requestAnimation去處發動畫
                    document.addEventListener("touchmove",touchMoveFuc);
                    document.addEventListener("touchend",touchEndFuc);
                    animationId = requestAnimationFrame(animationMove);
                    // 移除點擊 避免再度觸發
                    document.removeEventListener("touchstart",touchStartFuc);
                }
            }
            const touchMoveFuc = (e:TouchEvent)=>{
                const moveToX = e.touches[0].clientX;
                if(coldDown === false){
                    coldDown = true;
                    requestAnimationFrame(()=>{
                        moveX = moveToX;
                        coldDown = false;
                    })
                }
            }
            const touchEndFuc = (e:TouchEvent) =>{
                // 移除移動與放開監聽
                document.removeEventListener("touchmove",touchMoveFuc);
                document.removeEventListener("touchend",touchEndFuc);
                if(!projectRef.current)return;
                // 關閉requestAnimationFrame
                if(animationId !== null){
                    cancelAnimationFrame(animationId);
                }
                // 移動結尾 交回給calss控制 小於30判斷是單純點擊
                projectRef.current.style.transform =``;
                if(Math.abs(downX - moveX) <= 30 ){
                    // 回到原本節點 0.1s再開移動事件，因為基本的transition設定0.1s
                    projectRef.current.classList.add(Style[lestStyleString]);
                    ClickRef.current = true;
                    setTimeout(()=>{
                        projectRef.current?.classList.remove(Style.moving);
                        document.addEventListener("mousedown",MouseDownFuc);
                        document.addEventListener("touchstart",touchStartFuc);
                    },100)
                }else{
                    projectRef.current?.classList.remove(Style.moving);
                    projectRef.current?.classList.add(Style.classMoving);
                    if( (downX - moveX) < 0){
                        projectCardDiv.current--;
                    }else{
                        projectCardDiv.current++;
                    }
                    let StyleString = `move-${projectCardDiv.current}`;
                    projectRef.current?.classList.add(Style[StyleString]);
                    //會重製 所以就不再開啟事件
                    setTimeout(()=>{
                        setProjectCardActive(true);
                    },501)
                }
            }
            // 意外觸發cancel
            const touchCancelFuc = (e:TouchEvent)=>{
                // 避免出錯，直接刷新
                setProjectCardActive(true);
            }
            document.addEventListener("mousedown",MouseDownFuc);
            document.addEventListener("touchstart",touchStartFuc);
            document.addEventListener("touchcancel",touchCancelFuc)
            return()=>{
                document.removeEventListener("mousedown",MouseDownFuc);
                document.removeEventListener("mousemove",MouseMoveFuc);
                document.removeEventListener("mouseup",MouseUpFuc);

                document.removeEventListener("touchstart",touchStartFuc);
                document.removeEventListener("touchmove",touchMoveFuc);
                document.removeEventListener("touchend",touchEndFuc);
                document.removeEventListener("touchcancel",touchCancelFuc)
                if(animationId !== null){
                    cancelAnimationFrame(animationId);
                }
            };
        }
        if(projectCardDiv.current === projectCardMove[1]-1 ){
            projectCardDiv.current = 3
        }else if(projectCardDiv.current === 2){
            projectCardDiv.current = 5
        }
        setProjectCardMove((index)=>[projectCardDiv.current,index[1]]);
        setProjectCardActive(false);
    },[projectCardActive])

    const ProjectDataShow = () =>{
        let linkString:string = moduleType === "Project"? "project/projectShow":"blogdata/blogShow"
        let projectLen :number = projectData.length;
        let timeKey:number = 0;
        const proProjectDataList = projectData.map((index:any,key:number)=>{
            if(key+1 <= projectLen-2)return;
            timeKey++;
            return(
                <div key={`card-${timeKey}`}  className={Style.projectCard} onClick={()=>{
                    if(ClickRef.current){
                        router.push(`${linkString}?id=${index.id}`)
                    }
                }}>
                    <h3>{index.title}</h3>
                    <div className={Style.categoryDiv}>
                        {index.category.map((categoryIndex:string,categoryKey:number) =>{return <span key={`${timeKey}-${categoryKey}`}>{categoryIndex}</span>})}
                    </div>
                    <p>最後更新時間:{index.editTime}</p>
                </div>)
        })
        const projectDataList = projectData.map((index:any,key:number)=>{
            timeKey++;
            return(
                <div key={`card-${timeKey}`}  className={Style.projectCard} onClick={()=>{
                    if(ClickRef.current){
                        router.push(`${linkString}?id=${index.id}`)
                    }
                }}>
                    <h3>{index.title}</h3>
                    <div className={Style.categoryDiv}>
                        {index.category.map((categoryIndex:string,categoryKey:number) =>{return <span key={`${timeKey}-${categoryKey}`}>{categoryIndex}</span>})}
                    </div>
                    <p>最後更新時間:{index.editTime}</p>
                </div>)
            })
        const nextProjectDataList = projectData.map((index:any,key:number)=>{
            if((key+1) > 2)return;
            timeKey++;
            return(
                <div key={`card-${timeKey}`}  className={Style.projectCard} onClick={()=>{
                    if(ClickRef.current){
                        router.push(`${linkString}?id=${index.id}`)
                    }
                }}>
                    <h3>{index.title}</h3>
                    <div className={Style.categoryDiv}>
                        {index.category.map((categoryIndex:string,categoryKey:number) =>{return <span key={`${timeKey}-${categoryKey}`}>{categoryIndex}</span>})}
                    </div>
                    <p>最後更新時間:{index.editTime}</p>
                </div>)
            })
        return(
            <>
                {proProjectDataList}
                {projectDataList}
                {nextProjectDataList}
            </>)
    }

    let moveString = `move-${projectCardMove[0]}`
    return(
        <div id={idName} className={Style.ProjectDiv}>
            <h2>{moduleType==="Project" ? "最新作品":"最新文章"}</h2>
            <div ref={projectRef} className={`${Style.projectCardDiv} ${Style[moveString]}`} >
                <ProjectDataShow/>
            </div>
        </div>
    )

}