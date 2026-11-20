import {db} from './firebase.js';
import {collection,doc,setDoc,updateDoc,deleteDoc,onSnapshot} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
export const S={items:[],meals:[],plans:[],expenses:[],logs:[],settings:[]};
let uid;const col=k=>collection(db,'users',uid,k),ref=(k,id)=>doc(db,'users',uid,k,id);
export function listen(u,onChange,onErr){uid=u;Object.keys(S).forEach(k=>onSnapshot(col(k),s=>{S[k]=s.docs.map(d=>({id:d.id,...d.data()}));onChange()},e=>{console.error(k,e);onErr&&onErr(e)}))}
export const add=(k,d)=>{const r=doc(col(k));setDoc(r,d);return r};
export const put=(k,id,d)=>setDoc(ref(k,id),d,{merge:true});
export const upd=(k,id,d)=>updateDoc(ref(k,id),d);
export const del=(k,id)=>deleteDoc(ref(k,id));
