import eventBus from '../../eventBus';

class TasklistController {
    constructor(view, model) {
        this.eventBus = eventBus;
        this.eventBus.subscribe('task-data-loaded', arg => this.onTaskDataLoaded(arg))
        this.view = view;
        this.model = model;
    }
    
    init(){
        this.model.getData()
        // this.view.callEvent()
    }

    onTaskDataLoaded(data) {
        this.view.renderMyData(data);
    }
}


export default TasklistController