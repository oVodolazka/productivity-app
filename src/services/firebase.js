
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

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

const firebaseService = new FirebaseService();
export default firebaseService;




