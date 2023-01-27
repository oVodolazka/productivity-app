import firebaseService from "../../services/firebase"
import { doc, updateDoc, getDoc } from 'firebase/firestore/lite';
import eventBus from '../../eventBus';

class SettingsModel {
    constructor(){
        this.db = firebaseService.db
        this.eventBus = eventBus
    }

    async getSettingsValue() {
        try {
            const docRef = doc(this.db, 'settings', 'T5Udpi4wuKFKlJwjkOCH');
            const docSnap = await getDoc(docRef);
            this.eventBus.publish('settings-data-loaded',docSnap.data())
        }
        catch (e) {
            console.log(e)
            //this.eventBus.publish('error-catched', { html: toastWarning(), classes: ['footer__warning-notification', 'footer__warning-notification--red'] })
        }
    }

    async updateSettingsData(data) {
        try {
            const docRef = doc(firebaseService.db, 'settings', 'T5Udpi4wuKFKlJwjkOCH');
            await updateDoc(docRef, {
                time: data.time,
                iteration: data.iteration,
                shortBreak: data.shortBreak,
                longBreak: data.longBreak,
            });
        }
        catch (e) {
            console.log(e)
            //this.eventBus.publish('error-catched', { type: 'error' })
        }

    }
}

export default SettingsModel