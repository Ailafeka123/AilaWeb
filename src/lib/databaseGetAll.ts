"use client";

import { tree } from "next/dist/build/templates/app-page";
import { db } from "./database";
import { collection, query, where, getDocs, orderBy,limit } from "firebase/firestore";


export async function databaseGetAll(method:string,searchKey:string,orderName:"creatTime",order:"asc"|"desc", editMode:true|false, ):Promise<any>{
    let q ;
    // editMod => true => complete無所謂   false => complete = true
    // return id, category,creatTime,title
    // array-contains 單一符合條件
    // array-contains-any 要輸入string[] 符合


    if(searchKey === ""){
        if(editMode){
            q = query( collection(db,method),orderBy(orderName,order) )
        }else{
            q = query( collection(db,method),where("complete","==" ,true),orderBy(orderName,order) )
        }
    }else{
        searchKey.toLowerCase();
        if(editMode){
            q  = query (collection(db,method),where("searchKey","array-contains",searchKey), orderBy(orderName,order));
        }else{
            q  = query (collection(db,method),where("complete","==" ,true),where("searchKey","array-contains",searchKey), orderBy(orderName,order));
        }
    }


    try{
        const dataList = await getDocs(q);
        console.log("取得資料中");
        const dataGetAll:any[] = []
        dataList.forEach(rows=>{
            const data =  rows.data();
            const getData = {
                id:rows.id,
                method:method,
                title:data.title,
                userId:data.userId,
                category:data.category,
                creatTime:data.creatTime,
                editTime:data.editTime,
                complete:data.complete
            };
            dataGetAll.push(getData);
        })
        return dataGetAll;
    }catch(e){
        console.error(e);
    }


}