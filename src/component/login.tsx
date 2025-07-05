"use client";
import { useState,useRef,forwardRef, useEffect  } from "react";
import Style from "@/style/login.module.scss"
import Image from "next/image";
import LoginOrRegister from "@/lib/LoginOrRegister";

type LoginProps = {};
const Login = forwardRef<HTMLDivElement, LoginProps>( (props, ref) => {
    // 帳號
    const [loginAccount,setLoginAccount] = useState<string>("");
    // 密碼 和 是否要看到密碼
    const [loginPassword,setLoginPassword] = useState<string>("");
    const [loginPasswordShow,setLoginPasswordShow] = useState<Boolean>(false);
    const LoginPasswordRef = useRef<HTMLButtonElement|null>(null)
    // 登入或註冊 Login / Register
    const [submitMethod,setSubmitMethod] = useState<"Login"|"Register">("Login");
    // 錯誤訊息
    const [errorMessage,setErrorMessage] = useState<string | null>(null);
    // 資料傳遞冷卻 true = 冷卻完成
    const coldDownCheck = useRef<Boolean>(true); 
    const messageCold = useRef <ReturnType<typeof setTimeout> | null> (null);

    // 設定更改帳號
    const changeLoginAccount = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const allowedChars = /[^A-Za-z0-9@._%+\-!]/g;
        const newWord = e.target.value.replace(allowedChars, "");
        setLoginAccount(newWord);
    }
    // 設定更改密碼
    const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const allowedChars = /[^A-Za-z0-9@._%+\-!]/g;
        const newWord = e.target.value.replace(allowedChars, "");
        setLoginPassword(newWord);
    }
    //眼睛打開時 監聽事件=>點擊非眼睛時關閉 確保安全性
    useEffect(()=>{
        if(loginPasswordShow === true){
            const closeLoginPasswordShow = (e :PointerEvent) =>{
                if(LoginPasswordRef.current && !LoginPasswordRef.current?.contains(e.target as Node)){
                    setLoginPasswordShow(false);
                }
            }
            document.addEventListener('pointerdown', closeLoginPasswordShow);
            return(()=>{
                document.removeEventListener('pointerdown', closeLoginPasswordShow);
            })
        }
    },[loginPasswordShow])

    // 驗證帳號密碼沒有錯誤
    const detest = async(account:string, password : string) =>{
        // 驗證符合信箱格式
        const reg : RegExp  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let AccountCheck = reg.test(account);
        if(AccountCheck === false){
            setErrorMessage("帳號錯誤 請輸入信箱格式");
            return;
        }
        // 確認長度在8~20間
        if(password.length < 8 || password.length > 20){
            setErrorMessage("密碼請輸入8~20字之間");
            return;
        }
        // 至少一個英文 與至少有數字
        const passwordReg : RegExp = /[a-zA-Z]/;
        const passwordReg2 : RegExp = /[0-9]/;
        if(passwordReg.test(password) === false){
            setErrorMessage("密碼請輸入自少一個英文字母");
            return;
        }
        if(passwordReg2.test(password) === false){
            setErrorMessage("密碼請數字英文混用");
            return;
        }
        // 全部通過 以下確認是登入還是註冊。
        console.log("暫且通過 暫時清空error")
        setErrorMessage("")
        // 進行登入
        // await LoginOrRegister(submitMethod,account,password);
        

    }

    return(
        <div ref={ref} className={Style.loginDiv} >
            <form action="" onSubmit={(e)=>{
                e.preventDefault();
                detest(loginAccount,loginPassword);
            }}>
                <h2>{submitMethod === "Login"? "登入": "註冊"}</h2>
                <div className={Style.inputDiv}>
                    <input type="text" onChange={(e)=>{changeLoginAccount(e);}} value={loginAccount} placeholder=" " required></input>
                    <label>帳號(信箱)</label>
                    <button type="button" onClick={(e)=>{setLoginAccount("");}}>清除</button>
                </div>
                <div className={Style.inputDiv}>
                    <input type={loginPasswordShow===true?"text":"password"}  onChange={(e)=>{changePassword(e);}} value={loginPassword} placeholder=" " required></input>
                    <label>密碼</label>
                    <button type="button" ref={LoginPasswordRef} className={Style.eyeButton} onClick={(e)=>{setLoginPasswordShow(!loginPasswordShow)}}>
                        <Image src={loginPasswordShow===true?"eye-show-light.svg":"eye-hidden-light.svg"} alt="eye" width={25} height={25}></Image>
                    </button>
                    <button type="button" onClick={(e)=>{setLoginPassword("");}}>清除</button>
                </div>
                <div className={Style.errorMessageDiv}>
                    {errorMessage &&<span>{errorMessage}</span>}
                </div>

                <div className={Style.buttonDiv}>
                    <button type="submit">提交</button>
                    <button type="button" onClick={(e)=>{
                        setSubmitMethod(index=>{
                            if(index ==="Login"){
                                return "Register"
                            }else{
                                return "Login"
                            }
                        });
                        setLoginAccount("");
                        setLoginPassword("");
                    }}>{submitMethod === "Login" ? "註冊" : "登入"}</button>
                </div>
            </form>
        </div>
    );
})

export default Login;