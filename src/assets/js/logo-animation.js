import lottie from 'lottie-web';

require('intersection-observer');
const path = require('path');
const animationJson = require('./logo.json');

export default class LogoAnimation {
  animObj = null;

  animContainer = document.getElementById('about__image');

  init = () => {
    if (this.animContainer.length !== null) {
      this.setupListener();
    }
  };

  loadAnimation = () => {
    this.animObj = lottie.loadAnimation({
      container: this.animContainer,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animationJson,

    });
  };

  setupListener = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0.2) {
          this.loadAnimation();
        }
      });
    });
    observer.observe(this.animContainer);
  };
}
