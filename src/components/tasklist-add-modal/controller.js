import eventBus from '../../eventBus';
import { taskListComponent } from '../taskList';
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
        this.eventBus.subscribe('task-deleted', data => this.deleteTaskItem(data))
        this.eventBus.subscribe('error-catched', data => this.errorCatched(data))
    }

    async openTaskListModal(data) {
        if (data.type === 'edit') {
            await this.model.getTaskbyId(data.id)    
        } else {
            this.view.renderModal(data.type);
        }
    }

    onTaskLoaded(task) {
        this.view.renderModal('edit', task, true);
    }

    onButtonDonePressed(data) {
        this.model.updateTask(data)
    }

    onTaskDataUpdated(data) {
        const parent = document.querySelector(`[data-id="${data.data.id}"]`)
        if(!parent.parentElement.classList.contains('settings__daily-container')){
            taskListComponent.view.updateGlobal(data.data)
        }
        this.view.updateModal(data.data)
        this.view.showToast(data.type)
    }

    newTaskAdded(data) {
        this.model.addTask(data)
    }

    newTaskDraw(data) {
        this.view.drawTask(data.result)
        this.view.showToast(data.type)
    }

    onTaskDelete(id) {
        this.model.deleteTask(id)
    }

    deleteTaskItem(data) {
        this.view.removeTask(data.id)
        this.view.showToast(data.type)
    }

    errorCatched(data) {
        this.view.showToast(data.type)
    }
}

export default AddTaskModalController