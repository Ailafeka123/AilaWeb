"use client";
import { useState,useRef,forwardRef, useEffect  } from "react";
import Style from "@/style/login.module.scss"
import Image from "next/image";
import LoginOrRegister from "@/lib/LoginOrRegister";
import AuthForget from "@/lib/AuthForget";


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
    // 註冊資料傳遞冷卻 true = 冷卻完成
    const coldDownCheck = useRef<Boolean>(true); 
    // const messageCold = useRef <ReturnType<typeof setTimeout> | null> (null);

    // 忘記密碼Div false = hidden  true = show
    const [forgetDiv,setForgetDiv] = useState<Boolean>(false);
    // 忘記密碼input
    const [forgetInput,setForgetInput] = useState<string>("");
    // 關於忘記密碼訊息
    const [forgetMessage, setForgetMessage] = useState<string>("");
    // 傳送信箱倒數
    const forgetColdDown = useRef<Boolean>(true);
    const [forgetMailCountDown,setForgetMailCountDown] = useState<number>(0);



    // 設定更改帳號
    const changeLoginAccount = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const allowedChars = /[^A-Za-z0-9@._%+\-!]/g;
        const newWord = e.target.value.replace(allowedChars, "");
        setLoginAccount(newWord);
    }
    // 設定更改密碼
    const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const allowedChars = /[^A-Za-z0-9]/g;
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

    // 輸入忘記密碼的信箱
    const changeForgetPasswordInput = (e : React.ChangeEvent<HTMLInputElement>)=>{
        const allowedChars = /[^A-Za-z0-9@._%+\-!]/g;
        const newWord = e.target.value.replace(allowedChars, "");
        setForgetInput(newWord);
    }
    // 當開啟忘記密碼Div時 關閉資料傳送 
    useEffect(()=>{
        
        if(forgetDiv === true){
            coldDownCheck.current = false;
            
        }else{
            coldDownCheck.current = true;
        }
    },[forgetDiv])

    // 檢查忘記密碼的信箱 是否符合信箱格式 暫定一分鐘冷卻 避免寄送太多驗證訊息
    const forgetDetest = async()=>{
        if(forgetColdDown.current === true){
            forgetColdDown.current = false;
            const reg : RegExp  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let forgetMailDetest = reg.test(forgetInput);
            if(forgetMailDetest === false){
                setForgetMessage("請輸入信箱");
                forgetColdDown.current = true;
                return;
            }else{
                console.log(forgetInput);
                const send :null|string = await AuthForget(forgetInput);
                if(send === null){
                    setForgetMessage("如有註冊，已送出訊息至您的信箱")
                }else{
                    setForgetMessage("發生錯誤，請稍後再試");
                    console.error(send);
                }
            }
            setForgetMailCountDown(60);
        }
    }




    // 可以再次傳送驗證訊息
    useEffect(()=>{
        let countDown:NodeJS.Timeout;
        if(forgetMailCountDown === 0){
            forgetColdDown.current = true;
            setForgetMessage("");
        }else{
            countDown  = setTimeout(()=>{
                setForgetMailCountDown(index=>{
                    return index === 0 ? 0 : index-1;
                })
            },1000)
        }
        return ()=>{clearTimeout(countDown)};
    },[forgetMailCountDown])


    // 驗證帳號密碼沒有錯誤
    const detest = async(account:string, password : string) =>{
        if(coldDownCheck.current === true){
            coldDownCheck.current = false;
             // 驗證符合信箱格式
            const reg : RegExp  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let AccountCheck = reg.test(account);
            if(AccountCheck === false){
                setErrorMessage("帳號錯誤 請輸入信箱格式");
                coldDownCheck.current = true;
                return;
            }
            // 確認長度在8~20間
            if(password.length < 8 || password.length > 20){
                setErrorMessage("密碼請輸入8~20字之間");
                coldDownCheck.current = true;
                return;
            }
            // 至少一個英文 與至少有數字
            const passwordReg : RegExp = /[a-zA-Z]/;
            const passwordReg2 : RegExp = /[0-9]/;
            if(passwordReg.test(password) === false){
                setErrorMessage("密碼請輸入自少一個英文字母");
                coldDownCheck.current = true;
                return;
            }
            if(passwordReg2.test(password) === false){
                setErrorMessage("密碼請數字英文混用");
                coldDownCheck.current = true;
                return;
            }
            // 全部通過 以下確認是登入還是註冊。
            setErrorMessage("");
            // 進行登入
            const LoginState : null|string = await LoginOrRegister(submitMethod,account,password);
            if(LoginState !== null){
                setErrorMessage('帳號密碼錯誤');
            }
            coldDownCheck.current = true;
            return
        }
       
        

    }

    return(
        <div ref={ref} className={Style.loginDiv} >
            <form className={Style.form} onSubmit={(e)=>{
                e.preventDefault();
                if(coldDownCheck.current === true){
                    detest(loginAccount,loginPassword);
                }
            }}>
                <h2>{submitMethod === "Login"? "登入": "註冊"}</h2>

                <div className={Style.inputDiv}>
                    <input type="text" onChange={(e)=>{changeLoginAccount(e);}} value={loginAccount} placeholder=" " required></input>
                    <label>帳號(信箱)</label>
                    <button type="button" onClick={(e)=>{setLoginAccount(""); setErrorMessage("");}}>清除</button>
                </div>

                <div className={Style.passwordDiv}>
                    <div className={Style.inputDiv}>
                        <input type={loginPasswordShow===true?"text":"password"}  onChange={(e)=>{changePassword(e);}} value={loginPassword} placeholder=" " required></input>
                        <label>密碼</label>
                        <button type="button" ref={LoginPasswordRef} className={Style.eyeButton} onClick={(e)=>{setLoginPasswordShow(!loginPasswordShow)}}>
                            <Image src={loginPasswordShow===true?"eye-show-light.svg":"eye-hidden-light.svg"} alt="eye" width={25} height={25}></Image>
                        </button>
                        <button type="button" onClick={(e)=>{setLoginPassword(""); setErrorMessage("");}}>清除</button>
                    </div>
                    <span className={Style.forgetPasswordSpan} onClick={(e)=>{setForgetDiv(true)}}>忘記密碼</span>
                </div>
                

                <div className={`${Style.forgetPasswordDiv} ${forgetDiv?"":Style.forgetPasswordDivHidden}`}>
                    <div className={Style.closeForgetPasswordDiv}><button className={Style.closeForgetPasswordButton} type="button" onClick={()=>{setForgetDiv(false)}}>X</button></div>
                    <h3>請輸入信箱查詢密碼</h3>
                    <div className={Style.inputDiv}>
                        <input value={forgetInput} placeholder=" " onChange={(e)=>{changeForgetPasswordInput(e); }}></input>
                        <label>請輸入信箱</label>
                        <button type="button" onClick={()=>{setForgetInput("");setForgetMessage("")}}>清除</button>
                    </div>
                    {forgetMessage===""? <div className={Style.errorMessageDiv}></div> : <div className={Style.errorMessageDiv}> <span>{forgetMessage}</span></div>}
                    <button type="button" className={`${forgetMailCountDown>0? Style.buttonDisable : ""}`} onClick={(e)=>{forgetDetest();}} disabled={forgetMailCountDown > 0}>{forgetMailCountDown > 0? `請於${forgetMailCountDown}秒後嘗試`:"送出"}</button>
                </div>

                <div className={Style.errorMessageDiv}>
                    {errorMessage &&<span>{errorMessage}</span>}
                </div>
                {/* <a href="https://www.flaticon.com/free-icons/google" title="google icons">Google icons created by Freepik - Flaticon</a> */}
                {/* <a target="_blank" href="https://icons8.com/icon/17949/google">Google</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}
                <div className={Style.buttonDiv}>
                    <button type="submit" disabled={forgetDiv === true}>提交</button>
                    <button type="button" onClick={(e)=>{
                        if(coldDownCheck.current === true){
                            setSubmitMethod(index=>{
                                if(index ==="Login"){
                                    return "Register"
                                }else{
                                    return "Login"
                                }
                            });
                            setLoginAccount("");
                            setLoginPassword("");
                        }
                        
                    }} disabled={forgetDiv === true}>{submitMethod === "Login" ? "註冊" : "登入"}</button>
                </div>
            </form>
        </div>
    );
})

export default Login;