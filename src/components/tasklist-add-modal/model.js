import firebaseService from "../../services/firebase"
import eventBus from '../../eventBus';
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore/lite';
import { defineDay } from '../../utils/common'
import { getDay } from '../../utils/common'
import { createElement } from '../../utils/common'
import toastWarning from '../tasklist-add-modal/toastWarning.hbs';
import toastAdd from '../tasklist-add-modal/toastAdd.hbs';
import toastInfo from '../tasklist-add-modal/toastInfo.hbs';



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
        try {
            const docRef = doc(firebaseService.db, 'tasks', data.id);
            await updateDoc(docRef, {
                title: data.title,
                description: data.description,
                category: data.category.toUpperCase(),
                deadline: data.deadline,
                estimation: data.estimation,
                priority: data.priority,
                priorityClass: data.priorityClass,
                categoryClass: data.categoryClass,
                currDate: data.currDate,
            });
            this.eventBus.publish('on-task-data-updated', { data, type: 'warning' })
        }
        catch (e) {
            console.log(e)
            this.eventBus.publish('error-catched', { type: 'error' })
        }

    }

    async addTask(data) {
        try {
            const col = collection(this.db, 'tasks');
            const snapshot = await addDoc(col, {
                title: data.title,
                description: data.description,
                date: getDay(),
                currDate: defineDay(data.deadline),
                category: data.category.toUpperCase(),
                deadline: data.deadline,
                estimation: data.estimation,
                priority: data.priority,
                priorityClass: data.priorityClass,
                categoryClass: data.categoryClass,
                list: true,
                completed: false
            })
            const id = snapshot.id;
            const list = await this.getDocument(id)
            const result = { ...list, id: id }
            //throw new Error
            this.eventBus.publish('task-data-added', { result, type: 'add' })

        } catch (e) {
            console.log(e)
            this.eventBus.publish('error-catched', { type: 'error' })
        }
    }

    async getDocument(id) {
        try {
            const docRef = doc(this.db, "tasks", id);
            const docSnap = await getDoc(docRef);
            return docSnap.data()
        }
        catch (e) {
            console.log(e)
        }
    }

    async deleteTask(id) {
        try {
            await deleteDoc(doc(this.db, 'tasks', id));
            this.eventBus.publish('task-deleted', { id, type: 'delete' })
        }
        catch (e) {
            console.log(e)
            this.eventBus.publish('error-catched', { type: 'error' })
        }
    }
}

export default addModalModel