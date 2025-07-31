"use client";

import { useState, useEffect, useMemo } from "react";

import { Auth } from "@/lib/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";

import { db } from "@/lib/database";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

import Style from "@/style/selfData/editAuth/editAuthComponent.module.scss";

import { EditAuthData } from "@/component/selfData/editAuth/editAuthData";

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

export function EditAuthComponent(){
    // 登入狀態
    const [loginState, setLoginState] = useState<[Boolean,string]> ([false,""]);

    // 抓取除了自己的帳號資訊
    const [usersDataList , setUsersDataList] = useState<usersDataType[]>([]);
    
    // 排序
    const [sortMethod, setSortMethod] = useState<["email","asc"|"desc"]>(["email","desc"])
    
    // 修改Auth內容 
    const [editData,setEditData] = useState<usersDataType>({
        id:"",
        email:"",
        level:"",
        blogMessage:[],
    })

    // 是否開啟修改Auth內容
    const [editDivState, setEditDivState] = useState<boolean>(false);


    // 進行登入抓取
    useEffect(()=>{
        const unsub = onAuthStateChanged(Auth,(user)=>{
            if(user){
                setLoginState([true,user.uid])
            }
        })

        return ()=>{
            unsub();
        }

    },[])
    // 有登入狀態的情況 去抓取資料
    useEffect(()=>{
        if(loginState[0] === false) return;
        const getAuthData = async() =>{
            const q = query( collection(db,"Auth"),orderBy(sortMethod[0],sortMethod[1]) );
            const data = await getDocs(q);
            let temp : usersDataType[] = [];
            data.forEach(row=>{
                const rowData = row.data();
                const tempData : usersDataType = {
                    id:row.id,
                    email:rowData.email,
                    level:rowData.level,
                    blogMessage:rowData.blogMessage
                }
                temp.push(tempData);
            })
            setUsersDataList(temp);
        }
        getAuthData();

    },[loginState[0]])

    useEffect(()=>{
        if(usersDataList.length === 0) return;
        console.log(usersDataList);
    },[usersDataList])

    const UsersListDataShow = () =>{
        const temp = useMemo(()=>{
            let data = [...usersDataList];
            if(sortMethod[1] === "desc"){
                data.sort((a,b)=> String(a[sortMethod[0]]).localeCompare(String(b[sortMethod[0]])) );
            }else{
                data.sort((a,b)=> String(b[sortMethod[0]]).localeCompare(String(a[sortMethod[0]])) );
            }
            return data;
        },[usersDataList,sortMethod])
        if(temp.length === 0){
            return(<div>
                <h3>讀取中...請稍等片刻</h3>
            </div>)
        }
        const tempListShow = temp.map((index:any)=>{
            return (
                <article className={Style.usersListDataCard} key={index.id}>
                    <span>{index.id}</span>
                    <span>{index.email}</span>
                    <span>{index.level === "AilaEditer" ? "管理員" : "訪客"}</span>
                    <span>{index.blogMessage.length}</span>
                    <div>
                        <button type="button" className={Style.clickButton} onClick={()=>{
                        setEditData({
                            id:index.id,
                            email:index.email,
                            level:index.level,
                            blogMessage:index.blogMessage,
                        })
                        setEditDivState(true);
                        }}>修改</button>
                        <button type="button" className={Style.deleteButton}>
                            刪除
                        </button>
                    </div>
                </article>
            )
        })

        return(
            <section className={Style.usersListDataCardDiv}>
                <header className={Style.userListDataCardTitle}>
                    <span>ID</span>
                    <span>信箱</span>
                    <span>權限</span>
                    <span>留言數</span>
                    <span>修改</span>
                </header>
                {tempListShow}
            </section>
        )
    }


    return (
        <>
            <UsersListDataShow/>
            <EditAuthData authDataList={editData} onAuthDataList={setEditData} openState={editDivState} onOpenState={setEditDivState}/>
        </>
    )
}