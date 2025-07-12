"use client";
import { db } from "./database";
import {doc ,deleteDoc } from "firebase/firestore";

export async function databaseDelete(method:string, id:string):Promise<boolean>{
    try{
        await deleteDoc(doc(db,method,id));
        console.log("刪除成功")
        return true;

    }catch(e){
        console.log("刪除AuthDatabase錯誤")
        console.error(e);
        return false;
    }
}
