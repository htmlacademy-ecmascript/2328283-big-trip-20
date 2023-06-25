import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDate, humanizePointTime, findDurationPointTime, getFormatedDuration} from '../utils/point.js';
import he from 'he';

function createEventTemplate(point, allOffers) {
  const {type = 'taxi', price, destination, isFavorite, offers, dateFrom, dateTo} = point;
  const favouriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const date = humanizePointDate(dateFrom);
  const timeFrom = humanizePointTime(dateFrom);
  const timeTo = humanizePointTime(dateTo);
  const duration = findDurationPointTime(dateTo, dateFrom);

  let format = '';

  if (duration.days()) {
    format = 'DD[d] HH[h] mm[m]';
  } else if (duration.hours()) {
    format = 'HH[h] mm[m]';
  } else {
    format = 'mm[m]';
  }

  const formalizedDuration = getFormatedDuration(dateTo, dateFrom, format);
  const offerType = allOffers.find((typeOffer) => typeOffer.type === type);

  const offersData = offerType.offers.map((offer) => ({
    ...offer,
    checked: offers.includes(offer.id),
  })
  );

  const checkedOffers = offersData.filter((value) => value.checked === true);
  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${he.encode(String(date))}">${he.encode(String(date))}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${he.encode(type.charAt(0).toUpperCase() + type.slice(1))} ${he.encode(destination.name)}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${he.encode(date)}">${timeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="${he.encode(date)}">${timeTo}</time>
        </p>
        <p class="event__duration">${formalizedDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${he.encode(String(price))}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        <li class="event__offer">
          <span class="event__offer-title">${checkedOffers.length !== 0 ? checkedOffers.map((value) => value.title).join(', ') : ''}</span>
          ${checkedOffers.length !== 0 ? '&plus;&nbsp;&euro;&nbsp;' : ''}
          <span class="event__offer-price">${checkedOffers.length !== 0 ? offersData.map((value) => value.checked === true ? value.price : 0).reduce((prev, curr) => prev + curr, 0) : ''}</span>
        </li>
      </ul>
      <button class="event__favorite-btn ${he.encode(favouriteClass)}" type="button">
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

export default class EventView extends AbstractView {
  #point = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;
  #offers = null;

  constructor({point, onEditClick, onFavoriteClick, offers, destination}) {
    super();
    this.#point = {...point};
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.#offers = offers;

    this.#point.destination = destination;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventTemplate(this.#point, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
