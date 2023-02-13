import { taskListAddModalTemplate } from '.';
import eventBus from '../../eventBus';
import apple1 from '../../../assets/images/apple1-icon.svg';
import apple4 from '../../../assets/images/apple4-icon.svg';
import apple2 from '../../../assets/images/apple2-icon.svg';
import apple3 from '../../../assets/images/apple3-icon.svg';
import apple5 from '../../../assets/images/apple5-icon.svg';
import { setPriorityClass } from '../../utils/common'
import { setCategoryClass } from '../../utils/common'
import { createElement } from '../../utils/common'
import { defineDay } from '../../utils/common'
import getNewTaskHtml from '../taskList/tasklist-item.hbs';
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import toastAdd from '../tasklist-add-modal/toastAdd.hbs';
import toastWarning from '../tasklist-add-modal/toastWarning.hbs';
import toastInfo from '../tasklist-add-modal/toastInfo.hbs';
import confirmRemove from '../tasklist-add-modal/confirm-remove.hbs';
import { getDay } from '../../utils/common'


const imgs = {
    1: apple1,
    2: apple2,
    3: apple3,
    4: apple4,
    5: apple5
}

class AddTaskModalView {
    constructor() {
        this.eventBus = eventBus
    }
    renderModal(type, res, resetUi = false) {
        const html = taskListAddModalTemplate();
        const main = document.querySelector('main');
        const modalFader = document.createElement('div')
        modalFader.classList.add('modal-fader')
        main.appendChild(modalFader)
        modalFader.innerHTML = html;
        const cancelButton = document.querySelector('.modal-button-cancel')
        cancelButton.addEventListener('click', function () {
            modalFader.remove()
        })

        const title = document.querySelector('.title');
        title.maxLength = '118'
        const description = document.querySelector('.description')
        description.maxLength = '280'
        const deadline = document.querySelector('.deadline')
        const categories = document.querySelectorAll('.modal-radio__wrapper.category .modal-radio-label ')
        const priorities = document.querySelectorAll('.modal-radio__wrapper.priority .modal-radio-label')

        if (resetUi) {
            const pendButtons = document.querySelectorAll('.settings__daily-button')
            pendButtons.forEach((button) => button.classList.remove('pending'))
        }

        if (type == 'edit') {
            categories.forEach(function (item) {
                if (item.getAttribute('data-value').toUpperCase() == res.category.toUpperCase()) {
                    item.setAttribute('checked', 'true')
                }
            })
            priorities.forEach(function (item) {
                if (item.getAttribute('data-value').toUpperCase() == res.priority.toUpperCase()) {
                    item.setAttribute('checked', 'true')
                }
            })
            title.value = res.title
            description.value = res.description
            deadline.value = res.deadline
            const estim = document.querySelector(`.star-${res.estimation}`)
            estim.click()
            document.querySelector('.page-heading-modal').innerHTML = 'Edit task';
            const self = this;
            const buttonDone = document.querySelector('.modal-button-done')
            buttonDone.addEventListener('click', function () {
                const [category] = [...categories].filter(item => item.checked).map(item => item.getAttribute('data-value'))
                const [priority] = [...priorities].filter(item => item.checked).map(item => item.getAttribute('data-value'))
                const estimation = document.querySelector('.star-rating input:checked').value
                const priorityClass = setPriorityClass(priority)
                const categoryClass = setCategoryClass(category)
                let pomodoros;
                if(res.estimation !== estimation){
                    pomodoros = new Array(Number(estimation)).fill('not-started')    
                } else{
                    pomodoros = res.pomodoros
                }
                self.eventBus.publish('button-done-pressed', { title: title.value, description: description.value, deadline: deadline.value, category, priority, estimation, id: res.id, priorityClass: priorityClass, categoryClass: categoryClass, currDate: defineDay(deadline.value),pomodoros })
                modalFader.remove();
            })
            const container = document.querySelector('.modal-add')
            container.addEventListener('click', (event) => {

                if (event.target.classList.contains('modal-button-trash')) {
                    const parent = document.querySelector('.modal-add')
                    parent.innerHTML = confirmRemove();
                }

                if (event.target.classList.contains('modal__button-remove')) {
                    self.eventBus.publish('button-delete-pressed', res.id)
                    modalFader.remove();
                }

                if (event.target.classList.contains('modal-button-cancel-rem')) {
                    modalFader.remove();
                }

                if (event.target.classList.contains('modal__button-cancel')) {
                    modalFader.remove()
                    this.renderModal('edit', res)
                }
            })

            const day = res.deadline[0] + res.deadline[1]
            const month = res.deadline[3] + res.deadline[4]
            const year = res.deadline[6] + res.deadline[7] + res.deadline[8] + res.deadline[9]
            const selectedDate = year + '.' + month + '.' + day;
            new AirDatepicker('.deadline', {
                autoClose: true,
                selectedDates: selectedDate
            })
        }

        if (type == 'add') {
            deadline.value = getDay()
            document.querySelector('.modal-button-wrapper-trash').setAttribute('style', 'display:none')
            document.querySelector('.modal-button-wrapper').setAttribute('style', 'width:100%')
            const buttonDone = document.querySelector('.modal-button-done')
            const self = this;
            const estim = document.querySelector(`.star-5`)
            estim.click()
            buttonDone.addEventListener('click', function () {
                const [category] = [...categories].filter(item => item.checked).map(item => item.getAttribute('data-value'))
                const [priority] = [...priorities].filter(item => item.checked).map(item => item.getAttribute('data-value'))
                const estimationAdd = String(document.querySelector('.star-rating input:checked').value)
                const priorityClass = setPriorityClass(priority)
                const categoryClass = setCategoryClass(category)
                const pomodoros = []
                for (let i = 0; i < estimationAdd; i++) {
                    pomodoros.push('not-started')
                }
                self.eventBus.publish('button-addNewTask-pressed', { title: title.value, description: description.value, deadline: deadline.value, category, priority, estimation: estimationAdd, priorityClass: priorityClass, categoryClass: categoryClass, pomodoros })
                modalFader.remove();
            })
            new AirDatepicker('.deadline', {
                autoClose: true,
            })
        }
    }


