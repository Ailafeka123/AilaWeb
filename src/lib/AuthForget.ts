"use client";
import { Auth } from './firebaseAuth';
import { sendPasswordResetEmail } from 'firebase/auth';


export default async function AuthForget(email:string):Promise<null|string>{
    try{
        await sendPasswordResetEmail(Auth,email);
        return null;
    }catch(e :any){
        return e.message;
    }

}