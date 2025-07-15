"use client";

import { useState, useEffect,Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Style from "@/style/projectShow.module.scss";

import databaseGet from "@/lib/databaseGet";
// 相關建議
// import { databaseGetAll } from "@/lib/databaseGetAll";
import { markDownChange } from "@/lib/markDownChange";



// 捕捉id
function GetId( { onChangeSet } : {onChangeSet : (id:string) => void;}){
    const searchParms = useSearchParams();
    const getidString = searchParms.get("id");
    useEffect(()=>{
        if(getidString){
            onChangeSet(getidString);
        }
    },[])
    return <></>;
}


type projectDataList = {
    title:string,
    category:string[],
    content:string,
    creatTime:string,
    editTime:string,
}
export default function projectShow(){
    const [projectId,setProjectId] = useState<string>("")
    const [projectData ,setProjectData] = useState<projectDataList>({
        title:"",
        category:[],
        content:"",
        creatTime:"",
        editTime:""
    })
    // 取得資料
    useEffect(()=>{
        if(projectId){
            const getdata = async()=>{
                const data = await databaseGet("Project",projectId);
                if(data){
                    const changeText :string = await markDownChange(data.content);
                    const dataList : projectDataList = {
                        title:data.title,
                        category:data.category,
                        content:changeText,
                        creatTime:data.creatTime,
                        editTime:data.editTime
                    }
                    setProjectData(dataList);
                }
            }
            getdata();
        }
    },[projectId])

    const ShowData = () =>{
        return(
            <article className={Style.article}>
                <header className={Style.header}>
                    <div className={Style.projectTitle}>
                        <h1>{projectData.title}</h1>
                        <div className={Style.timeDiv}>
                            <span>{`建立時間:${projectData.creatTime}`}</span>
                            <span>{`最後修改時間:${projectData.editTime}`}</span>
                        </div>
                    </div>
                    <div className={Style.categoryList}>
                        <span>{`分類:`}</span>
                        {projectData.category.length && projectData.category.map((index,key)=>{
                            return(
                                <span key = {key}>{index}</span>
                            )
                        })}
                    </div>
                </header>
                <section className={Style.section}>
                    <div dangerouslySetInnerHTML={{ __html: projectData.content }} className={Style.showDiv} />
                </section>
            </article>
        )
    }




    return(
    <main className={Style.main}>
        <Suspense>
            <GetId onChangeSet={setProjectId}/>
        </Suspense>
        <ShowData/>
    </main>
    )
}