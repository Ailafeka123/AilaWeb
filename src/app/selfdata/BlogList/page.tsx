"use client";

import { useState, useEffect } from "react";

import Style from "@/style/blogList.module.scss";

import { databaseGetAll } from "@/lib/databaseGetAll";

type showData ={
    id:string,
    method:string,
    userId:string,
    title:string,
    category:string[],
    creatTime:string,
    comeplete:boolean,
}


export default function BlogList(){
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchUse , setSearchUse] = useState<Boolean>(false)
    const [getData,setGetData] = useState<showData[]>([]);
    // useEffect(()=>{
    //     const getData = async() =>{
    //         const getBlog = await databaseGetAll("Blog","","creatTime","asc",true);
    //         const getProject = await databaseGetAll("Project","","creatTime","asc",true);
    //         console.log(getBlog);
    //         console.log(getProject);
    //     }
    //     getData();
    // },[])
    useEffect(()=>{
        if(searchUse){
            const getData = async() =>{
                const getBlog = await databaseGetAll("Blog","","creatTime","asc",true);
                const getProject = await databaseGetAll("Project","","creatTime","asc",true);
                const newArray = [...getBlog,...getProject];
                setGetData(newArray);
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
                    <span>{index.comeplete?"是":"否"}</span>
                    <div>
                        <button>修正</button>
                        <button>刪除</button>
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
        <search className={`${Style.search}`}>
            <label > 搜尋:</label>
            <input value={searchInput} onChange={(e)=>{
                // const inputValue:string = e.target.value;
                setSearchInput(e.target.value)
            }}></input>
            <button type="button" onClick={()=>{
                setSearchUse(true);
            }} >進行搜尋</button>
        </search>
        <article className={Style.article}>
            <ShowDataList/>
        </article>
    </main>
    )
}