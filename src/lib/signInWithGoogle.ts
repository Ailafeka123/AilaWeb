"use client";

import { Auth } from './firebaseAuth';
import { GoogleAuthProvider,  signInWithPopup, signInWithRedirect } from 'firebase/auth';

export default async function  signInWithGoogle(){
    const provider = new GoogleAuthProvider();
    try{
        await signInWithPopup(Auth,provider);
    }catch(e){
        console.log(e);
        console.error("錯誤 瀏覽器禁止開啟分頁登入 開啟轉跳");
        
    }
    // try{
    //     await signInWithRedirect(Auth,provider);
    // }catch(e2){
    //     console.error(e2);
    //     console.log("錯誤,取消登入")
    // }
}