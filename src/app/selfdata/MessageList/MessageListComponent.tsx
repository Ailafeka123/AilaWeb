"use client";

import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Style from '@/style/selfData/messageList/messageListComponent.module.scss';
import { Auth } from '@/lib/firebaseAuth';
import { onAuthStateChanged } from 'firebase/auth';
import databaseGet from '@/lib/databaseGet';

type MessageType = {
    BlogTitle:string,
    BlogID:string,
    method:"Project" | "Blog",
    MessageID:string[],
}

export default function messageListComponent(){
    // 轉跳
    const router = useRouter();
    // 抓取 [登入狀態,ID]
    const [loginState,setLoginState] = useState<[boolean,string]>([false,""]);
    // 抓取 留言訊息 [抓取完成,資料]
    const [messageListData, setMessageListData] = useState<[boolean,MessageType[]]>([false,[]]);

    // 監聽登入狀態，抓取到時切換loginState並抓取ID
    useEffect(()=>{
        const unsub = onAuthStateChanged(Auth,(user)=>{
            if(user){
                console.log(user.uid);
                setLoginState([true,user.uid]);
            }
        })
        return ()=>{
            unsub();
        }
    },[])
    // 有登入的情況 抓取留言訊息
    useEffect(()=>{
        if(loginState[0] === false) return;
        const getAuthData = async()=>{
            const AuthData = await databaseGet("Auth",loginState[1]);
            if(AuthData){
                if(AuthData.blogMessage.length === 0){
                    setMessageListData([true,[]]);
                }else{
                    
                    let dataList:MessageType[] = []
                    dataList = AuthData.blogMessage.map((item:any)=>{
                        return({
                            BlogTitle:item.BlogTilte,
                            BlogID:item.BlogId,
                            method:item.BlogMethod,
                            MessageID:item.MessageId,
                        })
                    })
                    setMessageListData([true,dataList])

                }
                
            }else{
                
            }
        }
        getAuthData();
    },[loginState[0]])
    // 抓到資料後呈現
    const MessageListDataShow = () =>{
        if(messageListData[1].length === 0){
            if(messageListData[0] === false){
                return(
                    <div className={`${Style.messageListShowDiv} ${Style.loaddingDiv}`}>
                        <p>
                            <span>資</span>
                            <span>料</span>
                            <span>讀</span>
                            <span>取</span>
                            <span>中</span>
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </p>
                    </div>
                )
            }else{
                return(
                <div className={`${Style.messageListShowDiv}`}>
                    <p>暫無資料，歡迎去各文章底下的留言區留言</p>
                </div>
                )
            }
        }
        const temp = messageListData[1].map((item:MessageType)=>{
            const path = item.method === "Blog"? `/blogdata/blogShow?id=${item.BlogID}`:`/project/projectShow?id=${item.BlogID}`
            return(
                <div className={Style.messageListDataCard} key={`card-${item.BlogID}`} onClick={()=>{router.push(path)}}>
                    <div className={Style.messageListDataCardTitle}>
                        <p>{item.BlogTitle}</p>
                    </div>
                    <div className={Style.messageListDataCardContent}>
                        <p>類型:{item.method === "Blog"?"文章":"作品"}</p>
                        <p>{`相關留言共${item.MessageID.length}篇`}</p>
                    </div>
                </div>
            )
        })
        console.log(messageListData[1])
        return (
            <div className={`${Style.messageListShowDiv}`}>
                {temp}
            </div>
        )
    }



    return (
        <>
            <h2>目前留言訊息資訊</h2>
            <p>點擊前往訊息</p>
            <MessageListDataShow/>
        </>
    )
}