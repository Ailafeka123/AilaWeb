import { signOut } from "firebase/auth";
import {auth} from "@/lib/firebase"
const LoginOut = async() =>{
    try{
        await signOut(auth);
        console.log("登出成功")
    }catch(e:any){
        console.error("登出失敗",e);
    }
}
export default LoginOut;