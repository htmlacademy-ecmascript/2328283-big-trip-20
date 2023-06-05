import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDate, humanizePointTime, findDurationPointTime} from '../utils/util.js';

function createItemTemplate(point) {
  const {price, dateFrom, dateTo, type, destination, isFavorite, offers} = point;

  const date = humanizePointDate(dateFrom);
  const timeFrom = humanizePointTime(dateFrom);
  const timeTo = humanizePointTime(dateTo);
  const duration = findDurationPointTime(dateTo, dateFrom);
  const favoriteType = isFavorite ? 'event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${date}">${date}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${date}">${timeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="${date}">${timeTo}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        <li class="event__offer">
          <span class="event__offer-title">${offers.map((value) => value.title).join(', ')}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offers.map((value) => value.price).reduce((prev, curr) => prev + curr, 0)}</span>
        </li>
      </ul>
      <button class="event__favorite-btn ${favoriteType}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
}

export default class PointView extends AbstractView {
  #point = null;
  #handleEditClick = null;

  constructor({point, onEditClick}) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createItemTemplate(this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
