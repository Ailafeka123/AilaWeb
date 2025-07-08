"use client";
import {app} from '@/lib/firebase';
import { getAuth } from 'firebase/auth';

const Auth = getAuth(app);

export {Auth};