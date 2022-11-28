import firebaseService from "../../services/firebase"
import { collection, getDocs} from 'firebase/firestore/lite';
import eventBus from '../../eventBus';
import { taskListComponent } from ".";

class TasklistModel {
    constructor() {
        this.db = firebaseService.db;
        this.eventBus = eventBus;
        // const subscription = this.eventBus.subscribe('event', arg => console.log(arg))
    }
    async getData() {
        const col = collection(this.db, 'tasks');
        const snapshot = await getDocs(col);
        const taskList = snapshot.docs.map(doc => doc.data());
        this.eventBus.publish('task-data-loaded',taskList)
    }
}

export default TasklistModel

// while you create model, pass firebaseService on it's constructor and save only DB in model
// do example with loading all tasks in meethod getData by using db from model.