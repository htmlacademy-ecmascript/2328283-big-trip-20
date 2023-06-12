import AbstractView from '../../../framework/view/abstract-view.js';

const createNewEventButtonTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button"> New event </button>';

export default class NewEventButtonView extends AbstractView {
  constructor({ onNewEventButtonClick }) {
    super();
    this.element.addEventListener('click', onNewEventButtonClick);
  }

  get template() {
    return createNewEventButtonTemplate();
  }
}
