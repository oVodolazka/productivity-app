import headerTemplate from './index.hbs'

import  './header.less';

export { headerTemplate }


window.addEventListener('scroll',(event) => {
    if(window.scrollY !== 0){
        document.querySelector('.header').classList.add('active')
        document.querySelector('.header__img').classList.add('active')
    }
    else if(window.scrollY == 0){
        document.querySelector('.header').classList.remove('active')
        document.querySelector('.header__img').classList.remove('active')
    }
});



