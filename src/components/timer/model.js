import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore/lite';
import firebaseService from "../../services/firebase"
import eventBus from '../../eventBus';



class TimerModel {
    constructor() {
        this.db = firebaseService.db;
        this.eventBus = eventBus;
        this.settingsId = 'T5Udpi4wuKFKlJwjkOCH'
    }

    async getData(id) {
        const docRef = doc(this.db, "tasks", id);
        const docSnap = await getDoc(docRef);
        this.eventBus.publish('timer-task-loaded', docSnap.data());
    }

    async getSettings() {
        try {
            const docRef = doc(this.db, 'settings', this.settingsId);
            const docSnap = await getDoc(docRef);
            this.eventBus.publish('settings-data-ready', docSnap.data())
        }
        catch (e) {
            console.log(e)
            //this.eventBus.publish('error-catched', { html: toastWarning(), classes: ['footer__warning-notification', 'footer__warning-notification--red'] })
        }
    }
    async updateTask(data) {
        try {
            const classes = await this.getDataTimer(data.id)
            classes.pomodoros[data.pomodorosId] = data.class
            const docRef = doc(firebaseService.db, 'tasks', data.id);
            await updateDoc(docRef, {
                pomodoros: classes.pomodoros,
            });
        }
        catch (e) {
            console.log(e)
            //this.eventBus.publish('error-catched', { type: 'error' })
        }
    }
    async getDataTimer(id) {
        const docRef = doc(this.db, "tasks", id);
        const docSnap = await getDoc(docRef);
        return docSnap.data()
    }
    async getShortBreakSettings() {
        try {
            const docRef = doc(this.db, 'settings', this.settingsId);
            const docSnap = await getDoc(docRef);
            this.eventBus.publish('settings-break-ready', docSnap.data())
        }
        catch (e) {
            console.log(e)
            //this.eventBus.publish('error-catched', { html: toastWarning(), classes: ['footer__warning-notification', 'footer__warning-notification--red'] })
        }
    }
    async updateTaskStatus(data) {
        try {
            const docRef = doc(firebaseService.db, 'tasks', data.id);
            await updateDoc(docRef, {
                completed: true,
                finishDate: data.finishDate,
                task: data.task,
            });
        }
        catch (e) {
            console.log(e)
            //this.eventBus.publish('error-catched', { type: 'error' })
        }
    }

    async updatePomodoro(data) {
        const docRef = doc(firebaseService.db, 'tasks', data.id);
        await updateDoc(docRef, {
            pomodoros: data.pomodoros,
            estimation: data.pomodoros.length  
        });
    }
}
export default TimerModel