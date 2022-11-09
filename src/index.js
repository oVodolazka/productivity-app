import _ from 'lodash';
import '../app.less';
//import lovePhotoSrc from '../assets/images/1.jpg';// example how to import images, not sure if u will need this
import myTemplate from './components/settings/index.hbs'
import { Router } from './router';
import firebaseService from './services/firebase'

// import collection from './services/firebase'
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore/lite';

//const renderTemplate = template => console.log('render template', template)


const routerObj = new Router;

window.routerObj = routerObj;

async function addTask(db) {
    const col = collection(db, 'tasks');
    const snapshot = await addDoc(col, {
        type: 'Toky2'
    })

    console.log(snapshot)
}


async function getTasks(db) {
    const col = collection(db, 'tasks');
    const snapshot = await getDocs(col);
    const cityList = snapshot.docs.map(doc => doc.data());
    console.log(cityList)
    return cityList;
}

async function removeTask(db) {
    // const col = collection(db, 'tasks');
    await deleteDoc(doc(db, "tasks", "8prAxAcdSprp21q4f2Rc"));
}

async function getDocument(db) {
    const docRef = doc(firebaseService.db, "tasks", "HCsmd0y2aq5xwptT4STJ");
    const docSnap = await getDoc(docRef);
    // docSnap.data();
    console.log(docSnap.data())
}

async function updateDocument() {
    const docRef = doc(firebaseService.db, "tasks", "HCsmd0y2aq5xwptT4STJ");
    await updateDoc(docRef, {
        type: '123New!'
    });
}

// getDocument()

const addButton = document.querySelector('.add_data')
const getButton = document.querySelector('.get_data')
const removeButton = document.querySelector('.remove_data')
const updateButton = document.querySelector('.update_data')

getButton.addEventListener('click', function () {
    getTasks(firebaseService.db)
})

addButton.addEventListener('click', function () {
    addTask(firebaseService.db)
})
removeButton.addEventListener('click', function () {
    removeTask(firebaseService.db)
})

updateButton.addEventListener('click',function(){
    updateDocument()
    
})
getDocument()