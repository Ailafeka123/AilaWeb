"use client";
import Navbar from "@/component/navbar"
import Footer from "@/component/footer"
import { useState, useEffect } from "react"


import {auth} from '@/lib/firebase';
import { onAuthStateChanged } from "firebase/auth";


export default function selfdata () {

    useEffect(()=>{
        const unsub =onAuthStateChanged(auth,(user)=>{
            if(user){
                console.log(`user = ${user}`)
            }else{
                console.log("來自nav提示:尚未登入");
            }

        })
        return(()=>{
            unsub();
        });
    },[])

    return (
        <>
            <Navbar/>
            <main>
                <h1>
                    這是個人頁面
                </h1>
            </main>
            <Footer/>
        </>
    )
}