    drawTask(data) {
        const parent = document.querySelector('.settings__daily-container')
        const newTask = createElement('div', parent, ['settings__daily', `${data.categoryClass}`])
        newTask.setAttribute('data-id', data.id)
        const newTaskHtml = getNewTaskHtml({ data });
        parent.appendChild(newTask)
        newTask.innerHTML = newTaskHtml;
        newTask.classList.add(data.class)

        if (document.querySelector('.header-icon-trash').classList.contains('active')) {
            newTask.querySelector('.settings-delete-mode').classList.add('active')
        }
    }

    updateModal(data) {
        const parent = document.querySelector(`[data-id="${data.id}"]`)
        if (parent) {
            parent.querySelector('.settings__daily-span').innerHTML = data.title
            parent.querySelector('.settings__daily-span-main').innerHTML = data.description
            parent.querySelector('.settings__daily-day').innerHTML = defineDay(data.deadline)
            const priority = parent.querySelector('.settings__daily-icon')
            priority.className = ''
            priority.classList.add(`settings__daily-icon`)
            priority.classList.add(`settings__daily-icon${data.estimation}`)
            priority.classList.add(`${data.priorityClass}`)
            parent.className = ''
            parent.classList.add(`settings__daily`)
            if (!parent.parentElement.classList.contains('settings__daily-container')) {
                parent.classList.add(`${data.categoryClass}-gl`)
            }
            else {
                parent.classList.add(`${data.categoryClass}`)
            }
            parent.querySelector('.settings__daily-icon').setAttribute('style', `background-image: url(${imgs[data.estimation]})`)

            const deleteIcon = parent.querySelector('.settings-delete-mode')
            deleteIcon.className = `settings-delete-mode settings-delete-mode--${data.category.toUpperCase()}`

            if (document.querySelector('.header-icon-trash').classList.contains('active')) {
                deleteIcon.classList.add('active')
            }
        }
    }

    removeTask(id) {
        const task = document.querySelector(`[data-id='${id}']`)
        const category = task.parentElement

        if (task.parentElement.classList.contains('settings__daily-container')) {
            task.remove()
        } else {
            task.remove()
            if (!category.querySelector('div')) {
                category.remove()
            }
        }
    }

    showToast(type) {
        let classes;
        let html;
        if (type === 'warning') {
            classes = ['footer__warning-notification', 'footer__warning-notification--blue'];
            html = toastInfo()
        }
        if (type === 'error') {
            classes = ['footer__warning-notification', 'footer__warning-notification--red'];
            html = toastWarning()
        }
        if (type == 'add') {
            html = toastAdd()
            classes = ['footer__warning-notification', 'footer__warning-notification--green']
        }
        if (type == 'delete') {
            html = toastInfo();
            classes = ['footer__warning-notification', 'footer__warning-notification--blue']
        }
        const footer = document.querySelector('.footer__button-wrap')
        const htmlToast = html;
        const wrapper = createElement('div', footer, classes, htmlToast)
        footer.appendChild(wrapper)
        document.querySelector('.footer__warning-notification-button').addEventListener('click', () => { wrapper.remove() })
        setTimeout(() => {
            wrapper.remove()
        }, 2500)
    }
}
export default AddTaskModalView