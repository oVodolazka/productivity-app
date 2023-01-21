class ReportController {
    constructor(view,model){
        this.view = view;
        this.model = model;
    }
    init() {
       this.view.renderUi()
    }
}
export default ReportController