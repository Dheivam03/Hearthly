import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {initializeFirestore,persistentLocalCache,persistentMultipleTabManager} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import {getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged, signOut} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
const app=initializeApp({apiKey:"AIzaSyDS-bR7uwH__6_c4SKxnIr8YeKx8Nptt-c",authDomain:"hearthly-1f66b.firebaseapp.com",projectId:"hearthly-1f66b",storageBucket:"hearthly-1f66b.firebasestorage.app",messagingSenderId:"309430199155",appId:"1:309430199155:web:8e0a14944c70675cf91b06"});
export const db=initializeFirestore(app,{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})});
export const auth=getAuth(app);
export const signIn=()=>signInWithPopup(auth,new GoogleAuthProvider());
export const watchAuth=cb=>onAuthStateChanged(auth,cb);
export const signOutUser=()=>signOut(auth);