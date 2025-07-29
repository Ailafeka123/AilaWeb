

import BlogShowComponent from "./BlogShowComponent"
import { Metadata } from "next"

export const metadata : Metadata ={
    title:"Aila-Web文章",
    keywords:["劉星緯","Aila","個人作品","前端","前端工程師","React","NEXT","文章","markdown","留言板","心得分享","學習分享","分享"],
    description:"關於我個人的心得分享，這裡放置我學習過程中的相關心得分享。內容是由markdown格式製作而成並放置在firebase的Firestore Database上，讀取之後再轉換回html格式。也歡迎對於文章進行留言。",
    openGraph:{
        title:"Aila-Web文章",
        description:"關於我個人的心得分享，這裡放置我學習過程中的相關心得分享。內容是由markdown格式製作而成並放置在firebase的Firestore Database上，讀取之後再轉換回html格式。也歡迎對於文章進行留言。",
        locale:"zh-TW",
        type:"website",
    },
}


export default function blogShow(){

    return(
    <>
        <BlogShowComponent/>
    </>)

}