"use client"
import {app} from "@/lib/firebase";
import { getFirestore,doc,getDoc } from "firebase/firestore";

// mod = 資料庫的 id = mainKey;
export default async function DatabaseGet (mod:string,id:string):Promise<Record<string, any> | null>{
    const db = getFirestore(app);
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