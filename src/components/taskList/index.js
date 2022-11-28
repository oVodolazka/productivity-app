import taskListTemplate from './index.hbs'
import TasklistController from './controller';
import TasklistModel from './model';
import TasklistView from './view';
import firebaseService from '../../services/firebase';

import './less/tasklist.less';

const view = new TasklistView();
const model = new TasklistModel(firebaseService);
const taskListComponent = new TasklistController(view, model);

export { taskListTemplate, taskListComponent }

function querySel() {
    const buttons = document.querySelectorAll('.settings__daily-button')
    buttons.forEach(function(button){
        button.addEventListener('click', buttonEdit)
    })
}

setTimeout(querySel, 1000)

function buttonEdit(){
    console.log('s')
}