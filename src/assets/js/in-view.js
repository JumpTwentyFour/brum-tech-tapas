export default class InView {

  init = () => {
    const animatableElements = document.querySelectorAll('[data-inview]');
    this.setupRequireClass(animatableElements);
    this.setupObserver(animatableElements);
  };

  setupRequireClass = (animatableElements) => {
    animatableElements.forEach((entry) => {
      entry.classList.add('off-screen');
    });
  };

  setupObserver = (animatableElements) => {
    this.setupListener(animatableElements);
  };

  setupListener = (animatableElements) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const offsetValue = entry.target.dataset.offset;
        if (entry.intersectionRatio > offsetValue) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    });

    animatableElements.forEach((element) => {
      observer.observe(element);
    });
  };
}
