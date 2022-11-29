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



// function buttonEdit(e){
//     const titleInp = document.createElement('input');
//     const descriptionInp = document.createElement('input');
//     const title = e.target.parentElement.querySelector('.settings__daily-span')
//     const description = e.target.parentElement.querySelector('.settings__daily-span-main')
//     console.log(title.innerHtml)
//     titleInp.value = title.innerHtml
//     descriptionInp.value = description.innerHtml
//     // title.innerHtml = '';
//     // description.innerHtml = '';
//     title.appendChild(titleInp)
//     description.appendChild(descriptionInp)
// }

// const input = document.createElement('input');
// const elem = e.target.parentElement.querySelector('p').getAttribute('data-id');
// input.value = e.target.innerHTML;
// e.target.innerHTML = '';
// e.target.appendChild(input)
// input.addEventListener('blur', async function () {
//     e.target.textContent = this.value;
//     e.target.addEventListener('click', editElement)
//     await updateDocument(elem, input.value)
// })
// e.target.removeEventListener('click', editElement)