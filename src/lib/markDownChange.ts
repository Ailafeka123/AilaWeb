'use client';

import { remark } from "remark";
import html from 'remark-html';

export async function markDownChange (content:string):Promise<string>{
    try{
        const prosses = await remark().use(html).process(content);
        const changeToHtml = prosses.toString();
        return changeToHtml;
    }catch(e){
        console.error(e)
        return "";
    }
}