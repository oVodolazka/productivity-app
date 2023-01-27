import eventBus from '../../eventBus';
import { taskListAddModalComponent } from '../tasklist-add-modal';


class TasklistController {
    constructor(view, model) {
        this.eventBus = eventBus;
        this.eventBus.subscribe('task-data-loaded', (data) => this.onTaskDataLoaded(data))
        this.eventBus.subscribe('task-modal-open', data => this.openTaskModal(data))
        this.eventBus.subscribe('global-list-pressed', (e) => this.getGlobalList(e))
        this.eventBus.subscribe('global-list-loaded', (data) => this.drawGloablList(data))
        this.eventBus.subscribe('move-down-pressed', (id) => this.downPressed(id))
        this.eventBus.subscribe('move-up-pressed', (id) => this.upPressed(id))
        this.eventBus.subscribe('down-updated', (data) => this.globalDraw(data))
        this.eventBus.subscribe('up-updated', (data) => this.dailyDraw(data))
        this.eventBus.subscribe('filter-pressed', () => this.getGlobalData())
        this.eventBus.subscribe('task-global-loaded', (data) => this.drawGlobal(data))
        this.eventBus.subscribe('done-pressed', (doneList) => this.getDataDone(doneList))
        this.eventBus.subscribe('done-pressed-upd-global', () => this.getGlobalDone())
        this.eventBus.subscribe('global-list-status-loaded', (data) => this.drawGlobalSt(data))
        this.eventBus.subscribe('tasks-selected', id => this.deleteModeTaskSelected(id))
        this.eventBus.subscribe('delete-tasks', data => this.deleteItems(data))
        this.eventBus.subscribe('tasks-deleted', data => this.deleteTasksView(data))
        this.eventBus.subscribe('timer-pressed', (id) => this.timerNavigate(id))
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

    getGlobalList(e) {
        this.model.getGlobalData(e)
    }

    drawGloablList(data) {
        this.view.openGlobalList(data)
    }

    downPressed(id) {
        this.model.downPressedUpd(id)
    }

    upPressed(id) {
        this.model.upPressedUpd(id)
    }

    globalDraw(data) {
        this.view.globalDrawElement(data)
    }

    dailyDraw(data) {
        this.view.dailyDrawElement(data)
    }

    getGlobalData() {
        this.model.getGlobalFilter()
    }

    drawGlobal(data) {
        this.view.updateGlobalFiltering(data)
    }

    getDataDone(doneList) {
        this.model.getData(doneList)
    }

    getGlobalDone() {
        this.model.getGlobalStatusData()
    }

    drawGlobalSt(data) {
        this.view.drawGlobalStatus(data)
    }

    deleteModeTaskSelected(data) {
        this.view.openConfirmModal(data)
    }

    deleteItems(data) {
        this.model.deleteTasks(data)
    }

    deleteTasksView(data) {
        this.view.deleteTasks(data)
    }

    timerNavigate(id) {
        window.router.navigate('/timer',{id})
    }
}

export default TasklistController