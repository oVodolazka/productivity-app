import _ from 'lodash';
import lovePhotoSrc from '../assets/images/1.jpg';// example how to import images, not sure if u will need this
import test from './test';

function component() {
    const element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    const myIcon = new Image();
    myIcon.src = lovePhotoSrc;
  
    element.appendChild(myIcon);
    test();
  
    return element;
  }
  
  document.body.appendChild(component());
  