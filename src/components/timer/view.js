
import eventBus from '../../eventBus';
import queryString from 'query-string';
import { createElement } from '../../utils/common';
import ProgressBar from 'progressbar.js'
let intervalId;

class TimerView {
    constructor() {
        this.eventBus = eventBus;
        this.bindedonContainerClick = this.onContainerClick.bind(this)
        this.self = this;

    }
    initEventListeners() {
        const container = document.querySelector('main')
        container.addEventListener('click', this.bindedonContainerClick)
    }
    onContainerClick(event) {
        if (event.target.classList.contains('modal__button-start')) {
            this.eventBus.publish('start-pressed')
        }
        else if (event.target.classList.contains('modal-timer-button')) {
            const stars = document.querySelectorAll('.star')
            if (stars.length !== 5) {
                const parent = document.querySelector('.modal-estimation')
                createElement('span', parent, ['star-timer', 'not-started'], '&#63743')
            }
        }
        else if (event.target.classList.contains('modal__button-fail')) {
            const parsed = queryString.parse(location.search);
            const pomodorosId = document.querySelector('.star-timer.not-started').getAttribute('data-id')
            this.eventBus.publish('fail-pomodoros-pressed', { id: parsed.id, pomodorosId, class: 'failed' })
            document.querySelector('.star-timer.not-started').className = 'star-timer failed'
            document.querySelector('.modal__button-fail').remove()
            document.querySelector('.modal__button-finish').remove()
            if (document.querySelector('.star-timer.not-started')) {
                this.eventBus.publish('get-settings')
            }
            else {
                document.querySelector('.modal-span').innerHTML = 'You Completed Task'
                document.querySelector('.modal-span').setAttribute('style', 'font-size: 16px')
                document.querySelector('.modal-span-min').innerHTML = ''
                document.querySelector('.modal-timer__left-button').setAttribute('style', 'display: block')
                document.querySelector('.modal-timer__right-button').setAttribute('style', 'display: block')
                const parsed = queryString.parse(location.search);
                this.eventBus.publish('task-completed-pressed', parsed.id)
                if (document.querySelector('.timer').querySelector('svg')) {
                    document.querySelector('.timer').querySelector('svg').remove()
                }
                clearInterval(intervalId)
            }
        }
        else if (event.target.classList.contains('modal__button-finish')) {
            const parsed = queryString.parse(location.search);
            const pomodorosId = document.querySelector('.star-timer.not-started').getAttribute('data-id')
            this.eventBus.publish('finish-pomodoros-pressed', { id: parsed.id, pomodorosId, class: 'finished' })
            document.querySelector('.star-timer.not-started').className = 'star-timer finished'
            document.querySelector('.modal__button-fail').remove()
            document.querySelector('.modal__button-finish').remove()

            if (document.querySelector('.star-timer.not-started')) {
                this.eventBus.publish('get-settings')
            } else {
                const parsed = queryString.parse(location.search);
                this.eventBus.publish('task-completed-pressed', parsed.id)
                document.querySelector('.modal-span').innerHTML = 'You Completed Task'
                document.querySelector('.modal-span').setAttribute('style', 'font-size: 16px')
                document.querySelector('.modal-span-min').innerHTML = ''
                document.querySelector('.modal-timer__left-button').setAttribute('style', 'display: block')
                document.querySelector('.modal-timer__right-button').setAttribute('style', 'display: block')

                if (document.querySelector('.timer').querySelector('svg')) {
                    document.querySelector('.timer').querySelector('svg').remove()
                }
                clearInterval(intervalId)
            }
        }
        else if (event.target.classList.contains('modal-timer__left-button')) {
            window.router.navigate('/task-list')
        }
        else if (event.target.classList.contains('modal-timer__right-button')) {
            window.router.navigate('/reports')
        }
        else if (event.target.classList.contains('modal__button-start-task')) {
            this.eventBus.publish('start-pressed')
            document.querySelector('.modal__button-start-task').remove()
            document.querySelector('.modal__button-finish-task').remove()
            const buttonWrap = document.querySelector('.modal__button-wrap')
            createElement('button', buttonWrap, ['modal__button-fail'], 'Fail Pomodora')
            createElement('button', buttonWrap, ['modal__button-finish'], 'Finish Pomodora')
        }
        else if (event.target.classList.contains('modal__button-finish-task')) {
            const parsed = queryString.parse(location.search);
            this.eventBus.publish('task-completed-pressed', parsed.id)

            document.querySelector('.modal__button-start-task').remove()
            document.querySelector('.modal__button-finish-task').remove()

            document.querySelector('.modal-span').innerHTML = 'You Completed Task'
            document.querySelector('.modal-span-min').innerHTML = ''

            document.querySelector('.modal-span').setAttribute('style', 'font-size: 16px')
            document.querySelector('.modal-timer__left-button').setAttribute('style', 'display: block')
            document.querySelector('.modal-timer__right-button').setAttribute('style', 'display: block')

            if (document.querySelector('.timer').querySelector('svg')) {
                document.querySelector('.timer').querySelector('svg').remove()
            }
            clearInterval(intervalId)
        }
    }

