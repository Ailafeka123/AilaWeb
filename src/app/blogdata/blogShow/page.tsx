

import BlogShowComponent from "./BlogShowComponent"
import { Metadata } from "next"

export const metadata : Metadata ={
    title:"Aila-Web文章"
}


export default function blogShow(){

    return(
    <>
        <BlogShowComponent/>
    </>)

}