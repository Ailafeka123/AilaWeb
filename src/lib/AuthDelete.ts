'use client';

import { Auth } from "./firebaseAuth";
import { deleteUser } from "firebase/auth";
import { databaseDelete } from "./databaseDelete";
export  default async function AuthDelete():Promise<boolean>{
    const user = Auth.currentUser;
    if (user === null) return false;
    try{
        // 刪除database Auth
        await databaseDelete("Auth",user.uid);
        await deleteUser(user);
        return true;
    }catch(e){
        console.log("刪除帳號錯誤")
        console.error(e);
        return false;
    }
}