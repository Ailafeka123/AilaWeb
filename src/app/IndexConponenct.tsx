"use client";

import Style from '@/style/index.module.scss';
import { useState,useEffect,useRef,useMemo } from "react";
import { useRouter } from 'next/navigation';
import { databaseGetAll } from '@/lib/databaseGetAll';

import IndexFirstComponent from '@/component/index/IndexFirstComponent';
import IndexTriComponent from '@/component/index/IndexTriComponent';

type dataType = {
  id:string,
  title:string,
  category:string[],
  editTime:string
}

export default function IndexComponent(){
  // 轉跳
  const router = useRouter();
  // 抓取資料 目前抓取兩個資料各前三
  const [projectData,setProjectData] = useState<dataType[]>([]);
  const [blogData,setBlogData] = useState<dataType[]>([]);

  const projectDivRef = useRef<HTMLDivElement|null>(null);
  // 當前位置 與最大值
  const [projectCardMove,setProjectCardMove] = useState<[number,number]>([4,7]);



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
    // 抓取部落格前三
    const getBlogData = async() =>{
      const getData = await databaseGetAll("Blog","","editTime","desc",false,3);
      const data = getData.map((index:any)=>{
        return({
          id:index.id,
          title:index.title,
          category:index.category,
          editTime:index.editTime,
        })
      }) 
      setBlogData(data);
    }

    getProjectData();
    getBlogData();

  },[])

  useEffect(()=>{
    if(projectData.length === 0)return ;
    if(projectDivRef.current){
      let projectDataLen = projectDivRef.current.querySelectorAll(`.${Style.projectCard}`).length;
      console.log(`projectDataLen = ${projectDataLen}`)
    }
    // 開啟監聽
    // window.addEventListener()
  },[projectData])

  useEffect(()=>{

  },[])

  useEffect(()=>{
    if(blogData.length === 0)return;
    console.log(blogData)
  },[blogData])

  return (
      <main className={`${Style.main}`}>
          <IndexFirstComponent/>
          <div id="secIndex" className={Style.aboutDiv}>
              <h2>個人介紹</h2>
              
              <div className={Style.aboutMeDiv}>
                <img className={Style.headImg} src="/index/self.jpg"></img>
                <p>學無止盡，每一天都比昨天更進步</p>
              </div>
              <div className={Style.aboutMeTextDiv}>
                <p>目前以前端工程師為目標，目前每天刷leetCode與製作個人作品為主。</p>
                <p>創作的方向會比較偏好做一些具有動態感的小物件，對於美觀來說比較好看，就是比較費效能。</p>
                <p>喜歡玩一些生存或角色類電子遊戲，喜歡逐步熟悉成長的感覺，會為此查許多攻略與嘗試。我覺得在撰寫程式方面也類似如此，遇到問題、想辦法解決、想不到則查資料或問AI，再回頭嘗試與理解。</p>
                <p>目前製作的專案以ReactJS為主，後續也會陸續嘗試一些新的框架與插件去製作網站，後續也有可能會嘗試ReactNative。</p>
                <p>感謝您的觀看，我的<span onClick={()=>{router.push('/project')}}>作品</span>與<span onClick={()=>{router.push("/blogdata")}}>文章</span>也歡迎觀看。</p>
              </div>
          </div>
          <IndexTriComponent moduleType = "Project" idName="triIndex"/>
          <IndexTriComponent moduleType = "Blog" idName="fourIndex"/>
      </main>
  );
}