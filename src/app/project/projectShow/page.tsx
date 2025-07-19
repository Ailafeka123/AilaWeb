
import ProjectShowComponent from "./ProjectShowComponent";
import { Metadata } from "next";

export const metadata : Metadata ={
    title:"Aila-Web作品"
}
export default function projectShow(){
    return (
        <>
            <ProjectShowComponent/>
        </>
    )
}