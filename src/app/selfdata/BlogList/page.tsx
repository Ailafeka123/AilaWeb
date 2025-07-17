
import { Metadata } from "next"
import BlogListComponent from "./BlogListComponent"

export const metadata:Metadata = {
    title:"Aila-Web後台_網站編輯",
    keywords:["劉星緯","Aila","個人作品","前端","前端工程師","React","NEXT","後台","網站編輯"],
    description:"作為個人部落格，平常分享一些平常學習到的知識與放置作品集，使用Next並部屬在github與vercel上。此頁作為後台，可以進行作品與部落格的編輯",
}

export default function BlogList(){
    return (
    <>
        <BlogListComponent/>
    </>
    )
}