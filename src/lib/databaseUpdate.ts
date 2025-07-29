'use client';

import { db } from "./database";
import { doc,updateDoc } from "firebase/firestore";

type updateMode = "Auth"|"Blog"|"Project"|"BlogMessage"|"BlogAnsMessage"
type AuthBlogDataList = {
    BlogId:string,
    BlogMethod:"Blog"|"Project",
    BlogTilte:string,
    MessageId:string[],
}
type updateData = {
    "Auth":{blogMessage:AuthBlogDataList[],level:string},
    "Blog":{editTime:string,content:string,complete:boolean,category:string[],searchKey:string[]},
    "Project":{editTime:string,content:string,complete:boolean,category:string[],searchKey:string[]},
    "BlogMessage":{content:string,editTime:string},
    "BlogAnsMessage":{blogId:string,userId:string,editTime:string,content:string}
}

export default async function databaseUpdate<K extends updateMode>(mod:K, id:string, data:updateData[K]):Promise<boolean>{
    try{
        await updateDoc(doc(db,mod,id),data);
        return true;
    }catch(e){
        console.error(e);
        return false;
    }

}