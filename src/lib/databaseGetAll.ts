"use client";

import { db } from "./database";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";


export async function databaseGetAll(method:string,searchKey:string,orderName:"title"|"creatTime"|"editTime",order:"asc"|"desc", editMode:true|false, limitNumber:number = 0 ):Promise<any>{
    let q ;
    // editMod => true => complete無所謂   false => complete = true
    // return id, category,creatTime,title
    // array-contains 單一符合條件
    // array-contains-any 要輸入string[] 符合

    if(searchKey === ""){
        if(limitNumber === 0){
            if(editMode){
                q = query( collection(db,method),orderBy(orderName,order) )
            }else{
                q = query( collection(db,method),where("complete","==" ,true),orderBy(orderName,order) )
            }
        }else{
            if(editMode){
                q = query( collection(db,method),orderBy(orderName,order),limit(limitNumber) )
            }else{
                q = query( collection(db,method),where("complete","==" ,true),orderBy(orderName,order),limit(limitNumber) )
            }
        }
        
    }else{
        searchKey = searchKey.toLowerCase();
        if(limitNumber === 0){
            if(editMode){
                q  = query (collection(db,method),where("searchKey","array-contains",searchKey), orderBy(orderName,order));
            }else{
                q  = query (collection(db,method),where("complete","==" ,true),where("searchKey","array-contains",searchKey), orderBy(orderName,order));
            }
        }else{
            if(editMode){
                q  = query (collection(db,method),where("searchKey","array-contains",searchKey), orderBy(orderName,order),limit(limitNumber) );
            }else{
                q  = query (collection(db,method),where("complete","==" ,true),where("searchKey","array-contains",searchKey), orderBy(orderName,order),limit(limitNumber) );
            }
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