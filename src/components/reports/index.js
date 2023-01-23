import ReportsTemplate from './index.hbs'


import ReportsController from './controller';
import ReportsModel from './model';
import ReportsView from './view';
import firebaseService from '../../services/firebase';

import '../taskList/less/tasklist.less';

const view = new ReportsView();
const model = new ReportsModel(firebaseService);
const ReportsComponent = new ReportsController(view, model);

export { ReportsTemplate, ReportsComponent }