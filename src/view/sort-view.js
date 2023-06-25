import AbstractView from '../framework/view/abstract-view.js';

const DEFAULT_FILTERS = [
  {id: 'day', text: 'Day', disabled: false},
  {id: 'event', text: 'Event', disabled: true},
  {id: 'time', text: 'Time', disabled: false},
  {id: 'price', text: 'Price', disabled: false},
  {id: 'offer', text: 'Offers', disabled: true}
];

function createSortItem({id, text, disabled} = DEFAULT_FILTERS, sortType) {
  return `<div class="trip-sort__item  trip-sort__item--${id}">
  <input id="sort-${id}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${id}" ${id === sortType && disabled === false ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
  <label class="trip-sort__btn" for="sort-${id}" data-sort-type="${id}">${text}</label>
</div>`;
}


function createSortViewTemplate (sortType) {

  const sortItemsTemplate = DEFAULT_FILTERS.map((sort) => createSortItem(sort, sortType)).join('');

  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">

    ${sortItemsTemplate}

</form>
`;
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #filteredPoints = null;
  #sortType = null;

  constructor({onSortTypeChange, points, sortType}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#filteredPoints = points;
    this.#sortType = sortType;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortViewTemplate(this.#sortType, this.#filteredPoints);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType, this.#filteredPoints);
  };
}
