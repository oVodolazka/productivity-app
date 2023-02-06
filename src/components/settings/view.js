import settingsCategoriesTemplate from '../settings/settings-categories.hbs'
import settingsTemplate from '../settings/index.hbs'
import { createElement } from '../../utils/common'
import eventBus from '../../eventBus';

class SettingsView {
    constructor() {
        this.eventBus = eventBus;
    }

    initEventListeners() {
        const container = document.querySelector('.settings_container')
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('settings__button-categories')) {
                container.innerHTML = settingsCategoriesTemplate()
            }
            if (e.target.classList.contains('settings__button-pomodoros')) {
                container.innerHTML = settingsTemplate()
                this.settingsFunctonality()
            }
            if (e.target.classList.contains('footer__button-task')) {
                window.router.navigate('/task-list')
            }
            if (e.target.classList.contains('footer__button-save')) {
                const time = document.querySelector('.work-time').innerHTML
                const iteration = document.querySelector('.work-iteration').innerHTML
                const longBreak = document.querySelector('.long-break').innerHTML
                const shortBreak = document.querySelector('.short-break').innerHTML
                this.eventBus.publish('save-button-pressed', { time, iteration, longBreak, shortBreak })
            }
        })
    }

    settingsFunctonality() {
        const buttons = document.querySelectorAll('.settings__button-minus , .settings__button-plus')
        const self = this;
        buttons.forEach(item => item.addEventListener('click', (event) => this.changeValue(event, self)))
        const buttonsRem = document.querySelector('.header-wrap').querySelectorAll('button')
        buttonsRem.forEach(button => button.classList.remove('active'))
        document.querySelector('.header__setting-icon').classList.add('active')
        if (document.querySelector('.header-icon-trash')) {
            document.querySelector('.header-icon-trash').setAttribute('style', 'display:none')
        }

        if (document.querySelector('.settings__button-pomodoros').classList.contains('active')) {
            this.eventBus.publish('load-data')
        }

    }

    changeValue(event, self) {
        if (event.target.classList.contains('disabled')) {
            return
        }
        const value = event.target.getAttribute('data-value')
        event.target.parentElement.querySelector('.settings__button__span').innerHTML = Number(event.target.parentElement.querySelector('.settings__button__span').innerHTML) + Number(value);
        const buttonValue = event.target.parentElement.querySelector('.settings__button__span').innerHTML;

        if (event.target.getAttribute('data-min') !== null) {
            event.target.parentElement.querySelector('.settings__button-plus').classList.remove('disabled')
            if (event.target.getAttribute('data-min') == buttonValue) {
                event.target.classList.add('disabled')
            }
            else if (event.target.getAttribute('data-min') < buttonValue) {
                event.target.classList.remove('disabled')
            }
        }
        else if (event.target.getAttribute('data-max') !== null) {
            event.target.parentElement.querySelector('.settings__button-minus').classList.remove('disabled')
            if (event.target.getAttribute('data-max') == buttonValue) {
                event.target.classList.add('disabled')
            }
            else if (event.target.getAttribute('data-max') > buttonValue) {
                event.target.classList.remove('disabled')
            }
        }
        self.drawCycle()
    }


    drawCycle() {
        let cycle = document.querySelector('.footer__cycle-wrapper')
        cycle.innerHTML = '';
        const footerTop = document.querySelector('.footer-top')
        footerTop.innerHTML = '';
        const footerBottom = document.querySelector('.footer-bottom')
        footerBottom.innerHTML = '';
        const workTime = document.querySelector('.work-time').innerHTML
        const workIteration = document.querySelector('.work-iteration')
        const shortBreak = document.querySelector('.short-break').innerHTML
        const longBreak = document.querySelector('.long-break').innerHTML

        const shortBreakSum = (Number(workIteration.innerHTML - 1) * 2) * Number(shortBreak);
        const firstCycle = Number(workTime) * Number(workIteration.innerHTML) + Number(longBreak) + shortBreakSum / 2;
        const totalMin = Number(workTime) * Number(workIteration.innerHTML) + Number(workTime) * Number(workIteration.innerHTML) + Number(longBreak) + shortBreakSum;
        const pixelsInOneMinute = 100 / totalMin

        let width = 0;
        let intervalInminutes = 0;
        let amountOfInterval = Math.round(totalMin / 30) - 1;
        let interval = pixelsInOneMinute * 30;
        const arr = new Array(amountOfInterval).fill('').map((item, index) => {
            width += interval;
            intervalInminutes += 30;
            return createElement('span', footerBottom, ['footer-bottom-item'], this.toHoursAndMinutes(intervalInminutes), [{ style: `left:${width}%` }])
        })

        createElement('span', footerTop, ['footer-top-left'], '0m')
        createElement('span', footerTop, ['footer-top-center'], `First cycle: ${this.toHoursAndMinutes(firstCycle)}`, [{ style: `left:${firstCycle * pixelsInOneMinute - 1}%` }]); //!!!!
        createElement('span', footerTop, ['footer-top-right'], `${this.toHoursAndMinutes(totalMin)}`)

        for (let i = 0; i < workIteration.innerHTML - 1; i++) {
            createElement('div', cycle, ['footer__cycle--yellow'], null, [{ style: `width:${workTime * pixelsInOneMinute}%` }]);
            createElement('div', cycle, ['footer__cycle--blue'], null, [{ style: `width:${shortBreak * pixelsInOneMinute}%` }]);
        }
        createElement('div', cycle, ['footer__cycle--yellow'], null, [{ style: `width:${workTime * pixelsInOneMinute}%` }]);
        createElement('div', cycle, ['footer__cycle--violet'], null, [{ style: `width:${longBreak * pixelsInOneMinute}%` }]);
        for (let i = 0; i < workIteration.innerHTML - 1; i++) {
            createElement('div', cycle, ['footer__cycle--yellow'], null, [{ style: `width:${workTime * pixelsInOneMinute}%` }]);
            createElement('div', cycle, ['footer__cycle--blue'], null, [{ style: `width:${shortBreak * pixelsInOneMinute}%` }]);
        }
        createElement('div', cycle, ['footer__cycle--yellow'], null, [{ style: `width:${workTime * pixelsInOneMinute}%` }]);
    }

    toHoursAndMinutes(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours == 0) {
            return `${minutes}m`
        }
        else {
            return `${hours}h${minutes}m`
        }
    }

    drawSettingsData(data) {
        if (document.querySelector('.header__setting-icon').classList.contains('active') && document.querySelector('.settings__button-pomodoros').classList.contains('active')) {
            document.querySelector('.work-time').innerHTML = data.time
            document.querySelector('.work-iteration').innerHTML = data.iteration
            document.querySelector('.long-break').innerHTML = data.longBreak
            document.querySelector('.short-break').innerHTML = data.shortBreak
            const minuses = document.querySelectorAll('.settings__button-minus')

            minuses.forEach(button => {
                if (button.getAttribute('data-min') == button.nextElementSibling.innerHTML) {
                    button.classList.add('disabled')
                    button.nextElementSibling.nextElementSibling.classList.remove('disabled')
                }
            })

            const pluses = document.querySelectorAll('.settings__button-plus')

            pluses.forEach(button => {
                if (button.getAttribute('data-max') !== button.previousElementSibling.innerHTML) {
                    button.classList.remove('disabled')
                }
            })
            this.drawCycle()
        }
    }
}

export default SettingsView