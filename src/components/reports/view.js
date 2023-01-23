class ReportsView {
    constructor(){
        
    }
  
    renderUi(){
        if(document.querySelector('.header-icon-trash')){
            document.querySelector('.header-icon-trash').setAttribute('style','display:none')
        }
        const buttons = document.querySelector('.header-wrap').querySelectorAll('button')
        buttons.forEach(button => button.classList.remove('active'))
        document.querySelector('.header-icon-reports').classList.add('active')
    }
}
export default ReportsView