import EventsBoardFiltersView from '../view/filters-view.js';

import { render, replace, remove } from '../../../framework/render.js';
import { generateFilters } from '../../../utils/filters.js';
import { UpdateType } from '../../../const.js';

const tripMain = document.querySelector('.trip-main');

export default class FiltersPresenter {
  #eventsModel = null;
  #filtersModel = null;

  #filtersComponent = null;

  constructor({ eventsModel, filtersModel }) {
    this.#eventsModel = eventsModel;
    this.#filtersModel = filtersModel;

    this.#eventsModel.addObserver(this.#onFiltersModelChange);
    this.#filtersModel.addObserver(this.#onFiltersModelChange);
  }

  get filters() {
    return generateFilters(this.#eventsModel.events);
  }

  init() {
    const prevFiltersComponent = this.#filtersComponent;
    this.#filtersComponent = new EventsBoardFiltersView({
      filters: this.filters,
      currentFilter: this.#filtersModel.currentFilter,
      onFiltersChange: this.#onFiltersChange
    });

    if (prevFiltersComponent === null) {
      render(this.#filtersComponent, tripMain);
      return;
    }

    replace(this.#filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  }

  #onFiltersModelChange = () => {
    this.init();
  };

  #onFiltersChange = (filter) => this.#filtersModel.setCurrentFilter(UpdateType.MAJOR, filter);
}
