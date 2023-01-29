import eventBus from '../../eventBus';

class TimerController {
    constructor(view,model){
        this.view = view;
        this.model = model;
        this.eventBus =  eventBus;
        this.eventBus.subscribe('get-task',(id) => this.getTask(id))
        this.eventBus.subscribe('timer-task-loaded',(data)=> this.dataLoaded(data))
        this.eventBus.subscribe('start-pressed', () => this.getSettingsData())
        this.eventBus.subscribe('settings-data-ready',data => this.drawTimer(data))
        this.eventBus.subscribe('fail-pomodoros-pressed',(data) => this.failPomodoros(data))
        this.eventBus.subscribe('finish-pomodoros-pressed',(data) => this.finishPomodoros(data))
        this.eventBus.subscribe('get-settings', () => this.getSettings())
        this.eventBus.subscribe('settings-break-ready',data => this.renderBreak(data))
        this.eventBus.subscribe('task-completed-pressed',id => this.completeTask(id))
    }

    init() {
        this.view.initEventListeners()
        this.view.getTaskData()
    }
    onUnmount(){
        this.view.removeEventListeners()
        this.view.removeTimer()
    }
    // clearTimerInterval(){
       
    // }
    getTask(id){
        this.model.getData(id)
    }
    dataLoaded(data){
        this.view.drawTask(data)
    }
    getSettingsData(){
        this.model.getSettings()
    }
    drawTimer(data){
        this.view.renderTimer(data)
    }
    failPomodoros(data){
        this.model.updateTask(data)
    }
    finishPomodoros(data){
        this.model.updateTask(data)
    }
    getSettings(){
        this.model.getShortBreakSettings()
    }
    renderBreak(data){
        this.view.drawbreak(data)
    }
    completeTask(id){
        this.model.updateTaskStatus(id)
    }
}

export default TimerController