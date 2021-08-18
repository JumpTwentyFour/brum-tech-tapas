export default class Overlay {
  clickHandlersAttached = false;

  closeHandlersAttached = false;

  currentOverlay = null;

  offsetY = window.pageYOffset;

  init = () => {
    this.attachOpenClickHandler('.js-speakers__item');
  };

  attachOpenClickHandler = (className) => {
    const clickHandlerElements = document.querySelectorAll(className);

    if (clickHandlerElements.length > 0) {
      clickHandlerElements.forEach((entry) => {
        entry.addEventListener('click', this.showOverlay);
      });
    }
  };

  showOverlay = (event) => {
    event.preventDefault();

    const { overlayId } = event.target.dataset;

    if (overlayId === undefined || overlayId === null || overlayId.length === 0) {
      return null;
    }

    const overlay = document.getElementById(overlayId);

    if (overlay === null) {
      return null;
    }

    this.currentOverlay = overlay;
    this.offsetY = window.pageYOffset;

    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `${-this.offsetY}px`;
    document.body.classList.add('overlay-open');

    overlay.classList.add('overlay--open');

    if (this.closeHandlersAttached === false) {
      this.attachCloseClickHandler('.overlay__close');
      this.attachCloseEscKeyHandler();
      this.closeHandlersAttached = true;
    }
  };

  attachCloseClickHandler = (className) => {
    const clickHandlerElements = document.querySelectorAll(className);

    if (clickHandlerElements.length === 0) {
      return null;
    }

    if (this.clickHandlersAttached === false) {
      clickHandlerElements.forEach((entry) => {
        entry.addEventListener('click', this.closeOverlay);
      });
      this.clickHandlersAttached = true;
    }
    return null;
  }

  attachCloseEscKeyHandler = () => {
    document.onkeydown = (event) => {
      if (event.keyCode === 27) {
        // Key: esc
        this.closeOverlay(event);
      }
    };
  }

  closeOverlay = (event) => {
    event.preventDefault();

    document.body.style.position = 'static';

    document.body.classList.remove('overlay-open');
    document.body.style.removeProperty('top');

    const speakers = document.querySelectorAll('.overlay');

    if (speakers.length > 0) {
      window.scrollTo(0, this.offsetY);

      speakers.forEach((speaker) => {
        speaker.classList.remove('overlay--open');
        speaker.removeEventListener(
          'wheel',
          {
            capture: false,
            passive: true,
          },
        );
      });
    }
  };
}
