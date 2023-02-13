import eventBus from '../../eventBus';
import { getDay } from '../../utils/common'
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting';
import _ from 'lodash'

Exporting(Highcharts);

class ReportsView {
    constructor() {
        this.eventBus = eventBus
        this.bindedonContainerClick = this.onContainerClick.bind(this)
    }

    renderUi() {
        if (document.querySelector('.header-icon-trash')) {
            document.querySelector('.header-icon-trash').setAttribute('style', 'display:none')
        }
        const buttons = document.querySelector('.header-wrap').querySelectorAll('button')
        buttons.forEach(button => button.classList.remove('active'))
        document.querySelector('.header-icon-reports').classList.add('active')
        this.eventBus.publish('load-report-data')
    }
    initEventListeners() {
        const container = document.querySelector('.reports_container')
        container.addEventListener('click', this.bindedonContainerClick)
    }

    onContainerClick(e) {
        if (e.target.classList.contains('day')) {
            document.querySelector('.day').classList.add('active')
            document.querySelector('.month').classList.remove('active')
            document.querySelector('.week').classList.remove('active')
            this.eventBus.publish('load-report-data')
        }
        else if (e.target.classList.contains('week')) {
            document.querySelector('.day').classList.remove('active')
            document.querySelector('.month').classList.remove('active')
            document.querySelector('.week').classList.add('active')
            this.eventBus.publish('load-report-data')
        }
        else if (e.target.classList.contains('month')) {
            document.querySelector('.day').classList.remove('active')
            document.querySelector('.month').classList.add('active')
            document.querySelector('.week').classList.remove('active')
            this.eventBus.publish('load-report-data')
        } else if (e.target.classList.contains('pomodoros')) {
            document.querySelector('.tasks').classList.remove('active')
            document.querySelector('.pomodoros').classList.add('active')
            this.eventBus.publish('load-report-data')
        } else if (e.target.classList.contains('tasks')) {
            document.querySelector('.tasks').classList.add('active')
            document.querySelector('.pomodoros').classList.remove('active')
            this.eventBus.publish('load-report-data')
        }
    }
    updateHighcharts(data) {
        const key = document.querySelector('.reports__button.active') ? document.querySelector('.reports__button.active').innerHTML.toLowerCase() : ''
        const type = document.querySelector('.footer__button-wrapper button.active') ? document.querySelector('.footer__button-wrapper button.active').innerHTML.toLowerCase() : ''
        const today = getDay()
        const past7Days = [...Array(7).keys()].map(index => {
            let date = new Date();
            date.setDate(date.getDate() - index);
            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            date = dd + '.' + mm + '.' + yyyy;
            return date;
        });
        const past31Days = [...Array(31).keys()].map(index => {
            let date = new Date();
            date.setDate(date.getDate() - index);
            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            date = dd + '.' + mm + '.' + yyyy;
            return date;
        });
        const obj = {
            day: data.filter(item => item.finishDate == today && item.completed == true),
            week: data.filter(item => past7Days.includes(item.finishDate) && item.completed == true),
            month: data.filter(item => past31Days.includes(item.finishDate) && item.completed == true)
        }
        const period = obj[key]
        const result = _.groupBy(period.filter(item => item.task == 'successful'), 'priority')

        if (key == 'day') {
            if (type == 'tasks') {
                Highcharts.chart('report-container', {
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: 'Total percent market share'
                        },
                    },
                    legend: {
                        enabled: false
                    },

                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:#2f3e4f">{point.name}</span>: <b>{point.y:.2f}</b> <br/>'
                    },
                    series: [
                        {
                            name: 'TASKS',
                            colorByPoint: true,
                            data: [
                                {
                                    name: 'URGENT',
                                    y: result.urgent ? result.urgent.length : 0,
                                    drilldown: 'URGENT'
                                },
                                {
                                    name: 'HIGH',
                                    y: result.high ? result.high.length : 0,
                                    drilldown: 'HIGH'
                                },
                                {
                                    name: 'MIDDLE',
                                    y: result.middle ? result.middle.length : 0,
                                    drilldown: 'MIDDLE'
                                },
                                {
                                    name: 'LOW',
                                    y: result.low ? result.low.length : 0,
                                    drilldown: 'LOW'
                                },
                                {
                                    name: 'FAILED',
                                    y: period.filter(item => item.task == 'failed') ? period.filter(item => item.task == 'failed').length : 0,
                                    drilldown: 'FAILED'
                                },
                            ]
                        }
                    ],
                })
                document.querySelector('.reports__description-span--grey').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--orange').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--yellow').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--orange').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--green').innerHTML = 'High'
                document.querySelector('.reports__description-span--red').innerHTML = 'Urgent'
            }
            else if (type == 'pomodoros') {
                const pomodoros = []
                period.forEach(item => item.pomodoros.forEach(pomodoro => pomodoros.push(pomodoro)))
                const successful = pomodoros.filter(item => item == 'finished')
                const failed = pomodoros.filter(item => item == 'failed')

                Highcharts.chart('report-container', {
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: 'Total percent market share'
                        },
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">Pomodoros</span><br>',
                        pointFormat: '<span style="color:#2f3e4f">{point.name}</span>: <b>{point.y:.2f}</b> <br/>'
                    },
                    series: [
                        {
                            name: 'TASKS',
                            colorByPoint: true,
                            data: [
                                {
                                    name: 'FAILED',
                                    y: failed ? failed.length : 0,
                                    drilldown: 'FAILED'
                                },
                                {
                                    name: 'SUCCESSFUL',
                                    y: successful ? successful.length : 0,
                                    drilldown: 'SUCCESSFUL'
                                },
                            ]
                        }
                    ],
                })
                document.querySelector('.reports__description-span--grey').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--orange').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--yellow').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--red').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--red').innerHTML = 'Failed'
                document.querySelector('.reports__description-span--green').innerHTML = 'Successful'
            }
        } else if (key == 'week') {
            if (type == 'tasks') {
                const days = []
                past7Days.forEach(item => days.push(`${item[0]}${item[1]}`))

                const urg = this.prepareArray(past7Days, data, 'urgent');
                const high = this.prepareArray(past7Days, data, 'high')
                const middle = this.prepareArray(past7Days, data, 'middle')
                const low = this.prepareArray(past7Days, data, 'low')
                const failed = this.prepareArray(past7Days, data, 'failed')
                Highcharts.chart('report-container', {
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        categories: days.reverse()
                    },

                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.x + '</b><br/>' +
                                this.series.name + ': ' + this.y + '<br/>' +
                                'Total: ' + this.point.stackTotal;
                        }
                    },

                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },

                    series: [{
                        name: 'Urgent',
                        data: urg.reverse()
                    }, {
                        name: 'High',
                        data: high.reverse()
                    }, {
                        name: 'Middle',
                        data: middle.reverse()
                    }, {
                        name: 'Low',
                        data: low.reverse()
                    }, {
                        name: 'Failed',
                        data: failed.reverse(),
                        stack: 'failed'
                    },]
                });
                document.querySelector('.reports__description-span--grey').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--orange').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--yellow').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--orange').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--green').innerHTML = 'High'
                document.querySelector('.reports__description-span--red').innerHTML = 'Urgent'
            } else if (type == 'pomodoros') {
                const days = []
                past7Days.forEach(item => days.push(`${item[0]}${item[1]}`))
                const obj = this.preparedObject(past7Days, period)
                const groups = ['failed', 'finished'];
                const result = groups.map(item => ({
                    name: item,
                    data: Object.keys(obj).reverse().map(key => obj[key].filter(status => status === item).length)
                }))

                Highcharts.chart('report-container', {
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        categories: days.reverse()
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br/>',
                        pointFormat: 'Pomodoros: {point.y}'
                    },

                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },

                    series: [{
                        name: 'Failed',
                        data: result[0].data
                    }, {
                        name: 'Successful',
                        data: result[1].data,
                        stack: 'successful'
                    }]
                });

                document.querySelector('.reports__description-span--grey').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--orange').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--yellow').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--red').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--red').innerHTML = 'Failed'
                document.querySelector('.reports__description-span--green').innerHTML = 'Successful'
                const sucs = document.querySelectorAll('.highcharts-color-1')
                sucs.forEach(item => {
                    item.className.baseVal = 'highcharts-series highcharts-series-3 highcharts-column-series highcharts-color-3 highcharts-tracker'
                })
            }
        } else if (key == 'month') {
            if (type == 'tasks') {

                const urg = this.prepareArray(past31Days, data, 'urgent')
                const high = this.prepareArray(past31Days, data, 'high')
                const middle = this.prepareArray(past31Days, data, 'middle')
                const low = this.prepareArray(past31Days, data, 'low')
                const failed = this.prepareArray(past31Days, data, 'failed')

                const days = []
                past31Days.forEach(item => days.push(`${item[0]}${item[1]}`))

                Highcharts.chart('report-container', {
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        categories: days.reverse()
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Count trophies'
                        },
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br/>',
                        pointFormat: 'Tasks: {point.y}'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            dataLabels: {
                                enabled: true
                            }
                        }
                    },
                    series: [{
                        name: 'Urgent',
                        data: urg.reverse()
                    }, {
                        name: 'High',
                        data: high.reverse()
                    }, {
                        name: 'Middle',
                        data: middle.reverse()
                    },
                    {
                        name: 'Low',
                        data: low.reverse()
                    },
                    {
                        name: 'Failed',
                        data: failed.reverse()
                    }
                    ]
                });
                document.querySelector('.reports__description-span--grey').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--orange').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--yellow').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--orange').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--green').innerHTML = 'High'
                document.querySelector('.reports__description-span--red').innerHTML = 'Urgent'
            } else if (type == 'pomodoros') {
                const days = []
                past31Days.forEach(item => days.push(`${item[0]}${item[1]}`))
                const obj = this.preparedObject(past31Days, period)
                const groups = ['failed', 'finished'];
                const result = groups.map(item => ({
                    name: item,
                    data: Object.keys(obj).reverse().map(key => obj[key].filter(status => status === item).length)
                }))

                Highcharts.chart('report-container', {
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        categories: days.reverse()
                    },

                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.x + '</b><br/>' +
                                this.series.name + ': ' + this.y + '<br/>'
                        }
                    },

                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },

                    series: [{
                        name: 'Failed',
                        data: result[0].data
                    }, {
                        name: 'Successful',
                        data: result[1].data,
                    }]
                });
                document.querySelector('.reports__description-span--grey').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--orange').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--yellow').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--red').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--red').innerHTML = 'Failed'
                document.querySelector('.reports__description-span--green').innerHTML = 'Successful'

                const sucs = document.querySelectorAll('.highcharts-color-1')
                sucs.forEach(item => {
                    item.className.baseVal = 'highcharts-series highcharts-series-3 highcharts-column-series highcharts-color-3 highcharts-tracker'
                })
            }
        }
        const texts = document.querySelectorAll('.highcharts-axis-labels text')
        texts.forEach(text => text.setAttribute('style', 'fill: #ffffff'))
        const numbers = document.querySelectorAll('.highcharts-data-label text')
        numbers.forEach(text => text.setAttribute('style', 'fill: #ffffff00'))
    }

    prepareArray(past7Days, data, priority) {
        const result = []
        if (priority !== 'failed') {
            past7Days.forEach(day => {
                result.push(data.filter(item => item.finishDate == day && item.completed == true && item.priority == priority && item.task == 'successful').length)
            })
        } else {
            past7Days.forEach(day => {
                result.push(data.filter(item => item.task == 'failed' && item.finishDate == day && item.completed == true).length)
            })
        }
        return result
    }

    removeEventListeners() {
        const container = document.querySelector('.reports_container')
        if (container) {
            container.removeEventListener('click', this.bindedonContainerClick)
        }
    }

    preparedObject(timeline, period) {
        const obj = {}
        period.forEach(item => {
            timeline.forEach(date => {
                if (!obj[date]) {
                    obj[date] = []
                }
            })
            if (obj[item.finishDate]) {
                obj[item.finishDate] = [...obj[item.finishDate], ...item.pomodoros]
            } else {
                obj[item.finishDate] = item.pomodoros
            }
        })
        return obj
    }
}
export default ReportsView