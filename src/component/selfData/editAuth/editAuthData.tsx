"use client";

import { useState, useEffect } from "react";

import Style from "@/style/selfData/editAuth/editAuthData.module.scss";

type blogMessageDataType ={
    BlogTilte:string,
    BlogId:string,
    method:"Project" | "Blog",
    MessageId:string[],
}
type usersDataType ={
    id:string,
    email:string,
    level:string,
    blogMessage:blogMessageDataType[],
}
type AuthDataProps = {
    authDataList:usersDataType;
    onAuthDataList:( value :usersDataType )=>void;
    openState:boolean
    onOpenState:(value:boolean) => void;
}

export function EditAuthData({authDataList, onAuthDataList, openState, onOpenState}:AuthDataProps){
    const [authData, setAuthData ] = useState<usersDataType> (authDataList);

    // 抓取最新的資料
    useEffect(()=>{
        setAuthData(authDataList);
    },[authDataList])

    return(
    <div className={`${Style.editAuthDataBackground}  ${openState === false ?Style.editHidden:""}` } >
        <div className={Style.editAuthDataDiv}>
            <div className={`${Style.editAuthDataShowDiv}`}>
                <div>
                    <p>id:{authData.id}</p>
                </div>
                <div>
                    <p>email:{authData.email}</p>
                </div>
                <div >
                    <p>權限:{authData.level === "AilaEditer" ? "管理員" : "訪客"}</p>
                </div>
                <div>
                    <p>留言內容:</p>
                    {authData.blogMessage.length === 0?<p>無任何留言</p>:
                    authData.blogMessage.map((index:any)=>{
                        return(
                            <div key={index.BlogId}>
                                <p key={index.BlogId}>{index.BlogTilte} 有{index.MessageId.length}篇留言</p>
                            </div>   
                        )
                    })}
                </div>
            </div>
            <div className={Style.editAuthDataButtonDiv}>
                <button type="button" onClick={()=>{onOpenState(false)}}>確定</button>
                <button type="button" onClick={()=>{onOpenState(false)}}>取消</button>
            </div>
        </div>
    </div>)
}