import eventBus from '../../eventBus';
import getTasklistHtml from './tasklist.hbs'
import { defineDay } from '../../utils/common'

class TasklistView {
    constructor() {
        this.eventBus = eventBus;
    }

    initEventListeners(data) {
        const container = document.querySelector('.settings__daily-container')
        const self = this;

        container.addEventListener('click', function (e) {
            if (e.target.classList.contains('settings__daily-button')) {
                self.buttonEdit(self, e, data)
            }
        })
    }

    renderMyData(data) {
       
        const self = this;
        data.forEach(function (item) {
            item.currDate = defineDay(item.deadline)
        })
        const html = getTasklistHtml({ data });
        const dataWrapper = document.querySelector('.settings__daily-container')
        dataWrapper.innerHTML = '';
        dataWrapper.innerHTML = html;
        const addTaskButton = document.querySelector('.settings__button-add');
        addTaskButton.addEventListener('click', function () {
            self.buttonAdd(self)
        })
    }

    buttonEdit(self, e, data) {
        const id = e.target.parentElement.getAttribute('data-id');
        self.eventBus.publish('task-modal-open', { type: 'edit', id: id, data })
    }

    buttonAdd(self) {
        self.eventBus.publish('task-modal-open', { type: 'add' })
    }
}

export default TasklistView