
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';

class FirebaseService {
    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyBXnohuiOwAt7lqSKUzsfdYXnoX7CT2WI8",
            authDomain: "productivity-paid.firebaseapp.com",
            projectId: "productivity-paid",
            storageBucket: "productivity-paid.appspot.com",
            messagingSenderId: "985010783240",
            appId: "1:985010783240:web:a223a2b697b8d56b463dbd"
          };
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
    }
}

const firebaseService = new FirebaseService();
export default firebaseService;




