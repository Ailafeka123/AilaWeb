

import BlogDataComponent from "./blogDataComponent";
import { Metadata } from "next";

export const metadata : Metadata ={
    title:"Aila-Web文章合集",
    keywords:["劉星緯","Aila","個人作品","前端","前端工程師","React","NEXT","文章合集","Firebase"],
    description:"關於我個人的相關心得分享，這裡放置我一些學習過程中的心得分享清單。清單是使用firebase的Firestore Database。",
    openGraph:{
        title:"Aila-Web文章合集",
        description:"關於我個人的相關心得分享，這裡放置我一些學習過程中的心得分享清單。清單是使用firebase的Firestore Database。",
        locale:"zh-TW",
        type:"website",
    },
}

export default function BlogData(){

    return (
        <>
            <BlogDataComponent/>
        </>
    )
}