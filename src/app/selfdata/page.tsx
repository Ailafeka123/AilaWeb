"use client";
import { useState, useEffect } from "react"


// import {app} from "@/lib/firebase";
// import { getAuth } from "firebase/auth";
// import { onAuthStateChanged } from "firebase/auth";


export default function selfdata () {

    // useEffect(()=>{
    //     const auth = getAuth(app);
    //     const unsub =onAuthStateChanged(auth,(user)=>{
    //         if(user){
    //             console.log(`user = ${user}`)
    //         }else{
    //             console.log("來自nav提示:尚未登入");
    //         }

    //     })
    //     return(()=>{
    //         unsub();
    //     });
    // },[])

    return (
        <>
            <main>
                <h1>
                    這是個人頁面
                </h1>
            </main>
        </>
    )
}