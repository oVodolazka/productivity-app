import taskListAddModalTemplate from './tasklist-add-modal.hbs'
import AddTaskModalController from './controller';
import AddTaskModalView from './view';
import addTaskModel from './model';

const view = new AddTaskModalView();
const model = new addTaskModel();
const taskListAddModalComponent = new AddTaskModalController(view, model);

export { taskListAddModalTemplate, taskListAddModalComponent }