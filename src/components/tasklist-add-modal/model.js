import firebaseService from "../../services/firebase"
import eventBus from '../../eventBus';
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore/lite';
import {defineDay} from '../../utils/common'

class addModalModel {
    constructor() {
        this.db = firebaseService.db;
        this.eventBus = eventBus;
    }

    async getTaskbyId(id) {
        const docRef = doc(this.db, 'tasks', id);
        const docSnap = await getDoc(docRef);
        this.eventBus.publish('task-loaded', ({ ...docSnap.data(), id: docRef.id }));
    }

    async updateTask(data) {

        const docRef = doc(firebaseService.db, 'tasks', data.id);
        await updateDoc(docRef, {
            title: data.title,
            description: data.description,
            category: data.category,
            deadline: data.deadline,
            estimation: data.estimation,
            priority: data.priority,
            priorityClass: data.priorityClass,
            categoryClass: data.categoryClass
        });
        this.eventBus.publish('on-task-data-updated', data)
    }

    async addTask(data) {
        const col = collection(this.db, 'tasks');
        const snapshot = await addDoc(col, {
            title: data.title,
            description: data.description,
            date: this.getDay(),
            currDate: defineDay(data.deadline),
            category: data.category,
            deadline: data.deadline,
            estimation: data.estimation,
            priority: data.priority,
            priorityClass: data.priorityClass,
            categoryClass: data.categoryClass
        })
        const id = snapshot.id;
        const list = await this.getDocument(id)
        const result = { ...list, id: id }
    
        this.eventBus.publish('task-data-added', result)
    }
  
    async getDocument(id) {
        const docRef = doc(this.db, "tasks", id);
        const docSnap = await getDoc(docRef);
        return docSnap.data()
    }

    getDay() {
        let getDay = new Date();
        const dd = String(getDay.getDate()).padStart(2, '0');
        const mm = String(getDay.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = getDay.getFullYear();
        return getDay = dd + '.' + mm + '.' + yyyy;
    }

    async deleteTask(id){
        await deleteDoc(doc(this.db, 'tasks', id));
        this.eventBus.publish('task-deleted', id)
    }
}

export default addModalModel