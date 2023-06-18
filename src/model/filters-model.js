import Observable from '../framework/observable.js';

import { FilterType } from '../const.js';

export default class FiltersModel extends Observable {
  #currentFilter = FilterType.EVERYTHING;

  get currentFilter() {
    return this.#currentFilter;
  }

  setCurrentFilter(updateType, filter) {
    this.#currentFilter = filter;
    this._notify(updateType);
  }
}
