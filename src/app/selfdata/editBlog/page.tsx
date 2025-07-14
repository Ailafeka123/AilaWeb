"use client";

import { useState, useEffect,Suspense } from 'react';
import Style from '@/style/editBlog.module.scss';

import { Auth } from '@/lib/firebaseAuth';
import { onAuthStateChanged } from 'firebase/auth';
import databaseGet from '@/lib/databaseGet';
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
    complete:boolean,
    category:string[],
    searchKey:string[]
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

function SearchId( {onChangeId} : { onChangeId : (value:["Blog"|"Project", string]) => void  } ){
    const searchParams = useSearchParams();
    const idValue = searchParams.get("id");
    const method = searchParams.get("mod")
    if(method !== "Blog" && method !== "Project"){
        return;
    }
    useEffect(()=>{
        if(idValue && method){
            onChangeId([method,idValue]);
        }
    },[searchParams])

    if(idValue && method){
        return <div>{`id : ${idValue}`}</div>
    }else{
        return <></>
    }
}

export default function editBlog(){
    

    const [editdata , setEditData] = useState<blogData>({
        title:"",
        method:"Blog",
        userID:"",
        creatTime: formatter.format(new Date()),
        EditTime:formatter.format(new Date()),
        content:"",
        complete:false,
        category:[],
        searchKey:[]
    })
    // 展示成果    
    const [showText,setShowText] = useState<string>("");
    // 展示結果類型 true = 展示blog呈現 false = 展示htmlCode
    const [showMode, setShowMode] = useState<boolean>(false);
    // 是否編輯過 ture = 修改過，有些就不會再上傳
    const [ editComplete, setEditComplete] = useState<boolean>(false);
    // 第一個為method 第二個為id
    const [blogId , setBlogId] = useState<["Blog"|"Project",string]>(["Blog",""]);
    // category 設定
    const [categoryInput, setCategoryInput] = useState<string>("");

    // 資料改變的時候 刷新展示內容
    useEffect(()=>{
        const changeText = async() =>{
            const newText:string = await markDownChange(editdata.content);
            setShowText(newText);
        }
        changeText();
    },[editdata?.content])

    // 初始化 抓取Auth的id 
    useEffect(()=>{
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
    // 讀取參數修改模式 讀取成功的情況並尋找檔案。
    useEffect(()=>{
        if(blogId[0] && blogId[1]){
            const getDate = async()=>{
                const data = await databaseGet(blogId[0],blogId[1]);
                if(data){
                    setEditData((index)=>{
                        return({
                            ...index,
                            title:data.title,
                            method:blogId[0],
                            content:data.content,
                            creatTime:data.creatTime,
                        })
                    })
                    setEditComplete(true);
                }
            }
            getDate();
        }
    },[blogId])

    const creatSearchFunction = ():string[] =>{
        const newString = [...editdata.category,editdata.title].join(" ");
        const newSearchKey = newString.toLowerCase().split(/[\s,.;]+/);
        return newSearchKey;
    }


    // 轉換成blog格式
    const NewHtml = () =>{
        const categoryString =  editdata.category.map((index,key)=>{
            return(<span key = {key}>{index}</span>);
        })
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
                    <div>{categoryString}</div>
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
                <div>分類:{categoryString}</div>
            </article>
        )
    }
    // 展示分類List
    const CategoryListDivShow = () =>{
        const categoryList = editdata.category.map((index,key)=>{
            return(<span key = {key} onClick={(e)=>{
                const newList : string[] = editdata.category;
                newList.splice(key,1);
                setEditData(index=>{
                    return({
                        ...index,
                        category:newList,
                    });
                });
            }}>{index}</span>)
        })
        return(
        <div className={Style.categoryListDiv}>
            {categoryList}
        </div>)
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
        const SearchKeyIndex :string[] = creatSearchFunction();
        if(editComplete){
            const inputData = {
                editTime:formatter.format(new Date()),
                content:editdata.content,
                complete:true,
                category:editdata.category,
                searchKey:SearchKeyIndex
            }
            databaseUpdate(editdata.method, blogId[1], inputData);
        }else{
            const inputData = {
                title:editdata.title,
                userId:editdata.userID,
                creatTime:formatter.format(new Date()),
                editTime:formatter.format(new Date()),
                content:editdata.content,
                complete:true,
                category:editdata.category,
                searchKey:SearchKeyIndex
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
        const SearchKeyIndex :string[] = creatSearchFunction();
        if(editComplete){
            const inputData = {
                editTime:formatter.format(new Date()),
                content:editdata.content,
                complete:false,
                category:editdata.category,
                searchKey:SearchKeyIndex
            }
            databaseUpdate(editdata.method, blogId[1], inputData);
        }else{
            const inputData = {
                title:editdata.title,
                userId:editdata.userID,
                creatTime:formatter.format(new Date()),
                editTime:formatter.format(new Date()),
                content:editdata.content,
                complete:false,
                category:editdata.category,
                searchKey:SearchKeyIndex
            }
            databaseSet(editdata.method, inputData);
        }
    }

    return(
    <main className={`${Style.main}`}>
        <div className={`${Style.editerArea}`}>
            <div className={`${Style.editer}`}>
                <div className={Style.headerSet}>
                    <h2>編輯markDown</h2>
                    <Suspense>
                        <SearchId onChangeId={setBlogId}></SearchId>
                    </Suspense>
                </div>

                <div className={`${Style.otherSetDiv}`}>
                    <div>
                        <label>標題:</label>
                        <input disabled={editComplete} value={editdata.title} onChange={(e)=>{setEditData((index)=>{
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
                
                <textarea className={`${Style.textareaBox}`} value={editdata.content} onChange={(e)=>{
                    setEditData((index)=>{
                        return({
                            ...index,
                            content:e.target.value 
                        })
                    })
                    }}></textarea>
                <CategoryListDivShow/>
                <div className={`${Style.categoryDiv}`}>
                    <label>category:</label>
                    <input type="text" value={categoryInput} onChange={(e)=>{
                        setCategoryInput(e.target.value);
                    }}></input>
                    <button type='button' onClick={()=>{
                        const categoryList : string[] = editdata.category;
                        categoryList.push(categoryInput);
                        setEditData((index)=>{
                            return({
                                ...index,
                                category:categoryList,
                            })
                        })
                        setCategoryInput("")}}>送出種類</button>
                </div>
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
    </main>
    )
    
}