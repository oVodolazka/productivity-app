import firebaseService from "../../services/firebase";
import { collection, getDocs } from 'firebase/firestore/lite';
import eventBus from '../../eventBus';
class ReportsModel {
    constructor(){
        this.eventBus = eventBus;
        this.db = firebaseService.db
    }

    async getData() {
        const col = collection(this.db, 'tasks');
        const snapshot = await getDocs(col);
        const taskList = snapshot.docs.map(doc =>  ({ ...doc.data()}));
        this.eventBus.publish('report-data-loaded', taskList)
    }
}
export default ReportsModel