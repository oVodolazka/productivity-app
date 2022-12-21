import eventBus from '../../eventBus';
import { taskListAddModalComponent } from '../tasklist-add-modal';

class TasklistController {
    constructor(view, model) {
        this.eventBus = eventBus;
        this.eventBus.subscribe('task-data-loaded', data => this.onTaskDataLoaded(data))
        this.eventBus.subscribe('task-modal-open', data => this.openTaskModal(data))
        this.view = view;
        this.model = model;
    }

    init() {
        this.model.getData()
        this.view.initEventListeners() 
    }

    onTaskDataLoaded(data) {
        this.view.renderMyData(data);
    }

    openTaskModal(data) {
        taskListAddModalComponent.openTaskListModal(data)
    }
}

export default TasklistController