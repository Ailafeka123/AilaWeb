import {app} from '@/lib/firebase';
import { getAuth,sendPasswordResetEmail } from 'firebase/auth';


export default async function AuthForget(email:string):Promise<null|string>{
    const auth = getAuth(app);
    try{
        await sendPasswordResetEmail(auth,email);
        return null;
    }catch(e :any){
        return e.message;
    }

}