import eventBus from '../../eventBus';

class TimerController {
    constructor(view,model){
        this.view = view;
        this.model = model;
        this.eventBus =  eventBus;
        this.eventBus.subscribe('get-task',(id) => this.getTask(id))
        this.eventBus.subscribe('timer-task-loaded',(data)=> this.dataLoaded(data))
    }

    init() {
       this.view.renderUi()
       this.view.getTaskData()
    }
    getTask(id){
        this.model.getData(id)
    }
    dataLoaded(data){
        this.view.drawTask(data)
    }
}

export default TimerController