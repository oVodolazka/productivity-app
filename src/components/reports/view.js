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
        const key = document.querySelector('.reports__button.active').innerHTML.toLowerCase()
        const type = document.querySelector('.footer__button-wrapper button.active').innerHTML.toLowerCase()
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
                document.querySelector('.reports__description-span--green').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--yellow').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--orange').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--orange').innerHTML = 'HIGH'
                document.querySelector('.reports__description-span--red').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--red').innerHTML = 'URGENT'
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
                document.querySelector('.reports__description-span--green').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--yellow').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--red').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--red').innerHTML = 'Failed'
                document.querySelector('.reports__description-span--orange').innerHTML = 'Successful'
                // document.querySelector('.highcharts-color-1').className = 'highcharts-point highcharts-color-3'
                //console.log(document.querySelector('.highcharts-color-1').className.animVal = 'highcharts-color-3') - это мне НАДО
            }
        } else if (key == 'week') {
            if (type == 'task') {
                Highcharts.chart('report-container', {
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        categories: ['Gold', 'Silver', 'Bronze', 'eed', 'last']
                    },

                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: 'Count medals'
                        }
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
                        name: 'Norway',
                        data: [1, 3, 4],
                        stack: 'Europe'
                    }, {
                        name: 'Germany',
                        data: [9, 8, 5],
                        stack: 'Europe'
                    }, {
                        name: 'United States',
                        data: [3, 2, 9],
                        stack: 'North America'
                    }, {
                        name: 'Canada',
                        data: [7, 2, 9],
                        stack: 'North America'
                    },]
                });
            } else if (type == 'pomodoros'){
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
                document.querySelector('.reports__description-span--green').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--yellow').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--red').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--red').innerHTML = 'Failed'
                document.querySelector('.reports__description-span--orange').innerHTML = 'Successful'
            }
        } else if (key == 'month') {
            if (type == 'tasks') {
                Highcharts.chart('report-container', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Major trophies for some English teams',
                        align: 'left'
                    },
                    xAxis: {
                        categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Count trophies'
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold',
                                color: ( // theme
                                    Highcharts.defaultOptions.title.style &&
                                    Highcharts.defaultOptions.title.style.color
                                ) || 'gray',
                                textOutline: 'none'
                            }
                        }
                    },
                    legend: {
                        align: 'left',
                        x: 70,
                        verticalAlign: 'top',
                        y: 70,
                        floating: true,
                        backgroundColor:
                            Highcharts.defaultOptions.legend.backgroundColor || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                        name: 'BPL',
                        data: [3, 5, 1, 13]
                    }, {
                        name: 'FA Cup',
                        data: [14, 8, 8, 12]
                    }, {
                        name: 'CL',
                        data: [0, 2, 6, 3]
                    }]
                });
            } else if (type == 'pomodoros') {
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
                document.querySelector('.reports__description-span--green').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--yellow').setAttribute('style', 'display:none')
                document.querySelector('.reports__description-span--red').setAttribute('style', 'display:block')
                document.querySelector('.reports__description-span--red').innerHTML = 'Failed'
                document.querySelector('.reports__description-span--orange').innerHTML = 'Successful'
            }
        }
        const texts = document.querySelectorAll('.highcharts-axis-labels text')
        texts.forEach(text => text.setAttribute('style', 'fill: #ffffff'))
    }

    removeEventListeners() {
        const container = document.querySelector('.reports_container')
        if (container) {
            container.removeEventListener('click', this.bindedonContainerClick)
        }
    }
}
export default ReportsView