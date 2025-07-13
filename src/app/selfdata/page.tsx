"use client";
import { useState, useEffect, useRef } from "react"
import Style from "@/style/selfdata.module.scss";
import { Auth } from "@/lib/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";

import { useRouter } from "next/navigation";

import databaseGet from "@/lib/databaseGet";
import databaseSet from "@/lib/databaseSet";

import AuthReprovide from "@/lib/AuthReprovide";
import AuthDelete from "@/lib/AuthDelete";

import Image from "next/image";
type selfData ={
    id:string,
    name:string,
    img:string,
    level:string
}
export default function selfdata () {
    // 是否登入
    const [loginState,setLoginState] =useState<boolean>(false);
    // 是否通驗驗證
    const reprovide = useRef<Boolean>(false);
    // 間隔
    const provideColdDown = useRef<Boolean>(false);
    // 驗證div視窗
    const [reprovideDiv , setReprovideDiv] = useState<boolean>(false);
    // 重新驗證密碼
    const [reprovidePassword,setReprovidePassword] = useState<string>("");
    // 錯誤訊息
    const [reprovideError, setReprovideError] = useState<string>("");

    // 個人訊息保存
    const [dataUse, setDataUse] = useState<selfData>({
        id:"",
        name:"",
        img:"/selfData/face.svg",
        level:"",
    })
    // 轉跳
    const router = useRouter();
    // 監聽帳號 如果有 則進行登入
    useEffect(()=>{
        const unSub =  onAuthStateChanged(Auth,(user)=>{
            if(user){
                setLoginState(true);
                let userData : selfData = {
                    id: user.uid ?? "",
                    name: user.displayName ?? user.email ?? "",
                    img: user.photoURL ?? "/selfData/face.svg",
                    level:"訪客",
                };
                (async () =>{
                    // 讀取是否有創立帳號訊息
                    const data = await databaseGet("Auth",user.uid);
                    // 沒有話建立建立(避免某些bug 導致沒有建立檔案)
                    if(data === null){
                        const dataInput = {
                            id:user.uid,
                            email:user.email || null,
                            level:"guest"
                        }
                        await databaseSet("Auth",dataInput);
                        setDataUse(userData);
                    }else{
                        if(data.level){
                            userData = {
                                ...userData,
                                level: data.level === "AilaEditer" ? "管理者" : "訪客"
                            }
                            setDataUse(userData);
                        }
                        
                    }
                })();
                
            }else{

            }
        })
        return ()=>{
            unSub();
        }
    },[])
    
    
    const checkInputReprovidePassword = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const allowedChars = /[^A-Za-z0-9]/g;
        const newWord = e.target.value.replace(allowedChars, "");
        setReprovidePassword(newWord);
    }
    const  secProvide =  async() =>{
        if(provideColdDown.current === false){
            provideColdDown.current = true;
            reprovide.current = await AuthReprovide(reprovidePassword);
            // 驗證成功
            if(reprovide.current === true){
                setReprovideError("");
                const deleteCheck:boolean= await AuthDelete();
                if(deleteCheck === true){
                    closeProvideDiv();
                    router.push("/");
                }
                reprovide.current = false;

            }else{
                setReprovideError("驗證錯誤");
            }
            provideColdDown.current = false;
        }
        
    }
    const closeProvideDiv = () =>{
        setReprovideDiv(false);
        setReprovidePassword("");
    }
    return (
        <>
            <main className={Style.main}>
                <div className={` ${loginState === false ? Style.selfData : Style.hidden} `}>
                    <h2>請先登入帳號</h2>
                </div>
                <div className={` ${loginState === true ? Style.selfData : Style.hidden} `}>
                    <div className={`${Style.faceDiv}`}>
                        <Image src={dataUse.img} alt="個人頭像" width={50} height={50}/>
                        <div>
                            <h2>歡迎 {dataUse.level} :{dataUse.name}</h2>
                            <h2 className={`${Style.disable} ${Style.minWord}`}>id:{dataUse.id}</h2>
                        </div>
                    </div>
                    {dataUse.level === "管理者" ? <>
                        <button type="button" onClick={()=>{router.push("/selfdata/editBlog")}}>編輯文章</button>
                        <button type="button" onClick={() =>{router.push('/selfdata/editAuth')}}>編輯帳號</button>
                    </>:null}
                    <button>相關留言</button>
                    <button type = "button" onClick={()=>{setReprovideDiv(true)}}>刪除帳號</button>
                    <div className={`${reprovideDiv === true ? Style.secProvide : Style.hidden}`}>
                        <div className={`${Style.provide}`}>
                            <button type="button" className={Style.headerClose} onClick={()=>{ closeProvideDiv()}}>X</button>
                            <h2>請再次輸入密碼</h2>
                            <input type="text" value={reprovidePassword} onChange = {(e)=>{checkInputReprovidePassword(e)}} placeholder=" "></input>
                            <span className={`${reprovideError === "" ? Style.hidden : Style.error}`}>{reprovideError}</span>
                            <button type = "button" onClick={()=>{secProvide()}} >確認</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}