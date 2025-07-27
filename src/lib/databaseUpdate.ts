'use client';

import { db } from "./database";
import { doc,updateDoc } from "firebase/firestore";

type updateMode = "Auth"|"Blog"|"Project"|"BlogAns"|"BlogAnsMessage"
type AuthBlogDataList = {
    BlogId:string,
    MessageId:string[],
}
type updateData = {
    "Auth":{blogMessage:AuthBlogDataList[],level:string},
    "Blog":{editTime:string,content:string,complete:boolean,category:string[],searchKey:string[]},
    "Project":{editTime:string,content:string,complete:boolean,category:string[],searchKey:string[]},
    "BlogAns":{userId:string,editTime:string,content:string},
    "BlogAnsMessage":{blogId:string,userId:string,editTime:string,content:string}
}

export default async function databaseUpdate<K extends updateMode>(mod:K, id:string, data:updateData[K]):Promise<boolean>{
    console.log("data這邊接收到了")
    console.log(`mod = ${mod}`);
    console.log(`id = ${id}`);
    console.log(`data = ${data}`);
    try{
        await updateDoc(doc(db,mod,id),data);
        console.log("更新成功");
        return true;
    }catch(e){
        console.error(e);
        return false;
    }

}