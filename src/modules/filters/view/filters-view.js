import AbstractView from '../../../framework/view/abstract-view.js';

const createFiltersItemTemplate = (type, isChecked, isDisabled) => (/*html*/`
  <div class="trip-filters__filter">
    <input
      id="filter-${type}"
      class="trip-filters__filter-input visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${isChecked ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label
      class="trip-filters__filter-label"
      for="filter-${type}">
      ${type}
    </label>
  </div>`);

const createFiltersItemsTemplate = (filters, currentFilter) => (/*html*/`
  ${Object
    .entries(filters)
    .map(([type, count]) => createFiltersItemTemplate(type, currentFilter === type, count === 0))
    .join('')
  }`);

const createFiltersTemplate = (filters, currentFilter) => (/*html*/`
  <div class="trip-main__trip-controls  trip-controls">
    <div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${createFiltersItemsTemplate(filters, currentFilter)}
      </form>
    </div>
  </div>`);

export default class EventsBoardFiltersView extends AbstractView {
  #filters = [];

  #currentFilter = null;
  #onFiltersChange = null;

  constructor({ filters, currentFilter, onFiltersChange }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#onFiltersChange = onFiltersChange;

    this.element.addEventListener('change', this.#filtersChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filtersChangeHandler = (evt) => this.#onFiltersChange(evt.target.value);
}
