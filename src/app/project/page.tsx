"use client";

import { useState, useEffect,Suspense } from "react";
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
    // 初始化 載入所有project
    useEffect(()=>{
        if(getSearchKey === false) return;
        const getData = async()=>{
            const data = await databaseGetAll("Project",searchString,"creatTime","asc",false);
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

    useEffect(()=>{
        if(searchStart === false){
            return;
        }
        const getData = async()=>{
            try{
                const data = await databaseGetAll("Project",searchString,"creatTime","asc",false);
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

    const ShowDataList = () =>{
        const data = projectData.map((index,key)=>{
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
                <button type="button" onClick={()=>{setSearchStart(true)}} >提交</button>
            </search>
            <article className={Style.article}>
                <div className={Style.cardTitle}>
                </div>
                <ShowDataList/>
            </article>
        </main>
    </>);
}