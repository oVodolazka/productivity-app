import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore/lite';
import firebaseService from "../../services/firebase"
import eventBus from '../../eventBus';



class TimerModel {
    constructor(){
        this.db = firebaseService.db;
        this.eventBus = eventBus;
    }

    async getData(id){
        const docRef = doc(this.db, "tasks", id);
        const docSnap = await getDoc(docRef);
        this.eventBus.publish('timer-task-loaded', docSnap.data());
    }
}
export default TimerModel