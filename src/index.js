import _ from 'lodash';
import { Router } from './router';

import '../app.less';
import firebaseService from './services/firebase';

// import firebaseService from './services/firebase'
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore/lite';

new Router();


let getDay = new Date();
const dd = String(getDay.getDate()).padStart(2, '0');
const mm = String(getDay.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = getDay.getFullYear();
getDay = mm + '.' + dd + '.' + yyyy;


async function addTask(db) {
    const col = collection(db, 'tasks');
    const snapshot = await addDoc(col, {
        title: 'jj',
        description:'descrip',
        date: getDay,
        category: 'Hobby',
        deadline: '11.30.2022',
        estimation: '4',
        priority:'middle'
    })
    return snapshot
}

//addTask(firebaseService.db)

// async function getTasks(db) {
//     const col = collection(db, 'tasks');
//     const snapshot = await getDocs(col);
//     const cityList = snapshot.docs.map(doc => doc.data());
//     return cityList;
// }

// async function removeTask(db) {
//     await deleteDoc(doc(db, "tasks", "8prAxAcdSprp21q4f2Rc"));
// }

// async function getDocument(db) {
//     const docRef = doc(firebaseService.db, "tasks", "HCsmd0y2aq5xwptT4STJ");
//     const docSnap = await getDoc(docRef);
//     docSnap.data()
// }

// async function updateDocument() {
//     const docRef = doc(firebaseService.db, "tasks", "HCsmd0y2aq5xwptT4STJ");
//     await updateDoc(docRef, {
//         type: '123New!'
//     });
// }

// const addButton = document.querySelector('.add_data')
// const getButton = document.querySelector('.get_data')
// const removeButton = document.querySelector('.remove_data')
// const updateButton = document.querySelector('.update_data')
