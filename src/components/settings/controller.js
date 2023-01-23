import eventBus from '../../eventBus';


class SettingsController {
    constructor(view, model){
        this.view = view;
        this.model = model;
        this.eventBus = eventBus;
        this.eventBus.subscribe('save-button-pressed', data => this.updateSettings(data))
        this.eventBus.subscribe( 'load-data', () => this.getSettings())
        this.eventBus.subscribe('settings-data-loaded',data => this.drawData(data))
    }

    init() {
        this.view.initEventListeners()
        this.view.settingsFunctonality()
    }
    getSettings(){
        this.model.getSettingsValue()
    }
    updateSettings(data){
        this.model.updateSettingsData(data)
    }
    drawData(data){
        this.view.drawSettingsData(data)
    }
}

export default SettingsController