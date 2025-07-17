
import EditBlogComponent from "./EditBlogComponent";
import { Metadata } from "next";


export const metadata : Metadata ={
    title:"Aila-Web詳細編輯頁面"

}

export default function editBlog(){
    return (
        <>
            <EditBlogComponent/>
        </>
    )
    
}