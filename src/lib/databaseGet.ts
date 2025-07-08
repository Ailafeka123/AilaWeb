"use client"
import { db } from "./database";
import { doc,getDoc } from "firebase/firestore";

// mod = 資料庫的 id = mainKey;
export default async function databaseGet (mod:string,id:string):Promise<Record<string, any> | null>{
    try{
        const docRef =  doc( db, mod, id);
        const snapshot = await getDoc(docRef);
        if(snapshot.exists()){
            console.log({
                id:snapshot.id,
                ...snapshot.data(),
            })
            return({
                id:snapshot.id,
                ...snapshot.data(),
            })
        }else{

            return null;
        }

    }catch(e){
        console.error("查詢錯誤",e);
        return null;
    }
}