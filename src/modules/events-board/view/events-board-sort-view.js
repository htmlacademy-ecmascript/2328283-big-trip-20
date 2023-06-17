import AbstractView from '../../../framework/view/abstract-view.js';

import { capitalizeWord } from '../../../utils/common.js';
import { SortType } from '../../../const.js';

const createEventsSortItemTemplate = (name, isDisabled, currentSortType) => (/*html*/`
  <div class="trip-sort__item  trip-sort__item--${name}">
    <input
      id="sort-${name}"
      class="trip-sort__input visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${name}"
      data-sort-type="${name}"
      ${isDisabled ? 'disabled' : ''}
      ${currentSortType.name === name ? 'checked' : ''}
    >
    <label class="trip-sort__btn" for="sort-${name}">${capitalizeWord(name)}</label>
  </div>`);

const createEventsSortTemplate = (currentSortType) => (/*html*/`
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object
    .values(SortType)
    .map((type) => createEventsSortItemTemplate(type.name, type.disabled, currentSortType))
    .join('')}
  </form>`
);

export default class EventsBoardSortView extends AbstractView {
  #currentSortType = null;
  #onSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#currentSortType = currentSortType;
    this.#onSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createEventsSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => this.#onSortTypeChange(evt.target.dataset.sortType.toUpperCase());
}
