"use client"

import { useState,useEffect } from "react"

import Style from "@/style/Message.module.scss";

import { Auth } from "@/lib/firebaseAuth"
import { onAuthStateChanged } from "firebase/auth";
import databaseGet from "@/lib/databaseGet";


type loginData = {
    id:string,

}


export default function Message(blogid:string){
    const [loginState,setLoginState] = useState<boolean>(false);
    const [loginData,setLoginData] = useState<loginData>()
    useEffect(()=>{
        const unSub =  onAuthStateChanged(Auth,(user)=>{
            if(user){
                setLoginState(true);
                (async () =>{
                    const data = await databaseGet("Auth",user.uid);
                    console.log(data?.blogMessage);
                })();
                
            }else{

            }
        })
        return ()=>{
            unSub();
        }
    },[])
    return(
        <div className={Style.messageBox}>
            <textarea name="" id=""></textarea>
        </div>
    )
}