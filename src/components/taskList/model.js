import firebaseService from "../../services/firebase"
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore/lite';
import toastWarning from '../tasklist-add-modal/toastWarning.hbs';
import eventBus from '../../eventBus';
import toastAdd from '../tasklist-add-modal/toastAdd.hbs';
import toastInfo from '../tasklist-add-modal/toastInfo.hbs';

class TasklistModel {
    constructor() {
        this.db = firebaseService.db;
        this.eventBus = eventBus;
    }
    async getData(doneList) {
        const col = collection(this.db, 'tasks');
        const snapshot = await getDocs(col);
        const taskList = snapshot.docs.map(doc =>  ({ ...doc.data(), id: doc.id}));
        this.eventBus.publish('task-data-loaded', {taskList,doneList})
    }
    async getGlobalFilter() {
        const col = collection(this.db, 'tasks');
        const snapshot = await getDocs(col);
        const taskList = snapshot.docs.map(doc =>  ({ ...doc.data(), id: doc.id}));
        this.eventBus.publish('task-global-loaded', taskList)
    }

    async getGlobalData(e) {
        const col = collection(this.db, 'tasks');
        const snapshot = await getDocs(col);
        const taskList = snapshot.docs.map(doc =>  ({ ...doc.data(), id: doc.id}));
        this.eventBus.publish('global-list-loaded', {taskList,e})
    }
    async getGlobalStatusData() {
        const col = collection(this.db, 'tasks');
        const snapshot = await getDocs(col);
        const taskList = snapshot.docs.map(doc =>  ({ ...doc.data(), id: doc.id}));
        this.eventBus.publish('global-list-status-loaded', taskList)
    }

    async getDocument(id) {
        try {
            const docRef = doc(this.db, "tasks", id);
            const docSnap = await getDoc(docRef);
            return docSnap.data()
        }
        catch (e) {
            console.log(e)
            //this.eventBus.publish('error-catched', { html: toastWarning(), classes: ['footer__warning-notification', 'footer__warning-notification--red'] })
        }
    }

    async downPressedUpd(id){
        try {
            const docRef = doc(this.db, 'tasks', id);
            await updateDoc(docRef, {
                list: false
            });
            const data = await this.getDocument(id)
            data.id = id
            this.eventBus.publish('down-updated',data)
        }
        catch (e) {
            console.log(e)
            //this.eventBus.publish('error-catched', { html: toastWarning(), classes: ['footer__warning-notification', 'footer__warning-notification--red'] })
        }
    }

    async upPressedUpd(id){
        try {
            const docRef = doc(this.db, 'tasks', id);
            await updateDoc(docRef, {
                list: true
            });
            const data = await this.getDocument(id)
            data.id = id
            this.eventBus.publish('up-updated',data)
        }
        catch (e) {
           console.log(e)
            //this.eventBus.publish('error-catched', { html: toastWarning(), classes: ['footer__warning-notification', 'footer__warning-notification--red'] })
        }
    }

    async deleteTasks(data) {
        try {
            data.forEach( async id => {
                await deleteDoc(doc(this.db, 'tasks', id));
            })
            this.eventBus.publish('tasks-deleted', { data, html: toastInfo(), classes: ['footer__warning-notification', 'footer__warning-notification--blue'] })            
        }
        catch(e){
            console.log(e)
            this.eventBus.publish('error-catched', { html: toastWarning(), classes: ['footer__warning-notification', 'footer__warning-notification--red'] })
        }
    }
}

export default TasklistModel
