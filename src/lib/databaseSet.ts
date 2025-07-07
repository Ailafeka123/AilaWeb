"use client";
import {app} from "@/lib/firebase";
import { getFirestore,collection,addDoc } from "firebase/firestore";

// mod = "資料庫" data="內容"
export default async function DatabaseSet(mod:"Auth"|"Blog"|"Project"|"BlogCallback",data:Record<string,any>){
    const db = getFirestore(app);
    // 如果是創立帳號專屬資料 則將帳號.id作為mainKey 其他則由系統自己產生
    try{
        if(mod ==="Auth"){
            await addDoc(collection(db,mod,data.id),data);
        }else{
            await addDoc(collection(db,mod),data);
        }
        console.log("新增完成")
    }catch(e){
        console.error("增新失敗",e);
    }
}