"use client";

import { useState, useEffect, useMemo } from "react";

import { Auth } from "@/lib/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";

import { db } from "@/lib/database";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

import Style from "@/style/selfData/editAuth/editAuthComponent.module.scss";

import { EditAuthData } from "@/component/selfData/editAuth/editAuthData";
import AlterComponent from "@/component/alterComponent";
import { authMessageDelete } from "@/lib/AuthMessageDelete";


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

    // 刪除確認1 [視窗開啟狀態,id]
    const [deleteCheck1, setDeleteCheck1] = useState<[boolean,string]>([false,""]);

    // 刪除確認2 [視窗開啟狀態,id]
    const [deleteCheck2, setDeleteCheck2] = useState<[boolean,string]>([false,""]);

    // 刪除警告提示1
    const [deleteAlterDiv1,setDeleteAlterDiv1] = useState<[boolean,string]> ([false,""]);



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
                    <span>{index.id ===loginState[1]? "使用者":
                    index.level === "AilaEditer" ? "管理員" : "訪客"}</span>
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
                        }}>查看</button>
                        <button type="button" className={Style.deleteButton} onClick={()=>{setDeleteCheck1([true,index.id])}}>
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
    // 刪除帳號的留言
    const deleteAuthMessage = (id:string) =>{
        const deleteAuthData = usersDataList.find(index=>index.id===id);
        const deleteAuth = async()=>{
            if(deleteAuthData){
                const messageClear:boolean = await authMessageDelete(deleteAuthData);
                if(messageClear){
                    setDeleteAlterDiv1([true,"留言刪除成功"])
                }
            }
        }
        deleteAuth();
    }

    return (
        <>
            <UsersListDataShow/>
            <EditAuthData authDataList={editData} onAuthDataList={setEditData} openState={editDivState} onOpenState={setEditDivState}/>

            <div className={`${Style.deleteCheckBackgroundDiv} ${deleteCheck1[0] === false ? Style.deleteCheckHidden:""}`}>
                <div className={`${Style.deleteCheckDiv}`}>
                    <div className={`${Style.deleteCheckTextDiv}`}>
                        <p>是否確定要刪除此帳號留言?</p>
                        <p className={`${Style.errorText}`}>此步驟不可復原</p>
                        <p>id:{deleteCheck1[1]}</p>
                    </div>
                    <div className={`${Style.deleteCheckButtonDiv}`}>
                        <button type="button" className={`${Style.errorButton}`} onClick={()=>{
                            setDeleteCheck2([true,deleteCheck1[1]])
                            setDeleteCheck1([false,""]);
                            }}>確定</button>
                        <button type="button" onClick={()=>{setDeleteCheck1([false,""])}}>取消</button>
                    </div>
                </div>
            </div>

            <div className={`${Style.deleteCheckBackgroundDiv} ${deleteCheck2[0] === false ? Style.deleteCheckHidden:""}`}>
                <div className={`${Style.deleteCheckDiv}`}>
                    <div className={`${Style.deleteCheckTextDiv}`}>
                        <p>真的是否確定要刪除此帳號留言?</p>
                        <p className={`${Style.errorText}`}>此步驟不可復原</p>
                        <p>id:{deleteCheck2[1]}</p>
                    </div>
                    <div className={`${Style.deleteCheckButtonDiv}`}>
                        <button type="button" className={`${Style.errorButton}`} onClick={()=>{
                            deleteAuthMessage(deleteCheck2[1]);
                            setDeleteCheck2([false,""])
                        }}>確定</button>
                        <button type="button" onClick={()=>{setDeleteCheck2([false,""])}}>取消</button>
                    </div>
                </div>
            </div>


            <AlterComponent openState={deleteAlterDiv1[0]} onOpenState={setDeleteAlterDiv1} alterMessage={deleteAlterDiv1[1]}/>
        </>
    )
}