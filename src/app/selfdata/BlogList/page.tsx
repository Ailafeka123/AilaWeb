"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Style from "@/style/blogList.module.scss";

import { databaseGetAll } from "@/lib/databaseGetAll";



type showData ={
    id:string,
    method:string,
    userId:string,
    title:string,
    category:string[],
    creatTime:string,
    complete:boolean,
}


export default function BlogList(){
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
    useEffect(()=>{
        if(!searchUse) return;

        if(searchUse){
            const changeTolowerString = searchInput.toLowerCase().trim();
            console.timeLog(`changeTolowerString = ${changeTolowerString}`);
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

    const ShowDataList = () =>{
        const DataList = getData.map((index,key)=>{
            return(
                <div id={index.id} key={key} className={Style.card}>
                    <span>{index.title}</span>
                    <span>{index.method}</span>
                    <span>{index.category}</span>
                    <span>{index.creatTime}</span>
                    <span>{index.complete?"是":"否"}</span>
                    <div className={Style.cardEditDiv}>
                        <button type="button" onClick={()=>{router.push(`/selfdata/editBlog?id=${index.id}&mod=${index.method}`)}} >修正</button>
                        <button type="button" >刪除</button>
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
        <h2>這裡是編輯區</h2>
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
            <h2>{searchText!==""&&`當前搜尋:${searchText}`}</h2>
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
    </main>
    )
}