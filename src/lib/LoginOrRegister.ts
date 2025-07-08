'use client';
import { Auth } from "./firebaseAuth";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from "firebase/auth";

const LoginOrRegister = async (method:'Login'|'Register', email:string, password:string):Promise<string | null>  => {
    try{
        if(method === "Login"){
            const userLogin = await signInWithEmailAndPassword(Auth,email,password);
        }else{
            const userCreate = await createUserWithEmailAndPassword(Auth,email,password);
        }
        return null
    }catch(e : any){
        return e.message;
    }
}
export default LoginOrRegister;