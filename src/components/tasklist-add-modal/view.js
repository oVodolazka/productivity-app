import { taskListAddModalTemplate } from '.';
import eventBus from '../../eventBus';
import apple1 from '../../../assets/images/apple1-icon.svg';
import apple4 from '../../../assets/images/apple4-icon.svg';
import apple2 from '../../../assets/images/apple2-icon.svg';
import apple3 from '../../../assets/images/apple3-icon.svg';
import apple5 from '../../../assets/images/apple5-icon.svg';
import { setPriorityClass } from '../../utils/common'
import { setCategoryClass } from '../../utils/common'
import { defineDay } from '../../utils/common'
import getNewTaskHtml from '../taskList/tasklist-item.hbs';
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

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
    renderModal(type, res) {
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
        const description = document.querySelector('.description')
        const deadline = document.querySelector('.deadline')
        const categories = document.querySelectorAll('.modal-radio__wrapper.category .modal-radio-label ')
        const priorities = document.querySelectorAll('.modal-radio__wrapper.priority .modal-radio-label')

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
                self.eventBus.publish('button-done-pressed', { title: title.value, description: description.value, deadline: deadline.value, category, priority, estimation, id: res.id, priorityClass: priorityClass, categoryClass: categoryClass })
                modalFader.remove();
            })
            const deleteButton = document.querySelector('.modal-button-trash')

            deleteButton.addEventListener('click', function () {
                self.eventBus.publish('button-delete-pressed', res.id)
                modalFader.remove();
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
                self.eventBus.publish('button-addNewTask-pressed', { title: title.value, description: description.value, deadline: deadline.value, category: category, priority: priority, estimation: estimationAdd, priorityClass: priorityClass, categoryClass: categoryClass })
                modalFader.remove();
            })
            new AirDatepicker('.deadline', {
                autoClose: true,
            })
        }
    }

    drawTask(data) {
        const parent = document.querySelector('.settings__daily-container')
        const newTask = this.createElement('div', parent, ['settings__daily', `${data.categoryClass}`])
        newTask.setAttribute('data-id', data.id)
        const newTaskHtml = getNewTaskHtml({ data });
        parent.appendChild(newTask)
        newTask.innerHTML = newTaskHtml;
        newTask.classList.add(data.class)
    }

    updateModal(data) {
        const parent = document.querySelector(`[data-id="${data.id}"]`)
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
        parent.classList.add(`${data.categoryClass}`)
        parent.querySelector('.settings__daily-icon').setAttribute('style', `background-image: url(${imgs[data.estimation]})`)
    }

    createElement(tagName, parent, classes, innerHTML, attributes = []) {
        const elem = document.createElement(tagName)
        attributes.forEach(item => {
            let keys = Object.keys(item)
            for (let key of keys) {
                elem.setAttribute(key, item[key])
            }
        })
        classes.forEach(item => {
            elem.classList.add(item)
        })
        if (innerHTML) {
            elem.innerHTML = innerHTML
        }
        parent.appendChild(elem)
        return elem
    }

    removeTask(id) {
        const task = document.querySelector(`[data-id='${id}']`)
        task.remove()
    }
}
export default AddTaskModalView