const renderTemplate = template => console.log('render template', template)
import { EventBus } from 'light-event-bus';

export class Router {
  constructor() {
    this.routes = {
      '/task-list': {
        title: 'Task list',
        html: 'd'//settingsTemplate;
      },
      '/settings': {
        title: 'setting',
        html: '<p>settings</p>'
      },
      '/timer': {
        title: 'Timer',
        html: '<p>timer<p>'
      },
      '/reports': {
        title: 'Reports',
        html: '<p>reports<p>'
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
  
    // setTimeout(() => this.eventBus.publish('event', 'message') , 1000);
  }

  navigate(path) {
    history.pushState(null, null, `#${path}`);
    this.draw(path)
  }
}