"use client";

import { useState, useEffect, useRef,useMemo } from "react";
import { useRouter } from "next/navigation";

import Style from "@/style/blogList.module.scss";

import { databaseGetAll } from "@/lib/databaseGetAll";
import { databaseDelete } from "@/lib/databaseDelete";


type showData ={
    id:string,
    method:string,
    userId:string,
    title:string,
    category:string[],
    creatTime:string,
    editTime:string,
    complete:boolean,
}

export default function BlogListComponent(){
    // 轉跳
    const router = useRouter();
    // 輸入文字
    const [searchInput, setSearchInput] = useState<string>("");
    // 搜尋文字
    const [searchText , setSearchText] = useState<string>("所有");
    // 傳送資料
    const [searchUse , setSearchUse] = useState<Boolean>(false)
    // 獲得資料放置
    const [getData,setGetData] = useState<showData[]>([]);
    // 二度確認刪除功能
    // 刪除確認框
    const [checkDeleteDiv,setCheckDeleteDiv] = useState<boolean>(false);
    // 確認刪除
    const [checkDelete, setCheckDelete] = useState<boolean>(false);
    // 確認刪除ID的參數
    const deleteDataRef = useRef<[string,string]>(["",""]);
    // 搜尋方式 [按照什麼搜尋,升續或降冪]
    const [sortMethod , setSortMethod] = useState<["title"|"creatTime"|"editTime" ,"asc"|"desc"]>(["creatTime","asc"]);
    // 是否要顯示部落格 作品 還是兩者都要 0 = 預設 , 1 = 作品,  2 = 部落格
    const [searchMethod,setSearchMethod] = useState<0|1|2>(0);
    // 捕捉是否為黑暗模式
    const [darkMode,setDarkMode] = useState<boolean>(false);
    //  
    // 初始化 第一次進入時的搜尋全部
    useEffect(()=>{
        // 捕捉是否為黑暗模式
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        if (media.matches) {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
        const getData = async() =>{
            const getBlog = await databaseGetAll("Blog","","creatTime","asc",true);
            const getProject = await databaseGetAll("Project","","creatTime","asc",true);
            const newArray = [...getBlog,...getProject];
            const putArray:showData[] = newArray.map(index=>{
                return({
                    id:index.id,
                    method:index.method,
                    userId:index.userId,
                    title:index.title,
                    category:index.category,
                    creatTime:index.creatTime,
                    editTime:index.editTime,
                    complete:index.complete,
                })
            })
            setGetData(putArray);
        }
        getData();
    },[])
    // 查詢功能
    useEffect(()=>{
        if(searchUse === false) return;

        if(searchUse){
            const changeTolowerString = searchInput.toLowerCase().trim();
            if(changeTolowerString === ""){
                setSearchText("全部");
            }else{
                setSearchText(changeTolowerString);
            }

            const getData = async() =>{
                let getProject = [];
                let getBlog = [];
                getProject = await databaseGetAll("Project",changeTolowerString,sortMethod[0],sortMethod[1],true);
                getBlog = await databaseGetAll("Blog",changeTolowerString,sortMethod[0],sortMethod[1],true);
                const newArray = [...getBlog,...getProject];
                const putArray:showData[] = newArray.map(index=>{
                    return({
                        id:index.id,
                        method:index.method,
                        userId:index.userId,
                        title:index.title,
                        category:index.category,
                        creatTime:index.creatTime,
                        editTime:index.editTime,
                        complete:index.complete,
                    })
                })
                setGetData(putArray);
            }
            getData();
            setSearchUse(false);
        }
    },[searchUse])


    // 刪除功能
    useEffect(()=>{
        if(checkDelete === false) return;
        const deleteUse = async()=>{
            try{
                databaseDelete(deleteDataRef.current[0],deleteDataRef.current[1]);
            }catch(e){
                console.error(e);
            }finally{
                // 關閉確認視窗
                setCheckDelete(false);
                setCheckDeleteDiv(false);
                // 觸發重新搜尋
                setSearchUse(true);
            }
        }
        deleteUse();
    },[checkDelete])
    // 刪除確認框
    const ConfirmDiv = () =>{
        return(
        <div className={`${Style.confirmDiv} ${checkDeleteDiv?Style.confirmDivShow:""}`}>
            <h2>
                <span>此步驟將不可復原</span><br></br>
                <span>是否確認刪除?</span>
            </h2>
            <div>
                <button type="button" onClick={()=>{setCheckDelete(true)}}>確認</button>
                <button type="button" onClick={()=>{setCheckDeleteDiv(false)}}>取消</button>
            </div>
        </div>)
    }
    // 將data轉為清單顯示
    const ShowDataList = () =>{
        const newGetData = useMemo(()=>{
            let noFilterData = [];
            if (sortMethod[1] === "asc"){
                noFilterData = [...getData].sort((a,b) => a[sortMethod[0]].localeCompare(b[sortMethod[0]]) );
            }else{
                noFilterData =  [...getData].sort((a,b)=> b[sortMethod[0]].localeCompare(a[sortMethod[0]]) );
            }
            if(searchMethod === 1){
                noFilterData = noFilterData.filter(index=>index.method === "Project");
            }else if(searchMethod === 2){
                noFilterData = noFilterData.filter(index=>index.method === "Blog");
            }
            return noFilterData;
        },[sortMethod,searchMethod,getData])

        const DataList = newGetData.map((index,key)=>{
            let categoryList = index.category.join(",");
            return(
                <div id={index.id} key={key} className={Style.card}>
                    <span>{index.title}</span>
                    <span>{index.method}</span>
                    <span>{categoryList}</span>
                    <span>{index.creatTime}</span>
                    <span>{index.editTime}</span>
                    <span>{index.complete?"是":"否"}</span>
                    <div className={Style.cardEditDiv}>
                        <button type="button" onClick={()=>{router.push(`/selfdata/editBlog?id=${index.id}&mod=${index.method}`)}} >修正</button>
                        <button type="button" className={Style.errorButton} onClick={()=>{
                            setCheckDeleteDiv(true);
                            deleteDataRef.current = [index.method,index.id]
                        }} >刪除</button>
                    </div>
                </div>
            )
        })
        return (
            <div className={Style.cardShowDiv}>
                {DataList}
            </div>
        )
    }
    // 轉換排序功能
    const changeSort = (sortName:"title"|"creatTime"|"editTime") =>{
        if(sortName === sortMethod[0]){
            setSortMethod(index=>{
                let order : "asc"|"desc" = index[1] === "asc"? "desc" : "asc";
                return [index[0],order];
            })
        }else{
            setSortMethod([sortName,"asc"]);
        }
    }

    let imgSrc:string = "";
    if(darkMode){
        if(sortMethod[1]==="asc"){
            imgSrc = "/sortUp-dark.svg"
        }else{
            imgSrc = "/sortDown-dark.svg"
        }
    }else{
                if(sortMethod[1]==="asc"){
            imgSrc = "/sortUp-light.svg"
        }else{
            imgSrc = "/sortDown-light.svg"
        }

    }

    return(
    <main className={`${Style.main}`}>
            <h2>{searchText!==""&&`當前搜尋:${searchText}`}</h2>
        <div>
            <search className={`${Style.search}`}>
                <label > 搜尋:</label>
                <input value={searchInput} onChange={(e)=>{
                    setSearchInput(e.target.value)
                }}></input>
                <button type="button" onClick={()=>{
                    setSearchUse(true);
                }} >進行搜尋</button>
                <button type="button" onClick={()=>{router.push(`/selfdata/editBlog`)}}>建立新資料</button>
                <button type="button" onClick={()=> {setSearchMethod(index=>{
                    if(index === 0){
                        return 1
                    }else if(index === 1){
                        return 2
                    }else{
                        return 0
                    }
                    })}} >{searchMethod===0?"顯示全部":searchMethod === 1?"僅顯示作品":"僅顯示部落格"}</button>
            </search>
        </div>
        <article className={Style.article}>
            
            <div className={Style.cardTitle}>
                <span className={Style.sortTitle} onClick={()=>{changeSort("title")}}>標題{sortMethod[0] === "title" && <img src={imgSrc}></img> }</span>
                <span>類型</span>
                <span>分類</span>
                <span className={Style.sortTitle} onClick={()=>{changeSort("creatTime")}}>建立時間{sortMethod[0] === "creatTime" && <img src={imgSrc}></img> }</span>
                <span className={Style.sortTitle} onClick={()=>{changeSort("editTime")}}>修改時間{sortMethod[0] === "editTime" && <img src={imgSrc}></img> }</span>
                <span>是否公布</span>
                <span>編輯</span>
            </div>
            <ShowDataList/>
        </article>
        <ConfirmDiv></ConfirmDiv>
    </main>
    );
}
