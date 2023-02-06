import eventBus from '../../eventBus';

class ReportController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.eventBus = eventBus;
        this.eventBus.subscribe('load-report-data', () => this.getData())
        this.eventBus.subscribe('report-data-loaded', data => this.drawReport(data))
    }
    init() {
        this.view.renderUi()
        this.view.initEventListeners()
    }
    getData(){
        this.model.getData()
    }
    drawReport(data){
        this.view.updateHighcharts(data)
    }
    onUnmount(){
        this.view.removeEventListeners()
    }
}
export default ReportController