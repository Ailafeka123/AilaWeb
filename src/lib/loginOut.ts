"use client";
import { signOut } from "firebase/auth";
import {app} from "@/lib/firebase";
import { getAuth } from "firebase/auth";

const LoginOut = async() =>{
    const auth = getAuth(app);
    try{
        await signOut(auth);
        console.log("登出成功")
    }catch(e:any){
        console.error("登出失敗",e);
    }
}
export default LoginOut;