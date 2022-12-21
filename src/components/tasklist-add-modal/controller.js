import eventBus from '../../eventBus';

class AddTaskModalController {
    constructor(view, model) {
        this.eventBus = eventBus;
        this.view = view;
        this.model = model;
        this.eventBus.subscribe('task-loaded', (task) => this.onTaskLoaded(task))
        this.eventBus.subscribe('button-done-pressed', data => this.onButtonDonePressed(data))
        this.eventBus.subscribe('on-task-data-updated', data => this.onTaskDataUpdated(data))
        this.eventBus.subscribe('button-addNewTask-pressed', data => this.newTaskAdded(data))
        this.eventBus.subscribe('task-data-added', data => this.newTaskDraw(data))
        this.eventBus.subscribe('button-delete-pressed', id => this.onTaskDelete(id))
        this.eventBus.subscribe('task-deleted', id => this.deleteTaskItem(id))
    }

    async openTaskListModal(data) {
        if (data.type === 'edit') {
            await this.model.getTaskbyId(data.id)
        } else {
            this.view.renderModal(data.type);
        }
    }

    onTaskLoaded(task) {
        this.view.renderModal('edit', task);
    }

    onButtonDonePressed(data) {
        this.model.updateTask(data)
    }

    onTaskDataUpdated(data){
       this.view.updateModal(data)
    }

    newTaskAdded(data){
        this.model.addTask(data)
    }
    newTaskDraw(data){
        this.view.drawTask(data)
    }
    onTaskDelete(id){
        this.model.deleteTask(id)
    }
    
    deleteTaskItem(id){
        this.view.removeTask(id)
    }
}

export default AddTaskModalController