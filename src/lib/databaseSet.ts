"use client";
import { db } from "./database";
import { collection,addDoc,doc,setDoc } from "firebase/firestore";
// 第一個為對哪篇部落或文章的ID去回覆，第二個為建立了那些回復訊息。
type AuthBlogDataList = {
    BlogId:string,
    BlogMethod:"Blog"|"Project",
    BlogTilte:string,
    MessageId:string[],
}
type InputMod = "Auth"|"Blog"|"Project"|"BlogMessage"|"BlogAnsMessage";
type inputData = {
    // blug:string|null,project:string|null,BlogAns:string|null,BlogAnsMessage:string|null,
    "Auth":{id:string,email:string|null,level:string,blogMessage:AuthBlogDataList[],},
    "Blog":{title:string,userId:string,creatTime:string,editTime:string,content:string,complete:boolean,category:string[],searchKey:string[]},
    "Project":{title:string,userId:string,creatTime:string,editTime:string,content:string,complete:boolean,category:string[],searchKey:string[]},
    "BlogMessage":{userId:string,BlogID:string,creatTime:string,editTime:string,content:string},
    "BlogAnsMessage":{userId:string,BlogAnsID:string,creatTime:string,editTime:string,content:string},
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
            return newID.id;
        }
        return null;
    }catch(e : any){
        console.error("增新失敗",e);
        return e.message;
    }
}