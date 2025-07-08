"use client";
import { signOut } from "firebase/auth";
import { Auth } from "./firebaseAuth";

const LoginOut = async() =>{
    try{
        await signOut(Auth);
        console.log("登出成功")
    }catch(e:any){
        console.error("登出失敗",e);
    }
}
export default LoginOut;