"use client";

import { useState, useEffect } from 'react';
import Style from '@/style/editBlog.module.scss';

import { Auth } from '@/lib/firebaseAuth';
import { onAuthStateChanged } from 'firebase/auth';
import databaseSet from '@/lib/databaseSet';
import  databaseUpdate  from '@/lib/databaseUpdate';

import { useSearchParams } from 'next/navigation';

import { markDownChange } from '@/lib/markDownChange';



type blogData = {
    title:string,
    method:"Blog" | "Project",
    userID:string,
    creatTime:String,
    EditTime:String,
    content:string,
    complete:boolean
}
// 轉換日期格式
const formatter = new Intl.DateTimeFormat('zh-Tw',{
    year:"numeric",
    month:"2-digit",
    day:"2-digit",
    hour:"2-digit",
    minute:"2-digit",
    hour12:false
})

export default function editBlog(){
    const searchParams = useSearchParams();

    const [editdata , setEditData] = useState<blogData>({
        title:"",
        method:"Blog",
        userID:"",
        creatTime: formatter.format(new Date()),
        EditTime:formatter.format(new Date()),
        content:"",
        complete:false
    })
    // 展示成果    
    const [showText,setShowText] = useState<string>("");
    // 展示結果類型 true = 展示blog呈現 false = 展示htmlCode
    const [showMode, setShowMode] = useState<boolean>(false);
    // 是否編輯過 ture = 修改過，有些就不會再上傳
    const [ editComplete, setEditComplete] = useState<boolean>(false);
    const [blogId , setBlogId] = useState<string>("");
    // 資料改變的時候 刷新展示內容
    useEffect(()=>{
        const changeText = async() =>{
            const newText:string = await markDownChange(editdata.content);
            setShowText(newText);
        }
        changeText();
    },[editdata?.content])

    // 初始化 如果有抓到ID 則代表是第二次修改 內容將鎖定
    useEffect(()=>{
        const id = searchParams.get("id");
        if(id){
            console.log(`id = ${id}`);
            setEditComplete(true);
            setBlogId(id);
        }
        const unsub = onAuthStateChanged(Auth,(user)=>{
            if(user){
                setEditData((index)=>{
                    return({
                        ...index,
                        userID:user.uid,
                    })
                })
            }
        })
        return (()=>{
            unsub();
        })
    },[]);
    

    // 轉換成blog格式
    const NewHtml = () =>{
        if(showMode){
            return(
                <article className={Style.showDiv}>
                    <header className={`${Style.titleDiv}`}>
                        <h1>標題:{editdata.title}</h1>
                        <div className={`${Style.blogTimeDiv}`}>
                            <span>建立時間:{`${editdata.creatTime}`}</span>
                            <span>最後編輯時間:{`${editdata.EditTime}`}</span>
                        </div>
                    </header>
                    <section>
                        <div dangerouslySetInnerHTML={{ __html: showText }} className={Style.showDiv} />
                    </section>
                </article>
            )

        }
        return(
            <article className={Style.showDiv}>
                <header className={`${Style.titleDiv}`}>
                    <h1>標題:{editdata.title}</h1>
                    <div className={`${Style.blogTimeDiv}`}>
                        <span>建立時間:{`${editdata.creatTime}`}</span>
                        <span>最後編輯時間:{`${editdata.EditTime}`}</span>
                    </div>
                </header>
                <section>
                    {showText}
                </section>
            </article>
        )
    }
    // 確定是為空的
    const checkData = ():boolean =>{
        let title = editdata.title;
        let titleResult = title.replace(/\s+/g, '');
        if(titleResult === ""){
            return false;
        }
        let content = editdata.content;
        let contentResult = content.replace(/\s+/g, '');
        if(contentResult === ""){
            return false;
        }
        let id = editdata.userID;
        let idResult = id.replace(/\s+/g, '');
        if(idResult === ""){
            return false;
        }
        return true;
    }

    // 建立 
    const createBlog = () =>{
        const check = checkData();
        if(check === false){
            return;
        }

        if(editComplete){
            const inputData = {
                editTime:formatter.format(new Date()),
                content:editdata.content,
                complete:true
            }
            databaseUpdate(editdata.method, blogId, inputData);
        }else{
            const inputData = {
                title:editdata.title,
                userId:editdata.userID,
                creatTime:formatter.format(new Date()),
                editTime:formatter.format(new Date()),
                content:editdata.content,
                complete:true
            }
            databaseSet(editdata.method, inputData);
        }
        
    }
    // 保存
    const saveBlog = () =>{
        const check = checkData();
        if(check === false){
            return;
        }
        if(editComplete){
            const inputData = {
                editTime:formatter.format(new Date()),
                content:editdata.content,
                complete:false
            }
            databaseUpdate(editdata.method, blogId, inputData);
        }else{
            const inputData = {
                title:editdata.title,
                userId:editdata.userID,
                creatTime:formatter.format(new Date()),
                editTime:formatter.format(new Date()),
                content:editdata.content,
                complete:false
            }
            databaseSet(editdata.method, inputData);
        }
    }

    return(
    <main className={`${Style.main}`}>
        <div className={`${Style.editerArea}`}>
            <div className={`${Style.editer}`}>
                <h2>編輯markDown</h2>
                <div className={`${Style.otherSetDiv}`}>
                    <div>
                        <label>標題:</label>
                        <input onChange={(e)=>{setEditData((index)=>{
                            return({
                                ...index,
                                title:e.target.value,
                            })
                        })} }></input>
                    </div>
                    <select value={editdata.method} disabled={editComplete} onChange={(e)=>{setEditData((index)=>{
                        return({
                            ...index,
                            method:e.target.value as "Blog" | "Project",
                        })
                    })}}>
                        <option value="Blog">Blog</option>
                        <option value="Project">Project</option>
                    </select>
                    <div className={`${Style.changeMode}`}>
                        <span>code</span>
                        <span className={`${Style.silderMove} ${showMode? Style.silderMoveCode :""}`} onClick={()=>{
                            setShowMode(index=>{return(!index)})
                        }}></span>
                        <span>成果</span>
                    </div>
                </div>
                
                <textarea className={`${Style.textareaBox}`} onChange={(e)=>{
                    setEditData((index)=>{
                        return({
                            ...index,
                            content:e.target.value 
                        })
                    })
                    }}></textarea>
            </div>
            <div className={`${Style.show}`}>
                <h2>展示結果</h2>
                <NewHtml />
            </div>
        </div>
        <div className={`${Style.buttonDiv}`}>
            <button type = 'button' onClick={()=>{createBlog()}}>提交</button>
            <button type = "button" onClick={()=>{saveBlog()}}>儲存</button>
        </div>
    </main>)
    
}