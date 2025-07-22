"use client";

import { useState, useEffect,Suspense , useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";


import Style from '@/style/project.module.scss';

import { databaseGetAll } from "@/lib/databaseGetAll";

function GetSearchString( { onChangeSet,toSearch } : {onChangeSet : (searchKey:string) => void; toSearch:(active:boolean)=>void}){
    const searchParms = useSearchParams();
    const getSearchString = searchParms.get("searchKey");
    useEffect(()=>{
        if(getSearchString){
            onChangeSet(getSearchString);
        }
        toSearch(true);
    },[])
    return <></>;
}

type showData ={
    id:string,
    title:string,
    category:string[],
    editTime:string,
}

export default function Project(){
    // 建立轉跳
    const router = useRouter();
    // 資料清單 建立
    const [projectData ,setProjectData] = useState<showData[]>([]);
    // 是否完成抓到search這個動作。
    const [getSearchKey, setGetSearchKey] = useState<boolean>(false);
    // 查詢的key 以及是否開啟搜尋動作
    const [searchString, setSearchString] = useState<string>("");
    const [searchStart , setSearchStart] = useState<boolean>(false);
    // 排序
    const [sortMethod, setSortMethod] = useState<["title"|"editTime","asc"|"desc"]>(["editTime","asc"])


    // 初始化 載入所有project
    useEffect(()=>{
        if(getSearchKey === false) return;
        const getData = async()=>{
            const data = await databaseGetAll("Project",searchString,sortMethod[0],sortMethod[1],false);
            const dataList =  data.map((index:any)=>{
                return({
                    id:index.id,
                    title:index.title,
                    category:index.category,
                    editTime:index.editTime,
                })
            })
            setProjectData(dataList);
        }
        getData();
    },[getSearchKey])
    // 查詢動作
    useEffect(()=>{
        if(searchStart === false){
            return;
        }
        const getData = async()=>{
            try{
                const data = await databaseGetAll("Project",searchString,sortMethod[0],sortMethod[1],false);
                const dataList =  data.map((index:any)=>{
                    return({
                        id:index.id,
                        title:index.title,
                        category:index.category,
                        editTime:index.editTime,
                    })
                })
                setProjectData(dataList);
            }catch(e){
                console.error(e);
                console.log("查詢失敗");
            }finally{
                setSearchStart(false)
            }
            
        }
        getData();
    },[searchStart])
    // 顯示資料內容
    const ShowDataList = () =>{
        const filterData = useMemo(()=>{
            const newData = [...projectData];
            if(sortMethod[1] === "asc"){
                newData.sort((a,b)=> a[sortMethod[0]].localeCompare(b[sortMethod[0]]) )
            }else{
                newData.sort((a,b)=> b[sortMethod[0]].localeCompare(a[sortMethod[0]]) )
            }
            return newData;
        },[projectData,sortMethod])


        const data = filterData.map((index,key)=>{
            return (
                <div key = {key} className={Style.card} onClick={()=>{
                    router.push(`/project/projectShow?id=${index.id}`);
                }}>
                    <div>
                        <h2>{index.title}</h2>
                        <div className={Style.categoryDiv}>
                            <span>分類:</span>
                            {index.category.map((categoryIndex,categoryKey)=>{
                                return (
                                <span key={`span-${categoryKey}`}>
                                    {categoryIndex}
                                </span>)
                            })}
                        </div>
                    </div>
                    <div className={Style.timeDiv}>
                        <span>最後編輯時間:{index.editTime}</span>
                    </div>
                </div>
            )
        })
        return (
            <div className={Style.cardDiv}>
                {data}
            </div>
        )
    }
    return (<>
        <main className={Style.main}>
            <Suspense>
                <GetSearchString onChangeSet={setSearchString} toSearch={setGetSearchKey}/>
            </Suspense>
            <search className={Style.searchDiv}>
                <label>搜尋:</label>
                <input value={searchString} onChange={(e)=>{
                    setSearchString(e.target.value.trim());
                }}></input>
                <button type="button" onClick={()=>{ if(searchStart === false)setSearchStart(true)}} >提交</button>

                <button type="button" onClick={()=>{setSortMethod(index=>{
                    if(index[0] === "title"){
                        return ["editTime",index[1]]
                    }else{
                        return ["title",index[1]]
                    }
                })}}>{sortMethod[0] === "title"? "標題排序" :"時間排序"}</button>
                <button type="button" onClick={()=>{setSortMethod(index=>{
                    if(index[1] === "asc"){
                        return([index[0],"desc"]);
                    }else{
                        return([index[0],"asc"])
                    }
                })}}>{sortMethod[1] === "asc" ? "由小到大排序":"由大到小排序"}</button>
            </search>
            <article className={Style.article}>
                <div className={Style.cardTitle}>
                </div>
                <ShowDataList/>
            </article>
        </main>
    </>);
}