
import ProjectShowComponent from "./ProjectShowComponent";
import { Metadata } from "next";

export const metadata : Metadata ={
    title:"Aila-Web作品頁面"
}

export default function projectShow(){
    return (
        <>
            <ProjectShowComponent/>
        </>
    )
}