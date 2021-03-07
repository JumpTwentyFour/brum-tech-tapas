import isEmail from 'validator/lib/isEmail';
import matches from 'validator/es/lib/matches';
import signUpApi from './api/sign-up';

const TellUsMore = class TellUsMore {
  signUpEmail = document.getElementById('email')

  signUpName = document.getElementById('name')

  signUpTrigger = document.querySelectorAll('.js-form-btn')

  failedValidation = []

  setupObservers = () => {
    this.signUpTrigger.forEach((trigger) => {
      console.log('erere');
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.resetForm();

        if (this.validateForm()) {
          this.submitForm();
        }
      });
    });
  }

  resetForm = () => {
    this.failedValidation.forEach((element) => {
      this.setErrorMessage(element, '');
    });
    this.failedValidation = [];

    this.clearErrorMessages();
  }

  clearErrorMessages = () => {
    const errorMessages = document.getElementsByClassName('js-error-message');

    while (errorMessages[0]) {
      errorMessages[0].parentNode.removeChild(errorMessages[0]);
    }
  }

  setErrorMessage = (element, error) => {
    const parent = '.field';
    element
      .closest(parent)
      .insertAdjacentHTML(
        'beforeend',
        `<p class="js-error-message">${error}</p>`,
      );
  }

  validateForm = () => {
    if (!matches(this.signUpName.value, /.+/g)) {
      this.failedValidation.push(this.signUpName);
      this.setErrorMessage(this.signUpName, 'Please enter a valid full name.');
    }

    if (!isEmail(this.signUpEmail.value)) {
      this.failedValidation.push(this.signUpEmail);
      this.setErrorMessage(
        this.signUpEmail,
        'Please enter a valid email address.',
      );
    }

    return this.failedValidation.length === 0;
  }

  formatDataForApi = () => {
    const interests = {};

    return {
      name: this.signUpName.value,
      email: this.signUpEmail.value,
    };
  }

  submitForm = () => {
    signUpApi
      .signUp(this.formatDataForApi())
      .then((response) => {
        this.showThanksMessage();
      })
      .catch((response) => {});
  }

  showThanksMessage = () => {
    this.thankYou
      .closest('.overlay__thanks')
      .classList.add('overlay__thanks--show');
  }

  init = () => {
    this.setupObservers();
  }
};

export default TellUsMore;
