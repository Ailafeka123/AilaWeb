"use client";

import { useState } from "react";

import Style from "@/style/selfData/editAuth/editAuthData.module.scss";

type blogMessageDataType ={
    BlogTitle:string,
    BlogID:string,
    method:"Project" | "Blog",
    MessageID:string[],
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

    return(
    <div className={`${Style.editAuthDataBackground}  ${openState === false ?Style.editHidden:""}` } >
        <div className={Style.editAuthDataDiv}>
            <div className={Style.editAuthDataButtonDiv}>
                <button type="button" onClick={()=>{onOpenState(false)}}>確定</button>
                <button type="button" onClick={()=>{onOpenState(false)}}>取消</button>
            </div>
        </div>
    </div>)
}