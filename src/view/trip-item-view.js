import AbstractView from '../framework/view/abstract-view.js';
import { formatStringToShortDate, formatStringToTime, getPointDuration } from '../utils.js';

function createTripItemTemplate({ point, pointDestinations, pointOffers }) {
  const {
    basePrice, dateFrom, dateTo, destination, offers, type, isFavorite
  } = point;

  const pointOffer = pointOffers.find((offer) => offer.type === type);
  const offersData = pointOffer.offers.filter(({ id }) => offers.indexOf(id) !== -1);

  const pointDestination = pointDestinations.filter(({ id }) => destination.indexOf(id) !== -1);

  function getOfferTemplate() {
    return offersData.map((offer) =>
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
    ).join('');
  }

  const offerTemplate = getOfferTemplate();

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dateFrom}">${formatStringToShortDate(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${pointDestination[0].name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateFrom}">${formatStringToTime(dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">${formatStringToTime(dateTo)}</time>
      </p>
      <p class="event__duration">${getPointDuration(dateFrom, dateTo)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offerTemplate}
    </ul>
    <button class="event__favorite-btn event__favorite-btn${isFavorite ? '--active' : ''}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
}

export default class TripItemView extends AbstractView {

  #point = null;
  #pointOffers = null;
  #onEditClickHandler = null;
  #onFavoriteClick = null;
  #pointDestinations = null;

  constructor({ point1, pointDestinations, pointOffers, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point1;
    this.#pointOffers = pointOffers;
    this.#onEditClickHandler = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;
    this.#pointDestinations = pointDestinations;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditClick);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createTripItemTemplate({
      point: this.#point,
      pointOffers: this.#pointOffers,
      pointDestinations: this.#pointDestinations
    });
  }

  #onEditClick = (evt) => {
    evt.preventDefault();
    this.#onEditClickHandler();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };
}
