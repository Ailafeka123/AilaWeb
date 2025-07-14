"use client";

import { useState } from "react";

import Style from "@/style/blogList.module.scss";

export default function BlogList(){
    const [searchInput, setSearchInput] = useState<string>("");

    return(
    <main className={`${Style.main}`}>
        <search>
            <input></input>
            
        </search>
    </main>
    )
}