import lottie from 'lottie-web';
require('intersection-observer');
const path = require('path');

export default class LogoAnimation {

  animObj = null;

  init = () => {
    this.loadAnimation();
  };

  loadAnimation = () => {
    this.animObj = lottie.loadAnimation({
      container: document.getElementById('about__image'),
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: path.resolve(__dirname, 'dist/logo.json')
    });
  };

}
