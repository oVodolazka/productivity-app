import eventBus from '../../eventBus';
import getTasklistHtml from './tasklist.hbs'
import getGlobalTaskHtml from './tasklist-item.hbs'
import { defineDay, createElement } from '../../utils/common'
import getGlobalHtml from './global.hbs'
import getGlobalItemHtml from './global-item.hbs'
import getGlobalUpdHtml from './global-upd.hbs'

import confirmRemove from '../tasklist-add-modal/confirm-remove.hbs';


import _ from 'lodash';

class TasklistView {
    constructor() {
        this.eventBus = eventBus;
    }

    initEventListeners() {
        const container = document.querySelector('.settings')
        const self = this;

        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('settings__daily-button')) {
                self.buttonEdit(self, e)
            }
            if (e.target.classList.contains('settings__move-down')) {
                const id = e.target.parentElement.parentElement.getAttribute('data-id')
                self.eventBus.publish('move-down-pressed', id)
                const container = document.querySelector('.settings__daily-container')
                container.querySelector(`[data-id='${id}']`).remove()
            }
            if (e.target.classList.contains('settings__move-up')) {
                const category = e.target.parentElement.parentElement.parentElement.parentElement
                const id = e.target.parentElement.parentElement.getAttribute('data-id')
                self.eventBus.publish('move-up-pressed', id)
                const container = document.querySelector('.footer__task-wrapper')
                container.querySelector(`[data-id='${id}']`).remove()

                const task = category.querySelector('.settings__daily')
                if (!task) {
                    category.remove()
                }
            }
            if (e.target.classList.contains('footer-filter-span')) {
                const filterButtons = document.querySelectorAll('.footer-filter-span')
                filterButtons.forEach((item) => { item.classList.remove('active') })
                e.target.classList.add('active')
                self.eventBus.publish('filter-pressed')
            }
            if (e.target.classList.contains('settings__button-categories')) {
                const deselect = document.querySelectorAll('.deselect')
                deselect.forEach(item => item.classList.remove('active'))

                document.querySelector('.settings__button-pomodoros').classList.remove('active')
                document.querySelector('.settings__button-categories').classList.add('active')
                self.eventBus.publish('done-pressed', true)

                if (document.querySelector('.footer__global-btn').classList.contains('active')) {
                    self.eventBus.publish('done-pressed-upd-global')
                }
            }
            if (e.target.classList.contains('settings__button-pomodoros')) {
                const deselect = document.querySelectorAll('.deselect')
                deselect.forEach(item => item.classList.remove('active'))

                document.querySelector('.settings__button-pomodoros').classList.add('active')
                document.querySelector('.settings__button-categories').classList.remove('active')
                self.eventBus.publish('done-pressed')
                if (document.querySelector('.footer__global-btn').classList.contains('active')) {
                    self.eventBus.publish('done-pressed-upd-global')
                }
            }
            if (e.target.classList.contains('settings-delete-mode-icon')) {
                e.target.className = 'settings-delete-mode-confirm';
                if (e.target.parentElement.parentElement.parentElement.classList.contains('settings__daily-container')) {
                    document.querySelector('.delete-mode-up').querySelector('.deselect').classList.remove('active')
                } else {
                    document.querySelector('.delete-mode').querySelector('.deselect').classList.remove('active')
                }
                return
            }
            if (e.target.classList.contains('settings-delete-mode-confirm')) {
                let data = []
                const tasks = document.querySelectorAll('.settings-delete-mode-confirm')
                tasks.forEach(item => {
                    const id = item.parentElement.parentElement.getAttribute('data-id')
                    data.push(id)
                })

                self.eventBus.publish('tasks-selected', data)
                return
            }
            if (e.target.classList.contains('select')) {
                if (e.target.parentElement.classList.contains('delete-mode-up')) {
                    e.target.classList.add('active')
                    document.querySelector('.delete-mode-up').querySelector('.deselect').classList.remove('active')
                    const parent = document.querySelector('.settings__daily-container')
                    const tasks = parent.querySelectorAll('.settings-delete-mode-icon')
                    tasks.forEach(task => task.className = 'settings-delete-mode-confirm')
                } else {
                    e.target.classList.add('active')
                    document.querySelector('.delete-mode').querySelector('.deselect').classList.remove('active')
                    const parent = document.querySelector('.footer__task-wrapper')
                    const tasks = parent.querySelectorAll('.settings-delete-mode-icon')
                    tasks.forEach(task => task.className = 'settings-delete-mode-confirm')
                }
            }
            if (e.target.classList.contains('deselect')) {
                if (e.target.parentElement.classList.contains('delete-mode-up')) {
                    e.target.classList.add('active')
                    document.querySelector('.delete-mode-up').querySelector('.select').classList.remove('active')
                    const parent = document.querySelector('.settings__daily-container')
                    const tasks = parent.querySelectorAll('.settings-delete-mode-confirm')
                    tasks.forEach(task => task.className = 'settings-delete-mode-icon')
                } else {
                    e.target.classList.add('active')
                    document.querySelector('.delete-mode').querySelector('.select').classList.remove('active')
                    const parent = document.querySelector('.footer__task-wrapper')
                    const tasks = parent.querySelectorAll('.settings-delete-mode-confirm')
                    tasks.forEach(task => task.className = 'settings-delete-mode-icon')
                }
            }
            if (e.target.classList.contains('settings__button-add')) {
                self.buttonAdd(self)
            }
            if(e.target.classList.contains('footer__global-btn')){
                self.eventBus.publish('global-list-pressed', e)
                e.target.classList.toggle('active')
            }
        })

        const header = document.querySelector('.header')
        header.addEventListener('click', (e) => {
            if (e.target.classList.contains('header-icon-trash')) {
                e.target.classList.toggle('active')
                document.querySelector('.delete-mode-up').classList.toggle('active')
                document.querySelector('.delete-mode').classList.toggle('active')
                const tasks = document.querySelectorAll('.settings-delete-mode')
                tasks.forEach(task => task.classList.toggle('active'))
                const buttons = (document.querySelectorAll('.select,.deselect'))
                buttons.forEach(button => button.classList.remove('active'))
            }
        })
    }

    openGlobalList(data) {
        const dataWrapper = document.querySelector('.footer__task-wrapper')
        if (data.e.target.classList.contains('active')) {
            const filteredPriority = document.querySelector('.footer-filter-span.active').getAttribute('data-filter')
            const getStatus = document.querySelector('.settings__button__wrap').querySelector('button').classList.contains('active')
            const readyData = data.taskList
                .filter(item => item.list == false)
                .filter(item => filteredPriority === 'all' ? true : item.priority == filteredPriority)
                .filter(item => item.completed == !getStatus)
                .map(item => {
                    item.currDate = defineDay(item.deadline);
                    return item;
                })

            const result = _.groupBy(readyData, 'category');
            const html = getGlobalHtml({ result });
            dataWrapper.innerHTML = ''
            dataWrapper.innerHTML = html;
            const globalList = document.querySelector('.footer__global-btn')
            globalList.innerHTML = '&#9660';

            if (document.querySelector('.header-icon-trash').classList.contains('active')) {
                const parent = document.querySelector('.footer__task-wrapper')
                const tasks = parent.querySelectorAll('.settings-delete-mode')
                tasks.forEach(item => item.classList.add('active'))
                if (document.querySelector('.delete-mode').querySelector('.select').classList.contains('active')) {
                    const tasks = document.querySelector('.footer__task-wrapper').querySelectorAll('.settings-delete-mode-icon')
                    tasks.forEach(task => task.className = 'settings-delete-mode-confirm')
                }
            }

        } else {
            dataWrapper.innerHTML = ''
            const globalList = document.querySelector('.footer__global-btn')
            globalList.innerHTML = '&#9658;';
        }
    }

    renderMyData(data) {
        let done = false;
        if (data.doneList) {
            done = true;
        }
        data.taskList.map(item => item.currDate = defineDay(item.deadline));
        const result = data.taskList.filter(item => {
            return item.list == true && item.completed == done
        })
        const html = getTasklistHtml({ result });
        const dataWrapper = document.querySelector('.settings__daily-container')
        dataWrapper.innerHTML = '';
        dataWrapper.innerHTML = html;
        if (document.querySelector('.header-icon-trash').classList.contains('active')) {
            const parent = document.querySelector('.settings__daily-container')
            const tasks = parent.querySelectorAll('.settings-delete-mode')
            tasks.forEach(item => item.classList.add('active'))
        }

        if (document.querySelector('.delete-mode-up').querySelector('.select').classList.contains('active')) {
            const tasks = document.querySelector('.settings__daily-container').querySelectorAll('.settings-delete-mode-icon')
            tasks.forEach(task => task.className = 'settings-delete-mode-confirm')
        }
    }

    buttonEdit(self, e, ) {
        const id = e.target.parentElement.parentElement.getAttribute('data-id');
        self.eventBus.publish('task-modal-open', { type: 'edit', id: id, })
        const pendButtons = document.querySelectorAll('.settings__daily-button')
        pendButtons.forEach((button) => button.classList.add('pending'))
    }

    buttonAdd(self) {
        if (document.querySelector('.header-icon-trash').classList.contains('active')) {
            document.querySelector('.header-icon-trash').classList.remove('active')
            document.querySelector('.delete-mode-up').classList.remove('active')
            document.querySelector('.delete-mode').classList.remove('active')
            const buttons = document.querySelectorAll('.settings-delete-mode')
            buttons.forEach(button => button.classList.remove('active'))
        }
        self.eventBus.publish('task-modal-open', { type: 'add' })

    }

    globalDrawElement(data) {
        const category = data.category
        const filteredPriority = document.querySelector('.footer-filter-span.active').getAttribute('data-filter')
        if (document.querySelector('.footer__global-btn').classList.contains('active')) {
            if (filteredPriority == 'all' || filteredPriority == data.priority) {
                const global = document.querySelector(`.${category}`)
                if (!global) {
                    const footer = document.querySelector('.footer__task-wrapper')
                    const wrapper = createElement('div', footer, ['wrapper'])
                    const html = getGlobalItemHtml({ data })
                    wrapper.innerHTML = html;
                } else {
                    const html = getGlobalTaskHtml({ data });
                    const taskWrapper = createElement('div', global, ['settings__daily', `${data.categoryClass}-gl`], null, [{ 'data-id': data.id }])
                    taskWrapper.innerHTML = html;
                }
                const button = document.querySelector(`[data-id='${data.id}']`);
                button.querySelector('.settings__move').className = 'settings__move settings__move-up'

                if (document.querySelector('.header-icon-trash').classList.contains('active')) {
                    const parent = document.querySelector(`[data-id="${data.id}"]`)
                    parent.querySelector('.settings-delete-mode').classList.add('active')
                    if (document.querySelector('.delete-mode').querySelector('.select').classList.contains('active')) {
                        parent.querySelector('.settings-delete-mode-icon').className = 'settings-delete-mode-confirm'
                    }
                }
            }
        }
    }
    dailyDrawElement(data) {
        const daily = document.querySelector('.settings__daily-container')
        const html = getGlobalTaskHtml({ data });
        createElement('div', daily, ['settings__daily', `${data.categoryClass}`], html, [{ 'data-id': data.id }])
        const button = document.querySelector(`[data-id='${data.id}']`)
        button.querySelector('.settings__move').className = 'settings__move settings__move-down'

        if (document.querySelector('.header-icon-trash').classList.contains('active')) {
            const parent = document.querySelector(`[data-id="${data.id}"]`)
            parent.querySelector('.settings-delete-mode').classList.add('active')
            if (document.querySelector('.delete-mode-up').querySelector('.select').classList.contains('active')) {
                parent.querySelector('.settings-delete-mode-icon').className = 'settings-delete-mode-confirm'
            }
        }
    }

    updateGlobal(data) {
        const item = document.querySelector(`[data-id='${data.id}']`).parentElement
        const category = document.querySelector(`.${data.category.toUpperCase()}`)

        if (category) {
            document.querySelector(`[data-id='${data.id}']`).remove()
            const html = getGlobalUpdHtml({ data })
            createElement('div', category, [`settings__daily`, `${data.categoryClass}-gl`], html, [{ 'data-id': data.id }])
        } else {
            document.querySelector(`[data-id='${data.id}']`).remove()
            const global = document.querySelector('.footer__task-wrapper')
            const html = getGlobalUpdHtml({ data });
            const wrapper = createElement('div', global, ['wrapper'])
            const catWarpper = createElement('div', wrapper, [`${data.category.toUpperCase()}`])
            createElement('span', catWarpper, ['category-span', `${data.categoryClass}`], data.category.toUpperCase())
            createElement('div', catWarpper, ['settings__daily', `${data.categoryClass}-gl`], html, [{ 'data-id': data.id }])
        }

        const filteredPriority = document.querySelector('.footer-filter-span.active').getAttribute('data-filter')

        if (filteredPriority !== 'all') {
            if (data.priority !== filteredPriority) {
                document.querySelector(`[data-id='${data.id}']`).remove()
            }
        }

        if (!item.querySelector('div')) {
            item.remove()
        }

    }
    updateGlobalFiltering(data) {
        if (document.querySelector('.footer__global-btn').classList.contains('active')) {
            const getStatus = document.querySelector('.settings__button__wrap').querySelector('button').classList.contains('active')
            const dataWrapper = document.querySelector('.footer__task-wrapper')
            const filteredPriority = document.querySelector('.footer-filter-span.active').getAttribute('data-filter')
            const readyData = data
                .filter(item => item.list == false)
                .filter(item => filteredPriority === 'all' ? true : item.priority == filteredPriority)
                .filter(item => item.completed == !getStatus)
                .map(item => {
                    item.currDate = defineDay(item.deadline);
                    return item;
                })
            const result = _.groupBy(readyData, 'category');
            const html = getGlobalHtml({ result });
            dataWrapper.innerHTML = ''
            dataWrapper.innerHTML = html;

            if (document.querySelector('.header-icon-trash').classList.contains('active')) {
                const parent = document.querySelector('.footer__button-wrap')
                const tasks = parent.querySelectorAll('.settings-delete-mode')
                tasks.forEach(item => item.classList.add('active'))

                if (document.querySelector('.delete-mode').querySelector('.select').classList.contains('active')) {
                    const buttons = document.querySelectorAll('.settings-delete-mode-icon')
                    buttons.forEach(button => button.className = 'settings-delete-mode-confirm')
                }
            }
        }
    }

    drawGlobalStatus(data) {
        const filteredPriority = document.querySelector('.footer-filter-span.active').getAttribute('data-filter')
        const getStatus = document.querySelector('.settings__button__wrap').querySelector('button').classList.contains('active')
        const dataWrapper = document.querySelector('.footer__task-wrapper')
        const readyData = data
            .filter(item => item.list == false)
            .filter(item => filteredPriority === 'all' ? true : item.priority == filteredPriority)
            .filter(item => item.completed == !getStatus)
            .map(item => {
                item.currDate = defineDay(item.deadline);
                return item;
            })

        const result = _.groupBy(readyData, 'category');
        const html = getGlobalHtml({ result });
        dataWrapper.innerHTML = ''
        dataWrapper.innerHTML = html;

        if (document.querySelector('.header-icon-trash').classList.contains('active')) {
            const parent = document.querySelector('.footer__task-wrapper')
            const tasks = parent.querySelectorAll('.settings-delete-mode')
            tasks.forEach(item => item.classList.add('active'))
        }

        if (document.querySelector('.delete-mode').querySelector('.select').classList.contains('active')) {
            const tasks = document.querySelector('.footer__task-wrapper').querySelectorAll('.settings-delete-mode-icon')
            tasks.forEach(task => task.className = 'settings-delete-mode-confirm')
        }

    }

    openConfirmModal(data) {
        const self = this;
        const main = document.querySelector('main')
        const fader = createElement('div', main, ['modal-fader'])
        const modal = createElement('div', fader, ['modal-add'], confirmRemove())
        modal.addEventListener('click', e => {
            if (e.target.classList.contains('modal__button-remove')) {
                self.eventBus.publish('delete-tasks', data)
                fader.remove()
                const tasks = document.querySelectorAll('.settings-delete-mode.active')

                tasks.forEach(task => task.classList.remove('active'))
                document.querySelector('.header-icon-trash').classList.remove('active')
                document.querySelector('.delete-mode-up').classList.remove('active')
                document.querySelector('.delete-mode').classList.remove('active')
            }
            if (e.target.classList.contains('modal__button-cancel') || e.target.classList.contains('modal-button-cancel-rem')) {
                fader.remove()
                const tasks = document.querySelectorAll('.settings-delete-mode.active')
                tasks.forEach(task => task.classList.remove('active'))
                document.querySelector('.header-icon-trash').classList.remove('active')
                document.querySelector('.delete-mode-up').classList.remove('active')
                document.querySelector('.delete-mode').classList.remove('active')

                const confirm = document.querySelectorAll('.settings-delete-mode-confirm')
                confirm.forEach(item => item.className = 'settings-delete-mode-icon')
            }
        })
    }

    deleteTasks(data) {
        data.data.forEach(item => {
            const task = document.querySelector(`[data-id='${item}']`)
            const category = task.parentElement

            if (task.parentElement.classList.contains('settings__daily-container')) {
                task.remove()
            } else {
                task.remove()
                if (!category.querySelector('div')) {
                    category.remove()
                }
            }
        })
    }

}

export default TasklistView