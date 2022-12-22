import firebaseService from "../../services/firebase"
import { collection, getDocs} from 'firebase/firestore/lite';
import eventBus from '../../eventBus';
import { taskListComponent } from ".";

class TasklistModel {
    constructor() {
        this.db = firebaseService.db;
        this.eventBus = eventBus;
    }
    async getData() {
        const col = collection(this.db, 'tasks');
        const snapshot = await getDocs(col);
        const taskList = snapshot.docs.map(doc =>  ({ ...doc.data(), id: doc.id}));
        this.eventBus.publish('task-data-loaded', taskList)
    }
}

export default TasklistModel
