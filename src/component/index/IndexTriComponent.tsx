"use client";

import { useState,useEffect } from "react";
import Style from "@/style/IndexFir.module.scss"

import { databaseGetAll } from "@/lib/databaseGetAll";
type dataType = {
  id:string,
  title:string,
  category:string[],
  editTime:string
}

export default function IndexTriComponent(){
    const [projectData,setProjectData] = useState<dataType[]>([]);
    // 初始化 抓取資料
    useEffect(()=>{
        // 抓取作品前三
        const getProjectData = async() =>{
            const getData = await databaseGetAll("Project","","editTime","desc",false,3);
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

    const ProjectDataShow = () =>{

        let timeKey:number = 0;

        const projectDataList = projectData.map((index:any,key:number)=>{
            timeKey++;
            return(
                <div key={`card-${timeKey}`}  className={Style.projectCard} >
                    <h3>{index.title}</h3>
                    <div className={Style.categoryDiv}>
                        {index.category.map((categoryIndex:string,categoryKey:number) =>{return <span key={`${timeKey}-${categoryKey}`}>{categoryIndex}</span>})}
                    </div>
                    <p>最後更新時間:{index.editTime}</p>
                </div>)
            })
        return(
        <div className={`${Style.projectCardDiv}`} >
            {projectDataList}
        </div>)
    }


    return(
        <div id="triIndex" className={Style.ProjectDiv}>
            <h2>最新作品</h2>
            <ProjectDataShow/>
        </div>
    )

}