import headerTemplate from './index.hbs'
import _ from 'lodash';
import './header.less';

export { headerTemplate }


function scrollDebounce() {

    if (window.scrollY !== 0) {
        document.querySelector('.header').classList.add('active')
        document.querySelector('.header__img').classList.add('active')
    }
    else if (window.scrollY == 0) {
        document.querySelector('.header').classList.remove('active')
        document.querySelector('.header__img').classList.remove('active')
    }
}
const debounce = _.debounce(scrollDebounce, 50);

window.addEventListener('scroll', debounce);