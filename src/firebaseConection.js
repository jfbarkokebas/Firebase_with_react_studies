import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyBwLIQrUgj1UjVyM19z7CJDUX-vHIKX__E",
    authDomain: "cursoapp-90452.firebaseapp.com",
    projectId: "cursoapp-90452",
    storageBucket: "cursoapp-90452.appspot.com",
    messagingSenderId: "8242976791",
    appId: "1:8242976791:web:1a67403a96b9d04d802452",
    measurementId: "G-RVV8P606KS"
  };

  const firebaseApp = initializeApp(firebaseConfig)

  const db = getFirestore(firebaseApp)
  const auth = getAuth(firebaseApp)

  export {db, auth}