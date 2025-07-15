"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


import Style from '@/style/project.module.scss';

import { databaseGetAll } from "@/lib/databaseGetAll";



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
    const [searchString, setSearchString] = useState<string>("");
    const [searchStart , setSearchStart] = useState<boolean>(false);
    // 初始化 載入所有project
    useEffect(()=>{
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
    },[])

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
                        <div>
                            <span>分類:</span>
                            {index.category.map((categoryIndex,categoryKey)=>{
                                return (
                                <span key={`span-${categoryKey}`}>
                                    {categoryIndex}
                                </span>)
                            })}
                        </div>
                    </div>
                    <div>
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