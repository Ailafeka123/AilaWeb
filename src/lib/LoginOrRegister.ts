'use client';
import {app} from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";

const LoginOrRegister = async (method:'Login'|'Register', email:string, password:string):Promise<string | null>  => {
    const auth = getAuth(app);
    try{
        if(method === "Login"){
            const userLogin = await signInWithEmailAndPassword(auth,email,password);
        }else{
            const userCreate = await createUserWithEmailAndPassword(auth,email,password);
        }
        return null
    }catch(e : any){
        return e.message;
    }
}
export default LoginOrRegister;