import AbstractView from '../framework/view/abstract-view.js';

function createFilterItem (filter, currentFilterType) {
  return `<div class="trip-filters__filter">
  <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}" ${(filter.hasPoints) ? '' : 'disabled'} ${filter.type === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.type}</label>
    </div>`;
}

function createFilterViewTemplate (filters, currentFilterType) {

  const filteredItemsTemplate = filters.map((filter) => createFilterItem(filter, currentFilterType)).join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filteredItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterViewTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
