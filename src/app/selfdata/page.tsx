
import SelfDataComponent from "./SelfDataComponent";
import { Metadata } from "next";

export const metadata:Metadata = {
    title:"Aila-Web個人頁面",
    keywords:["劉星緯","Aila","個人作品","前端","前端工程師","React","NEXT","個人頁面"],
}

export default function selfdata () {
    return (
        <>
            <SelfDataComponent/>
        </>
    )
}