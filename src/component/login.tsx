"use client";
import { useState } from "react";
import Style from "@/style/login.module.scss"
export default function Login(){
    const [loginName,setLoginName] = useState<String>("");
    const [loginPassword,setLoginPassword] = useState<String>("");
    const [submitMethod,setSubmitMethod] = useState<String>("Login");


    

    return(
        <div className={Style.loginDiv} >
            <form action="" onSubmit={(e)=>{
                e.preventDefault();
                console.log("提交")
            }}>
                <h2>{submitMethod === "Login"? "登入": "註冊"}</h2>
                <label>帳號</label>
                <input type="text" required></input>
                <label>密碼</label>
                <input type="password" required></input>
                <button type="button">eye</button>
                <div className={Style.buttonDiv}>
                    <button type="submit">提交</button>
                    <button type="button">註冊</button>
                </div>
            </form>
        </div>
    )
}