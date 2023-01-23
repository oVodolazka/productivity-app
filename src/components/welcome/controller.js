import eventBus from '../../eventBus';

class WelcomeController {
    constructor(view,model) {
        this.eventBus = eventBus;
        this.view = view;
        this.model = model;
    }

    init(){
        this.view.initEventListeners()
    }
}


export default WelcomeController

