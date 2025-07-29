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


import AlterComponent from "./alterComponent";
// 抓取該篇文章的blogID， 要查詢blog 還是 project
type MessageProps ={
    blogId:string,
    method:"Blog"|"Project",
    blogTitle:string,
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
    BlogMethod:"Blog"|"Project",
    BlogTilte:string,
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
export default function Message({blogId,method,blogTitle}:MessageProps){
    // 轉跳
    const router = useRouter();
    // 是否再登入狀號
    const [loginState,setLoginState] = useState<boolean>(false);
    // 暫存帳號blog清單
    const [blogListTemp,setBlogListTemp] = useState<blogListMessage[]>([])
    // 準備留言將傳輸的資料
    const [blogMessageData,setBlogMessageData] = useState<blogMessageData>({
        id:"",
        email:"",
        content:"",
        creatTime:"",
        editTime:"",
        level:"guest"
    })
    // blog有哪些留言
    const [blogMessageListData,setBlogMessageListData] = useState<blogMessageListData[]>([]);
    // 進行留言動作的冷卻
    const [blogMessageActive,setBlogMessageActive] = useState<boolean>(false);


    // 修改內容表單是否開啟
    const [editDivOpen, setEditDivOpen] = useState<boolean>(false);
    // 修改內容 id , content
    const [editText,setEditText] = useState<[string,string]>(["",""]);
    // 修改冷卻
    const [editColdDown,setEditColdDown] = useState<boolean>(false);

    // 刪除確認 以及Id
    const [deleteDivOpen,setDeleteDivOpen] = useState<[boolean,string]>([false,""]);
    // 刪除冷卻
    const [deleteColdDown,setDeleteColdDown] = useState<boolean>(false);

    // 動作提示框 [是否開啟,訊息]
    const [alterState, setAlterState] = useState<[boolean,string]>([false,""]);

    // 初始化 抓取id email 以及對應的blogList
    useEffect(()=>{
        const unSub =  onAuthStateChanged(Auth,(user)=>{
            if(user){
                setLoginState(true);
                (async () =>{
                    const data = await databaseGet("Auth",user.uid);
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
                    editTime:row.editTime,
                    editState: false
                }
                dataList.push(rowData);
            })
            setBlogMessageListData(dataList);
        }
        getMessageData();

    },[blogId])

    // 進行判斷 如果id相同 則代表是自己的留言，可以進行編輯 最後進行展示
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
        let temp :React.ReactNode[] = [] ;
        newData.forEach((index,key)=>{
            if(index.content === ""){
                temp.push(
                <div key= {key} className={Style.messageListCard}>
                    <div className={Style.messageListCardHeader}>
                        <p className={Style.messageListCardUser} ><span>用戶:未知</span><span className={Style.messageListCardTimespan}>{index.creatTime}</span></p>
                    </div>
                    <div className={Style.messageListCardContent}>
                        <p>該留言已被刪除</p>
                    </div>
                </div>)
            }else{
                temp.push(
                <div key={key} className={Style.messageListCard}>
                    <div className={Style.messageListCardHeader}>
                        <p className={Style.messageListCardUser}>
                            <span>用戶:</span><span>{index.id}</span>
                            <span className={Style.messageListCardTimespan}>{index.creatTime}{index.editTime === index.creatTime? ``:`(已修改)`}</span></p>
                        {index.editState&&
                        <div className={Style.messageListCardEditDiv}>
                            <button className={Style.messageListCardEditButton} onClick={()=>{
                                setEditDivOpen(true);
                                setEditText([index.messageId,index.content]);
                            }}>修改</button>
                            <button className={Style.messageListCardDeleteButton} onClick={()=>{setDeleteDivOpen([true,index.messageId])}}>刪除</button>
                        </div>}
                    </div>
                    <div className={Style.messageListCardContent}>
                        <p>
                            {index.content}
                        </p>
                    </div>
                </div>)
            }
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
    // 留言動作冷卻
    useEffect(()=>{
        if(blogMessageActive === false)return;
        // 確認送出資料
        // 先進行檢查
        if(blogMessageData.content.trim() === ""){
            setAlterState([true,"留言內容不得為空"])
            setBlogMessageData(index=>{
                return({
                    ...index,
                    content:"",
                })
            })
            setBlogMessageActive(false);
            return;
        }
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
                console.error("更新錯誤 沒有ID回傳");
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
                        BlogMethod:index.BlogMethod,
                        BlogTilte:index.BlogTilte,
                        MessageId : filterBlogMessageList
                    }
                }else{
                    return index;
                }
            })
            if(findId === false){
                blogList.push({BlogId:blogId,
                    BlogMethod:method,
                    BlogTilte:blogTitle,
                    MessageId:[MessageId]});
            }
            // 更新帳號訊息
            await databaseUpdate("Auth",blogMessageData.id,{blogMessage:blogList,level:blogMessageData.level});
            // 重新讀取資料刷新。
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
                        editTime:row.editTime,
                        editState: false
                    }
                    dataList.push(rowData);
                })
                setBlogMessageListData(dataList);
            }
            getMessageData();
            // 更新本地blogList與更新抓取到的最新留言(避免同時有其他人留言)
            setBlogListTemp(blogList)
            setBlogMessageData(index=>{
                return ({
                    ...index,
                    content:"",
                })
            })
            // 跳出提示框 表示確認
            setAlterState([true,"留言成功"])
        }
        submitMessage();
        setBlogMessageActive(false);
    },[blogMessageActive])
    
    // 修改冷卻
    useEffect(()=>{
        if(editColdDown === false) return;
        if(editText[1].trim() === ""){
            setAlterState([true,"修改內容不可為空"]);
            setEditColdDown(false);
            return;
        }
        // 更新內容
        const updateMessage = async()=>{
            const deleteMessage = {
                content:editText[1],
                editTime:formatter.format(new Date()),
                userId:blogMessageData.id,
                BlogID:blogId,
            }
            await databaseUpdate("BlogMessage",editText[0],deleteMessage);
        }
        // 重新讀取資料刷新。
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
                    editTime:row.editTime,
                    editState: false
                }
                dataList.push(rowData);
            })
            setBlogMessageListData(dataList);
        }
        updateMessage();
        getMessageData();
        setAlterState([true,"更新成功"])
        setEditDivOpen(false);
        setEditText(["",""]);
        setEditColdDown(false);
    },[editColdDown])


    // 刪除資料冷卻
    useEffect(()=>{
        if(deleteColdDown  === false) return;
        // 刪除資料
        const deleteMessage = async() =>{
            // 進行過濾 準備要更新auth的文章
            let filterList = [];
            // 是否有找到對應id
            let check = false;
            for(let idRow = 0 ; idRow < blogListTemp.length ; idRow++){
                if(blogId === blogListTemp[idRow].BlogId){
                    let newMessageList : string[] = [];
                    for(let messageListRow = 0 ; messageListRow < blogListTemp[idRow].MessageId.length ; messageListRow++){
                        if(blogListTemp[idRow].MessageId[messageListRow] === deleteDivOpen[1]){
                            check = true;
                        }else{
                            newMessageList.push(blogListTemp[idRow].MessageId[messageListRow]);
                        }
                    }

                    if(newMessageList.length === 0)continue;
                    filterList.push({
                        BlogId:blogListTemp[idRow].BlogId,
                        BlogMethod:blogListTemp[idRow].BlogMethod,
                        BlogTilte:blogListTemp[idRow].BlogTilte,
                        MessageId:newMessageList,
                    })
                }else{
                    filterList.push(blogListTemp[idRow]);
                }
            }
            if(check === false){
                setAlterState([true,"此帳號無此留言權限"]);
                return
            }
            await databaseUpdate("Auth", blogMessageData.id ,{blogMessage:filterList,level:blogMessageData.level});
            const deleteMessage = {
                content:"",
                editTime:formatter.format(new Date()),
                userId:blogMessageData.id,
                BlogID:blogId,
            }
            await databaseUpdate("BlogMessage",deleteDivOpen[1],deleteMessage);
            // 重新讀取資料刷新。
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
                        editTime:row.editTime,
                        editState: false
                    }
                    dataList.push(rowData);
                })
                setBlogMessageListData(dataList);
            }
            getMessageData();
            // 同樣更新本地內容與抓取最新內容
            setBlogListTemp(filterList);
            setBlogMessageData(index=>{
                return ({
                    ...index,
                    content:"",
                })
            })
            setDeleteDivOpen([false,""]);
            setAlterState([true,"刪除完成"]);
        }
        deleteMessage();
        setDeleteColdDown(false);
    },[deleteColdDown])

    


    return(
        <>
            {DataListShow}
            <div className={Style.messageBox}>
                <div className={Style.messageHead}>
                    <p>使用者:{`${blogMessageData?.email}`}</p>
                    <p className={Style.messageWelcome}><span>歡迎用戶:</span><span>{`${blogMessageData?.id}`}</span><span>進行留言</span></p>
                </div>
                <textarea name="" id="" value={blogMessageData.content} className={Style.messageTextarea} onChange={(e)=>{setBlogMessageData(index=>{
                    return({
                        ...index,
                        content:e.target.value,
                    })
                })}}></textarea>


                <div className={Style.messageFooter}>
                    <button type="button" onClick={()=>{
                        setBlogMessageActive(true);
                        }}>留言</button>
                </div>

                <div className={`${Style.nonLoginDiv} ${loginState === true&&Style.loginHidden}`}>
                    <p>請先登入</p>
                </div>
            </div>

            <div className={`${Style.deleteCheckDivBackground} ${deleteDivOpen[0] === false? Style.deleteCheckDivBackgroundHidden :""}`}>
                <div className={  `${Style.deleteCheckDiv} `}>
                    <div className={Style.deleteCheckDivText}>
                        <p>請問是否確認要刪除?</p>
                        <p>訊息將無法復原</p>
                    </div>
                    <div className={`${Style.deleteCheckButtonDiv}`}>
                        <button type="button" className={Style.deleteCheckDivDeleteButton} onClick={()=>{setDeleteColdDown(true)}}>確認</button>
                        <button type="button" className={Style.deleteCheckDivConfirmButton} onClick={()=>{setDeleteDivOpen([false,""])}}>取消</button>
                    </div>
                </div>
            </div>

            <div className={`${Style.editDivBackground} ${ editDivOpen === false ? Style.editDivBackgroundHidden:""}`}>
                <div className={`${Style.editDiv}`}>
                    <div className={`${Style.editTitle}`}>
                        <p>修改內容</p>
                    </div>
                    <textarea className={Style.editInputText} value={editText[1]} onChange={(e)=>{setEditText(index=>{
                        return[index[0],e.target.value]
                    })}}>
                    </textarea>
                    <div className={Style.editButtonDiv}>
                        <button type="button" onClick={()=>{setEditColdDown(true)}}>確認</button>
                        <button type="button" onClick={()=>{
                            setEditDivOpen(false);
                            setEditText(["",""]);
                            }}>取消</button>
                    </div>
                </div>
            </div>
            
            <AlterComponent openState={alterState[0]} onOpenState={setAlterState} alterMessage={alterState[1]}/>
        </>
    )
}