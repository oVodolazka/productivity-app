
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

// import { doc, onSnapshot, collection, query, where, onSnapshot } from "firebase/firestore";

// useEffect(() => {
//     const q = query(collection(db, "tasks"))
//     const unsub = onSnapshot(q, (querySnapshot) => {
//       console.log("Data", querySnapshot.docs.map(d => doc.data()));
//     });
//   }, [])


class FirebaseService {
    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyCIsyJVixW_anbMVYdAYmetDCv8T4O5XvM",
            authDomain: "productivity-app-e799e.firebaseapp.com",
            projectId: "productivity-app-e799e",
            storageBucket: "productivity-app-e799e.appspot.com",
            messagingSenderId: "1010854654915",
            appId: "1:1010854654915:web:aa077ba1576968f3504376"
        };
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
    }
}

// export const dataBase = firebase.firestore();

const firebaseService = new FirebaseService();

// db.app.

export default firebaseService;




