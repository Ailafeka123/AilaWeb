"use client";
import {app} from "@/lib/firebase";
import { getFirestore } from "firebase/firestore";

const  db =  getFirestore(app);

export {db};