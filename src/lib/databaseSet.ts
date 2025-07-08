"use client";
import { db } from "./database";
import { collection,addDoc,doc,setDoc } from "firebase/firestore";


type InputMod = "Auth"|"Blog"|"Project"|"BlogAns"|"BlogAnsMessage";
type inputData ={
    "Auth":{id:string,email:string|null,level:string},
    "Blog":{title:string,},
    "Project":{title:string},
    "BlogAns":{userId:string},
    "BlogAnsMessage":{userId:string},
}
// mod = "資料庫" data="內容"
export default async function databaseSet<K extends InputMod>(mod:K , data:inputData[K]):Promise<null|string>{
    // 如果是創立帳號專屬資料 則將帳號.id作為mainKey 其他則由系統自己產生
    try{
        if(mod ==="Auth"){
            const {id, ...otherData} = data as inputData["Auth"];
            const docRef = doc(db,mod,id);
            await setDoc(docRef,otherData);
        }else{
            const newID = await addDoc(collection(db,mod),data);
            console.log(`newID = ${newID}`);
            return newID.id;
        }
        console.log("新增完成")
        return null;
    }catch(e : any){
        console.error("增新失敗",e);
        return e.message;
    }
}