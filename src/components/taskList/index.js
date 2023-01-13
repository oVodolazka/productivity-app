import taskListTemplate from './index.hbs'
import TasklistController from './controller';
import TasklistModel from './model';
import TasklistView from './view';
import firebaseService from '../../services/firebase';

import './less/tasklist.less';

import tasklist from './tasklist.hbs'

const view = new TasklistView();
const model = new TasklistModel(firebaseService);
const taskListComponent = new TasklistController(view, model);

export { taskListTemplate, taskListComponent }
