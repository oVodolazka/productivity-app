const renderTemplate = template => console.log('render template', template)
import { EventBus } from 'light-event-bus';
import { reportsTemplate } from './components/reports/index.js'
import { taskListTemplate } from './components/taskList/index.js'
import {timerTemplate} from './components/timer/index.js'
import { settingsTemplate } from './components/settings/index.js'

export class Router {
  constructor() {
    this.routes = {
      '/task-list': {
        title: 'Task list',
        html: taskListTemplate()
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
        title: 'Reportsw',
        html: reportsTemplate()
      }
    }
    this.eventBus = new EventBus()
    const subscription = this.eventBus.subscribe('event', arg => console.log(arg))
    this.defaultRoute = '/task-list';
    this.headerDraw()
    this.initialRouteRender()
  }

  initialRouteRender() {
    const key = location.hash.slice(1);
    if (!this.routes[key]) {
      this.navigate(this.defaultRoute)
    } else {
      this.draw(location.hash.slice(1))
    }
  }

  draw(key) {
    const body = document.querySelector('body')

    if (document.querySelector('main')) {
      document.querySelector('main').innerHTML = this.routes[key].title;
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
    const self = this;

    for (let elem in this.routes) {
      const link = document.createElement('a')
      nav.appendChild(link)
      link.innerHTML = this.routes[elem].html
      link.setAttribute('href', this.routes[elem].title);
      link.addEventListener('click', function (event) {
        event.preventDefault()
        self.navigate(`${elem}`)
      })
    }
  }

  navigate(path) {
    history.pushState(null, null, `#${path}`);
    this.draw(path)
  }
}