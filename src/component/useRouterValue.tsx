"use client";
// import { usePathname } from "next/navigation";
import {useSearchParams} from 'next/navigation';


export default  function useRouterValue(valueName:string):string|null{
    const searchParams = useSearchParams();
    console.log(searchParams);


    return searchParams.get(valueName);
}
// 抓取ID(如果是edit的情況)
    // const searchParams = useSearchParams();
    // 資料

    // 抓取url
    // useEffect(()=>{
    //     const catchId = searchParams.get("id");
    //     if(catchId){
    //         setEditComplete(true);
    //         setBlogId(catchId);
    //     }
    // },[searchParams])