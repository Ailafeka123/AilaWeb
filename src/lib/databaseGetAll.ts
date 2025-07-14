"use client";

import { db } from "./database";
import { collection, query, where, getDocs, orderBy,limit } from "firebase/firestore";


export async function databaseGetAll(method:string,searchKey:string){
    const q  = query (collection(db,method),where("title","==",searchKey), orderBy("creatTime","desc") , limit(10));
    try{
        const dataList = await getDocs(q);
        dataList.docs.map(index=>{
            console.log(index);
        })

    }catch(e){
        console.error(e);
    }


}