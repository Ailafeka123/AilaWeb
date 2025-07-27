"use client"

import { useState,useEffect,useMemo } from "react"

import { useRouter } from "next/navigation";
import Style from "@/style/Message.module.scss";

// 抓帳號 與帳號資訊
import { Auth } from "@/lib/firebaseAuth"
import { onAuthStateChanged } from "firebase/auth";
import databaseGet from "@/lib/databaseGet";
import databaseSet from "@/lib/databaseSet";
import databaseUpdate from "@/lib/databaseUpdate";
// 查詢其他訊息
import { db } from "@/lib/database";
import { collection, query, where, getDocs, orderBy} from "firebase/firestore";
// 抓取該篇文章的blogID， 要查詢blog 還是 project
type MessageProps ={
    blogId:string,
    method:"Blog"|"Project"
}
// 傳入資料 
type blogMessageData = {
    id:string,
    email:string,
    content:string,
    creatTime:string,
    editTime:string,
    level:string,
}

// 使用者帳戶的留言資訊
type blogListMessage = {
    BlogId:string,
    MessageId:string[],
}

// 訊息編號，帳號編號，內容，建立時間，編輯時間，是否有資格編輯
type blogMessageListData = {
    messageId : string,
    id:string,
    content:string,
    creatTime:string,
    editTime:string,
    editState:boolean
}


// 統一轉換日期格式
const formatter = new Intl.DateTimeFormat('zh-Tw',{
    year:"numeric",
    month:"2-digit",
    day:"2-digit",
    hour:"2-digit",
    minute:"2-digit",
    hour12:false
})




// 傳入id
export default function Message({blogId,method}:MessageProps){
    // 轉跳
    const router = useRouter();
    // 是否再登入狀號
    const [loginState,setLoginState] = useState<boolean>(false);
    // 暫存清單
    const [blogListTemp,setBlogListTemp] = useState<blogListMessage[]>([])
    // 準備傳輸的資料
    const [blogMessageData,setBlogMessageData] = useState<blogMessageData>({
        id:"",
        email:"",
        content:"",
        creatTime:"",
        editTime:"",
        level:"guest"
    })
    const [blogMessageListData,setBlogMessageListData] = useState<blogMessageListData[]>([])



    // 初始化 抓取id email 以及對應的blogList
    useEffect(()=>{
        const unSub =  onAuthStateChanged(Auth,(user)=>{
            if(user){
                setLoginState(true);
                (async () =>{
                    const data = await databaseGet("Auth",user.uid);
                    console.log(data?.blogMessage);
                    if(data?.blogMessage){
                        setBlogListTemp(data.blogMessage)
                    }
                    setBlogMessageData({
                        id:data?.id,
                        email:data?.email,
                        content:"",
                        creatTime:formatter.format(new Date()),
                        editTime:formatter.format(new Date()),
                        level:data?.level,
                    })
                })();
                
            }else{

            }
        }) 
        return ()=>{
            unSub();
        }
    },[])
    // 抓到id的情況 去搜尋回復文章
    useEffect(()=>{
        if(blogId === "")return;
        const getMessageData = async()=>{
            const q  =  query( collection(db,"BlogMessage"), where("BlogID","==",blogId), orderBy("creatTime","desc")  );
            const data = await getDocs(q);
            let dataList : blogMessageListData[] = []
            data.forEach(index=>{
                const row = index.data();
                const rowData : blogMessageListData ={
                    messageId : index.id,
                    id:row.userId,
                    content:row.content,
                    creatTime:row.creatTime,
                    editTime:row.creatTime,
                    editState: false
                }
                dataList.push(rowData);
            })
            setBlogMessageListData(dataList);
        }
        getMessageData();

    },[blogId])


    useEffect(()=>{
        console.log('準備好了blogList');
        console.log(blogMessageListData);
    },[blogMessageListData])

    const DataListShow = useMemo(()=>{
        let newData = [...blogMessageListData];
        newData = newData.map(index=>{
            if(index.id === blogMessageData.id){
                return{
                    ...index,
                    editState:true,
                }
            }
            return index;
        })
        console.log("newData");
        console.log(newData);
        let temp :React.ReactNode[] = [] ;
        newData.forEach((index,key)=>{
            temp.push(
            <div key={key} className={Style.messageListCard}>
                <div className={Style.messageListCardHeader}>
                    <p className={Style.messageListCardUser}><span>用戶:</span><span>{index.id}</span><span className={Style.messageListCardTimespan}>{index.creatTime}{index.editTime === index.creatTime? ``:`(已修改)`}</span></p>
                    {index.editState&&
                    <div className={Style.messageListCardEditDiv}>
                        <button className={Style.messageListCardEditButton}>修改</button>
                        <button className={Style.messageListCardDeleteButton}>刪除</button>
                    </div>}
                </div>
                <div className={Style.messageListCardContent}>
                    {index.content}
                </div>
            </div>)
        })
        return (
            <div className={Style.messageListDiv}>
                <div className={Style.messageListTatal}>
                    {newData.length === 0? "目前有0篇留言":`目前有${newData.length}篇留言`}
                </div>
                {temp}
            </div>
        )
    },[blogMessageListData,blogMessageData.id])


    // 確認送出資料
    const submitMessage = async() =>{
        // 送出資料捕捉id
        const setMessage ={
            userId:blogMessageData.id,
            BlogID:blogId,
            content:blogMessageData.content,
            creatTime:formatter.format(new Date()),
            editTime:formatter.format(new Date()),
        }
        let blogList :blogListMessage[] = [...blogListTemp];

        let filterBlogMessageList : string[] =  [];
        for(let i = 0 ; i < blogListTemp.length ; i++){
            if(blogListTemp[i].BlogId === blogId){
                filterBlogMessageList = blogListTemp[i].MessageId;
                break;
            }
        }
        // 送出後回傳建立的id
        let MessageId :string|null= ""
        MessageId = await databaseSet("BlogMessage",setMessage);
        if(MessageId === "" || MessageId === null){
            console.log("更新錯誤 沒有ID回傳");
            return;
        }
        // 更新帳號所擁有的留言訊息。
        filterBlogMessageList.push(MessageId);
        let findId = false;
        blogList = blogList.map((index:blogListMessage)=>{
            if(index.BlogId === blogId){
                findId = true;
                return {
                    BlogId:index.BlogId,
                    MessageId : filterBlogMessageList
                }
            }else{
                return index;
            }
        })
        if(findId === false){
            blogList.push({BlogId:blogId,MessageId:[MessageId]});
        }
        await databaseUpdate("Auth",blogMessageData.id,{blogMessage:blogList,level:blogMessageData.level});
        router.refresh();
    }

    return(
        <>
            {DataListShow}
            <div className={Style.messageBox}>
                <div className={Style.messageHead}>
                    <p>使用者:{`${blogMessageData?.email}`}</p>
                    <p className={Style.messageWelcome}><span>歡迎用戶:</span><span>{`${blogMessageData?.id}`}</span><span>進行留言</span></p>
                </div>
                <textarea name="" id="" className={Style.messageTextarea} onChange={(e)=>{setBlogMessageData(index=>{
                    return({
                        ...index,
                        content:e.target.value,
                    })
                })}}></textarea>


                <div className={Style.messageFooter}>
                    <button type="button" onClick={()=>{
                        console.log('送出')
                        submitMessage();
                        }}>留言</button>
                </div>

                <div className={`${Style.nonLoginDiv} ${loginState === true&&Style.loginHidden}`}>
                    <p>請先登入</p>
                </div>
            </div>
        </>
    )
}