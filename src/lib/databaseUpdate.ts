'use client';

import { db } from "./database";
import { doc,updateDoc } from "firebase/firestore";

type updateMode = "Auth"|"Blog"|"Project"|"BlogAns"|"BlogAnsMessage"
type updateData = {
    "Auth":{level:string},
    "Blog":{editTime:string,content:string,complete:boolean},
    "Project":{editTime:string,content:string,complete:boolean},
    "BlogAns":{userId:string,editTime:string,content:string},
    "BlogAnsMessage":{blogId:string,userId:string,editTime:string,content:string}
}

export default async function databaseUpdate<K extends updateMode>(mod:K, id:string, data:updateData[K]){
    try{
        await updateDoc(doc(db,mod,id),data);
        console.log("更新成功");
    }catch(e){
        console.error(e);
    }

}