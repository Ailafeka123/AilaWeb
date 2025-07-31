

import Style from "@/style/selfData/editAuth/editAuth.module.scss"
import { EditAuthComponent } from "./editAuthComponent"



export default function editAuth(){
    
    return (
    <main className={Style.main}>
        <h2>目前註冊使用者</h2>
        <EditAuthComponent/>
    </main>
    )
}