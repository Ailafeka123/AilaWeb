
import ProjectComponent from "./projectComponent"
import { Metadata } from "next";

export const metadata : Metadata ={
    title:"Aila-Web作品集",
    keywords:["劉星緯","Aila","個人作品","前端","前端工程師","React","NEXT","作品集","Firebase"],
    description:"關於我個人的相關作品，這裡放置我做作品的相關心得與分享的清單。清單是使用firebase的Firestore Database。",
    openGraph:{
        title:"Aila-Web作品集",
        description:"關於我個人的相關作品，這裡放置我做作品的相關心得與分享的清單。清單是使用firebase的Firestore Database。",
        locale:"zh-TW",
        type:"website",
    },
}
export default function Project(){

    return(
        <>
            <ProjectComponent/>
        </>
    )
}