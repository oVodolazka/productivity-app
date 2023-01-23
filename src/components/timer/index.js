
import TimerTemplate from './index.hbs'
import TimerController from './controller';
import TimerModel from './model';
import TimerView from './view';
import firebaseService from '../../services/firebase';

import '../taskList/less/tasklist.less';

const view = new TimerView();
const model = new TimerModel(firebaseService);
const TimerComponent = new TimerController(view, model);

export { TimerTemplate, TimerComponent }