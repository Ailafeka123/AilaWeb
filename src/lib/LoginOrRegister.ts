import {auth} from "@/lib/firebase";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";

const LoginOrRegister = async (method:'Login'|'Register', email:string, password:string) => {
    try{
        if(method === "Login"){
            const userLogin = await signInWithEmailAndPassword(auth,email,password);
        }else{
            const userCreate = await createUserWithEmailAndPassword(auth,email,password);
        }
    }catch(e : any){
        console.error("登入註冊失敗",e.message);
    }
}
export default LoginOrRegister;