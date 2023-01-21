// const renderTemplate = template => console.log('render template', template)

import { ReportsTemplate, ReportsComponent } from './components/reports/index.js'
import { taskListTemplate, taskListComponent } from './components/taskList/index.js'
import { TimerTemplate, TimerComponent } from './components/timer/index.js'
import { SettingsTemplate, SettingsComponent } from './components/settings/index.js'
import { headerTemplate } from './components/header/index.js'
import eventBus from './eventBus.js'
import { WelcomeComponent, WelcomeTemplate } from './components/welcome/index.js'

export class Router {
  constructor() {
    this.routes = {
      '/task-list': {
        title: 'Task list',
        html: taskListTemplate(),
        component: taskListComponent
      },
      '/settings': {
        title: 'settings',
        html: SettingsTemplate(),
        component: SettingsComponent
      },
      '/timer': {
        title: 'Timer',
        html: TimerTemplate(),
        component: TimerComponent
      },
      '/reports': {
        title: 'Reports',
        html: ReportsTemplate(),
        component: ReportsComponent
      },
      '/welcome': {
        title: 'Welcome',
        html: WelcomeTemplate(),
        component: WelcomeComponent
      }
    }
    this.eventBus = eventBus;
    this.defaultRoute = '/task-list';
    this.headerDraw()
    this.initialRouteRender()

  }

  initialRouteRender() {
    const firstVisit = JSON.parse(localStorage.getItem('firstVisit'))
    const key = location.hash.slice(1);

    if (!firstVisit) {
      localStorage.setItem('firstVisit', JSON.stringify('visited'))
      this.navigate(('/welcome'))
    } else if (this.routes[key]) {
      this.renderComponent(key)
    } else if (!this.routes[key]) {
      this.navigate(this.defaultRoute)
    }
  }

  renderComponent(key) {
    this.draw(key)
    this.routes[key].component.init()
  }

  draw(key) {
    const body = document.querySelector('body')
    if (document.querySelector('main')) {
      document.querySelector('main').innerHTML = this.routes[key].html;
    } else {
      const main = document.createElement('main')
      main.innerHTML = this.routes[key].html
      body.appendChild(main)
    }
  }

  headerDraw() {
    const body = document.querySelector('body')
    const header = document.createElement('header')
    body.appendChild(header)
    const nav = document.createElement('nav')
    header.appendChild(nav);
    header.innerHTML = headerTemplate()

    const headerContainer = document.querySelectorAll('.header-wrap button')

    headerContainer.forEach(item => item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('header-icon-trash')) {
        const path = e.target.getAttribute('data-path')
        this.navigate(path)
      } else if (e.target.classList.contains('header-icon-trash')) {
        e.target.classList.toggle('active')
        document.querySelector('.delete-mode-up').classList.toggle('active')
        document.querySelector('.delete-mode').classList.toggle('active')
        const tasks = document.querySelectorAll('.settings-delete-mode')
        tasks.forEach(task => task.classList.toggle('active'))
        const buttons = (document.querySelectorAll('.select,.deselect'))
        buttons.forEach(button => button.classList.remove('active'))
        document.querySelector('.header-icon-trash-span').innerHTML = '0'
        document.querySelectorAll('.settings-delete-mode-confirm').forEach(item => item.className = 'settings-delete-mode-icon')
      }
    })
    )

  }

  navigate(path, param) {
    if (param) {
      history.pushState(null, null, `${param}`);
    } else {
      history.pushState(null, null, `${path}`);
    }
    this.renderComponent(path)
    // this.draw(path)
  }
}