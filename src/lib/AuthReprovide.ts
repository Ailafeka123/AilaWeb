'use client';

import {Auth} from '@/lib/firebaseAuth';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';


export default async function AuthReprovide( currentPassword : string):Promise<boolean>{
    const user = Auth.currentUser;
    if(user === null || user.email === null) return false;
    let credential = EmailAuthProvider.credential(user.email , currentPassword);
    try{
        await reauthenticateWithCredential(user,credential);
        console.log("驗證成功")
        return true;
    }catch(e){
        console.log("驗證錯誤");
        console.error(e);
        return false;
    }

}

