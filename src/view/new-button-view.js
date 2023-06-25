import AbstractView from '../framework/view/abstract-view.js';

function createNewButtonTemplate(isDisabled) {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${isDisabled ? 'disabled' : ''}>New event</button>`;
}

export default class NewPointButtonView extends AbstractView {

  #onClickNewButton = null;
  #isDisabled = null;

  constructor({onclick}) {
    super();
    this.#onClickNewButton = onclick;
    this.#isDisabled = false;

    this.element.addEventListener('click', this.#onClickNewButton);
  }

  get template() {
    return createNewButtonTemplate(this.#isDisabled);
  }

  setDisabled(value) {
    this.#isDisabled = value;
    this.element.setAttribute('disabled', (this.#isDisabled ? 'disabled' : ''));
  }
}
