"use clinet";

import { db } from "./database";
import { writeBatch, doc } from "firebase/firestore";

type blogMessageDataType ={
    BlogTilte:string,
    BlogId:string,
    method:"Project" | "Blog",
    MessageId:string[],
}
type AuthData ={
    id:string,
    email:string,
    level:string,
    blogMessage:blogMessageDataType[],
}
export async function authMessageDelete(AuthData:AuthData):Promise<boolean>{
    const batch = writeBatch(db);
    const findMessageList = AuthData.blogMessage;
    const findAllMessgae:string[] = []
    findMessageList.map(index=>{
        findAllMessgae.push(...index.MessageId)
    })
    findAllMessgae.forEach(index=>{
        const docRef = doc(db, "BlogMessage", index);
        batch.delete(docRef);
    })
    batch.update(doc(db,"Auth",AuthData.id), {level:AuthData.level,blogMessage:[]})
    
    try{
        await batch.commit();
        return true;
    }catch(e){
        return false;
    }
}