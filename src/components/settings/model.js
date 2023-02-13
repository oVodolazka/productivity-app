import firebaseService from "../../services/firebase"
import { doc, updateDoc, getDoc } from 'firebase/firestore/lite';
import eventBus from '../../eventBus';

class SettingsModel {
    constructor(){
        this.db = firebaseService.db
        this.eventBus = eventBus
        this.settingsId = 'T5Udpi4wuKFKlJwjkOCH'
    }

    async getSettingsValue() {
        try {
            const docRef = doc(this.db, 'settings', this.settingsId);
            const docSnap = await getDoc(docRef);
            this.eventBus.publish('settings-data-loaded',docSnap.data())
        }
        catch (e) {
        }
    }

    async updateSettingsData(data) {
        try {
            const docRef = doc(firebaseService.db, 'settings', this.settingsId);
            await updateDoc(docRef, {
                time: data.time,
                iteration: data.iteration,
                shortBreak: data.shortBreak,
                longBreak: data.longBreak,
            });
        }
        catch (e) {
        }

    }
}

export default SettingsModel