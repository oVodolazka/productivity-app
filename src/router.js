const renderTemplate = template => console.log('render template', template)

import { reportsTemplate } from './components/reports/index.js'
import { taskListTemplate, taskListComponent } from './components/taskList/index.js'
import { timerTemplate } from './components/timer/index.js'
import { settingsTemplate } from './components/settings/index.js'
import { welcomeTemplate } from './components/welcome/index.js'
import { headerTemplate } from './components/header/index.js'
import eventBus from './eventBus.js'


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
        html: settingsTemplate()
      },
      '/timer': {
        title: 'Timer',
        html: timerTemplate()
      },
      '/reports': {
        title: 'Reports',
        html: reportsTemplate()
      },
      '/welcome': {
        title: 'Welcome',
        html: welcomeTemplate()
      }
    }
    this.eventBus =  eventBus;
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
  }

  navigate(path) {
    history.pushState(null, null, `#${path}`);
    this.draw(path)
  }
}