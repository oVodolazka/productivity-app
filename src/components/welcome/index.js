
import './welcome.less';
import WelcomeTemplate from './index.hbs'
import WelcomeController from './controller';
import WelcomeModel from './model';
import WelcomeView from './view';
import firebaseService from '../../services/firebase';

// import '../taskList/less/tasklist.less';

const view = new WelcomeView();
const model = new WelcomeModel(firebaseService);
const WelcomeComponent = new WelcomeController(view, model);



export { WelcomeTemplate, WelcomeComponent }