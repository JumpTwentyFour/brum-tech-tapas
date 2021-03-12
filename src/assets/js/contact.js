import isEmail from 'validator/lib/isEmail';
import matches from 'validator/es/lib/matches';
import signUpApi from './api/sign-up';

const TellUsMore = class TellUsMore {
  signUpEmail = document.getElementById('email')

  signUpName = document.getElementById('name')

  signUpTrigger = document.querySelectorAll('.js-form-btn')

  formHeader = document.getElementById('js-form-header')

  formTitle = document.getElementById('js-form-title')

  formContainer = document.getElementById('js-contact-form')

  formFields = this.formContainer.querySelectorAll('.field')

  formMessage = document.getElementById('js-form-message')

  failedValidation = []

  setupObservers = () => {
    this.signUpTrigger.forEach((trigger) => {
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

  formatDataForApi = () => ({
    name: this.signUpName.value,
    email: this.signUpEmail.value,
  })

  submitForm = () => {
    signUpApi
      .signUp(this.formatDataForApi())
      .then((response) => {
        this.clearForm();
        this.showThanksMessage();
      })
      .catch((response) => {});
  }

  clearForm = () => {
    this.signUpName.value = '';
    this.signUpEmail.value = '';
  }

  showThanksMessage = () => {
    this.formTitle.innerText = 'Thank you';

    this.formHeader.classList.remove('col-span-7', 'col-start-3', 'm-col-start-2', 'm-col-span-9');
    this.formHeader.classList.add('col-span-5', 'col-start-5', 'm-col-start-5', 'm-col-span-5');

    this.formFields.forEach((formFields) => {
      formFields.style.opacity = '0';
      formFields.style.visibility = 'hidden';
    });

    this.formMessage.classList.add('visible');
  }

  init = () => {
    this.setupObservers();
  }
};

export default TellUsMore;
