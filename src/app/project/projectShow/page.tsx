
import ProjectShowComponent from "./ProjectShowComponent";
import { Metadata } from "next";

export const metadata : Metadata ={
    title:"Aila-Web作品",
    keywords:["劉星緯","Aila","個人作品","前端","前端工程師","React","NEXT","作品","markdown","留言板"],
    description:"關於我個人的相關作品，這裡放置我做作品的相關心得與分享。內容是由markdown格式製作而成並放置在firebase的Firestore Database上，讀取之後再轉換回html格式。也歡迎對於文章進行留言。",
    openGraph:{
        title:"Aila-Web作品",
        description:"關於我個人的相關作品，這裡放置我做作品的相關心得與分享。內容是由markdown格式製作而成並放置在firebase的Firestore Database上，讀取之後再轉換回html格式。也歡迎對於文章進行留言。",
        locale:"zh-TW",
        type:"website",
    },
}
export default function projectShow(){
    return (
        <>
            <ProjectShowComponent/>
        </>
    )
}