import { EventBus } from 'light-event-bus';
import renderMyTasks from './tasklist.hbs'
import tasklistEditModal from '../tasklist-edit-modal/tasklist-edit-modal.hbs'

//console.log(tasklistEditModal())


class TasklistView {
    constructor() {
        this.eventBus = new EventBus()
    }
    renderMyData(data) {
        data.forEach(function (item) {
            item.currDate = defineDay(item.date)
            item.class = setClass()// ! it should set class when task created
        })

        const html = renderMyTasks({ data });
        const dataWrapper = document.querySelector('.settings__daily-container')
        dataWrapper.innerHTML = '';
        dataWrapper.innerHTML = html;
        const self = this;

        const buttons =  document.querySelectorAll('.settings__daily-button')
        buttons.forEach(function (button) {
            button.addEventListener('click',self.buttonEdit)
        })
    }

    buttonEdit(e){  
        console.log(e.target.parentElement)
        const html = tasklistEditModal();
        const body = document.querySelector('body');
        const modalFader = document.createElement('div')
        modalFader.classList.add('modal-fader')
        body.appendChild(modalFader)
        modalFader.innerHTML = html;
        const cancelButton = document.querySelector('.modal-button-cancel')
        cancelButton.addEventListener('click',function(){
            modalFader.remove()
        })// переместить куда то?
    }
}

// function buttonEdit(){
//     const html = tasklistEditModal();
//     // editModal.innerHTML = html;
//     const body = document.querySelector('body');
//     const modalFader = document.createElement('div')
//     modalFader.classList.add('modal-fader')
//     body.appendChild(modalFader)
//     modalFader.innerHTML = html;

//     const cancelButton = document.querySelector('.modal-button-cancel')
//     cancelButton.addEventListener('click',function(){
//         modalFader.remove()
//     })
// }

//console.log(arr)
// function createElement(tagName, parent, classes, innerHTML, attributes = []) {
//     const elem = document.createElement(tagName)
//     attributes.forEach(item => {
//         let keys = Object.keys(item)
//         for (let key of keys) {
//             elem.setAttribute(key, item[key])
//         }
//     })
//     classes.forEach(item => {
//         elem.classList.add(item)
//     })
//     if (innerHTML) {
//         elem.innerHTML = innerHTML
//     }
//     parent.appendChild(elem)
//     return elem
// }

function setClass() {
    const classes = ['settings__daily--red', 'settings__daily--violet', 'settings__daily--yellow', 'settings__daily--darkblue', 'settings__daily--blue']
    const item = classes[Math.floor(Math.random() * classes.length)]
    return item
}


function defineDay(date) {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    today = mm + '.' + dd + '.' + yyyy;

    let tomorrow = new Date();
    const ddTom = tomorrow.getDate() + 1;
    tomorrow = mm + '.' + String(ddTom).padStart(2, '0') + '.' + yyyy;

    let yesterday = new Date();
    const ddYes = yesterday.getDate() - 1;
    yesterday = mm + '.' + String(ddYes).padStart(2, '0') + '.' + yyyy;
    if (date == today) {
        return 'Today'
    }
    else if (date == yesterday) {
        return 'Yesterday'
    }
    else if (date == tomorrow) {
        return 'Tomorrow'
    }
    else {
        return date
    }
}


export default TasklistView