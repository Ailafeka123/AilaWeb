"use client";

import { useState, useEffect, useRef } from "react";
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
    const [checkDeleteDiv,setCheckDeleteDiv] = useState<boolean>(false);
    const [checkDelete, setCheckDelete] = useState<boolean>(false);
    // 確認刪除ID的參數
    const deleteDataRef = useRef<[string,string]>(["",""]);
    //  
    // 初始化 搜尋全部
    useEffect(()=>{
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
                    complete:index.complete,
                })
            })
            setGetData(putArray);
        }
        getData();
    },[])
    // 查詢功能
    useEffect(()=>{
        if(!searchUse) return;

        if(searchUse){
            const changeTolowerString = searchInput.toLowerCase().trim();
            if(changeTolowerString === ""){
                setSearchText("全部");
            }else{
                setSearchText(changeTolowerString);
            }

            const getData = async() =>{
                const getBlog = await databaseGetAll("Blog",changeTolowerString,"creatTime","asc",true);
                const getProject = await databaseGetAll("Project",changeTolowerString,"creatTime","asc",true);
                const newArray = [...getBlog,...getProject];
                const putArray:showData[] = newArray.map(index=>{
                    return({
                        id:index.id,
                        method:index.method,
                        userId:index.userId,
                        title:index.title,
                        category:index.category,
                        creatTime:index.creatTime,
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
                setSearchUse(true);
            }
        }
        deleteUse();
    },[checkDelete])

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
        const DataList = getData.map((index,key)=>{
            let categoryList = index.category.join(",");
            return(
                <div id={index.id} key={key} className={Style.card}>
                    <span>{index.title}</span>
                    <span>{index.method}</span>
                    <span>{categoryList}</span>
                    <span>{index.creatTime}</span>
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

    return(
    <main className={`${Style.main}`}>
            <h2>{searchText!==""&&`當前搜尋:${searchText}`}</h2>
        <div>
            <search className={`${Style.search}`}>
                <label > 搜尋:</label>
                <input value={searchInput} onChange={(e)=>{
                    // const inputValue:string = e.target.value;
                    setSearchInput(e.target.value)
                }}></input>
                <button type="button" onClick={()=>{
                    setSearchUse(true);
                }} >進行搜尋</button>
                <button type="button" onClick={()=>{router.push(`/selfdata/editBlog`)}}>建立新資料</button>
            </search>
        </div>
        <article className={Style.article}>
            
            <div className={Style.cardTitle}>
                <span>標題</span>
                <span>類型</span>
                <span>分類</span>
                <span>建立時間</span>
                <span>是否公布</span>
                <span>編輯</span>
            </div>
            <ShowDataList/>
        </article>
        <ConfirmDiv></ConfirmDiv>
    </main>
    );
}