    removeEventListeners() {
        const container = document.querySelector('main')
        container.removeEventListener('click', this.bindedonContainerClick)
    }

    getTaskData() {
        const parsed = queryString.parse(location.search);
        document.querySelector('.header-icon-trash').setAttribute('style', 'display:none')
        this.eventBus.publish('get-task', parsed.id)
        const stars = document.querySelector('.star-timer.not-started')
        if (stars) {
            const buttons = document.querySelector('.header-wrap').querySelectorAll('button')
            buttons.forEach(button => button.classList.remove('active'))
        }
    }
    
    drawTask(data) {
        document.querySelector('.header__span-title').innerHTML = data.title
        document.querySelector('.header__span-description').innerHTML = data.description
        const parent = document.querySelector('.modal-estimation')
        for (let i = 0; i < data.pomodoros.length; i++) {
            createElement('span', parent, ['star-timer', `${data.pomodoros[i]}`], '&#63743', [{ 'data-id': i }])
        }

        const stars = document.querySelector('.star-timer.not-started')
        if (!stars) {
            document.querySelector('.modal-span').innerHTML = 'You Completed Task'
            document.querySelector('.modal-span').setAttribute('style', 'font-size: 16px')
            document.querySelector('.modal__button-start').remove()
            document.querySelector('.modal-timer__left-button').setAttribute('style', 'display: block')
            document.querySelector('.modal-timer__right-button').setAttribute('style', 'display: block')
            clearInterval(intervalId)
        }
    }

    renderTimer(data) {

        clearInterval(intervalId)
        let minutesToSeconds = data.time * 60
        intervalId = setInterval(() => {
            let countdownNumberEl = document.querySelector('.modal-span')
            data.time = --data.time;
            countdownNumberEl.textContent = `${data.time}`;
            if (data.time == 0) {
                clearInterval(intervalId)
                document.querySelector('.modal-span').innerHTML = 'Timer is over'
                document.querySelector('.modal-span-min').innerHTML = ''
                document.querySelector('.modal-span').setAttribute('style', 'font-size:14px')
            }
        }, 600)

        if (document.querySelector('.timer').querySelector('svg')) {
            document.querySelector('.timer').querySelector('svg').remove()
        }
        const timer = document.querySelector('.timer')
        var bar = new ProgressBar.Circle(timer, {
            strokeWidth: 15,
            duration: `${minutesToSeconds * 1000}`,
            color: '#879bab',
            trailColor: 'transparent',
            trailWidth: 1,
            svgStyle: null,
        });

        bar.animate(1.0);

        document.querySelector('.modal-span').innerHTML = `${data.time}`
        document.querySelector('.modal-span-min').innerHTML = 'min'
        const parent = document.querySelector('.modal__progress')
        if (document.querySelectorAll('.star-timer').length != 5 && !document.querySelector('.modal-timer-button')) {
            createElement('button', parent, ['modal-timer-button'], '+')
        }

        if (document.querySelector('.modal__button-start')) {
            document.querySelector('.modal__button-start').remove()
        }

        const buttonWrap = document.querySelector('.modal__button-wrap')
        if (!document.querySelector('.modal__button-fail')) {
            createElement('button', buttonWrap, ['modal__button-fail'], 'Fail Pomodora')
        }

        if (!document.querySelector('.modal__button-finish')) {
            createElement('button', buttonWrap, ['modal__button-finish'], 'Finish Pomodora')
        }
    }

    drawbreak(data) {
        if (document.querySelector('.timer')) {
            document.querySelector('.timer').innerHTML = ''
            document.querySelector('.timer').remove()
        }
        const parent = document.querySelector('#countdown')
        createElement('div', parent, ['timer'])

        document.querySelector('.modal-span').innerHTML = data.shortBreak
        document.querySelector('.modal-span').setAttribute('style', 'font-size:19px')

        document.querySelector('.modal-span-min').innerHTML = 'min'
        const buttonWrap = document.querySelector('.modal__button-wrap')
        createElement('button', buttonWrap, ['modal__button-start-task'], 'Start Pomodora')
        createElement('button', buttonWrap, ['modal__button-finish-task'], 'Finish Task')
        clearInterval(intervalId)
        intervalId = setInterval(() => {
            let countdownNumberEl = document.querySelector('.modal-span')
            data.shortBreak = --data.shortBreak;
            countdownNumberEl.textContent = `${data.shortBreak}`;
            if (data.shortBreak == 0) {
                clearInterval(intervalId)
                document.querySelector('.modal-span').innerHTML = 'Break is over'
                document.querySelector('.modal-span').setAttribute('style', 'font-size:14px')
                document.querySelector('.modal-span-min').innerHTML = ''
            }
        }, 60000)
        let minutesToSeconds = data.shortBreak * 60
        const timer = document.querySelector('.timer')
        var bar = new ProgressBar.Circle(timer, {
            strokeWidth: 15,
            duration: `${minutesToSeconds * 1000}`,
            color: '#879bab',
            trailColor: 'transparent',
            trailWidth: 1,
            svgStyle: null,
        });
        bar.animate(1.0);
    }
    removeTimer() {
        clearInterval(intervalId)
    }
}


export default TimerView