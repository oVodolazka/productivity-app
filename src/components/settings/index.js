import SettingsTemplate from './index.hbs'
import SettingsController from './controller';
import SettingsModel from './model';
import SettingsView from './view';
import firebaseService from '../../services/firebase';


const view = new SettingsView();
const model = new SettingsModel(firebaseService);
const SettingsComponent = new SettingsController(view, model);

export { SettingsTemplate, SettingsComponent }


