
import eventBus from '../../eventBus';

import queryString from 'query-string';
import { createElement } from '../../utils/common';

class TimerView {
    constructor() {
        this.eventBus = eventBus;
    }

    renderUi() {
        if (document.querySelector('.header-icon-trash')) {
            document.querySelector('.header-icon-trash').setAttribute('style', 'display:none')
        }
        const buttons = document.querySelector('.header-wrap').querySelectorAll('button')
        buttons.forEach(button => button.classList.remove('active'))
    }
    getTaskData() {
        const parsed = queryString.parse(location.search);
        this.eventBus.publish('get-task', parsed.id)
    }
    drawTask(data) {
        document.querySelector('.header__span-title').innerHTML = data.title
        document.querySelector('.header__span-description').innerHTML = data.description
        const parent = document.querySelector('.modal-estimation')
        for( let i = 0; i < data.estimation; i++){
            createElement('span',parent,['star'],'&#63743')
        }

        // <input name="rating" value="1" type="radio" id="rating1">
        //         <label for="rating1">
        //             <span class="hide-visually">1 Star</span>
        //             <span aria-hidden="true" class="star star-1">&#63743;</span>
        //         </label>
    }


}


export default TimerView