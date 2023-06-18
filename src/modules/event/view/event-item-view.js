import he from 'he';

import AbstractView from '../../../framework/view/abstract-view.js';

import { capitalizeWord } from '../../../utils/common.js';
import { DateFormat, convertDate, getDuration, formatDuration } from '../../../utils/date.js';

const createSelectedOffersTemplate = (eventSelectedOffers, offerTypeItem) => {
  if (eventSelectedOffers.length === 0) {
    return '';
  }

  return (/*html*/`
    <ul class="event__selected-offers">
      ${eventSelectedOffers
      .map((id) => {
        const offerItem = offerTypeItem.offers.find((offer) => offer.id === id);

        return (/*html*/`
        <li class="event__offer">
          <span class="event__offer-title">${he.encode(offerItem.title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${he.encode(offerItem.price.toString())}</span>
        </li>`);
      })
      .join('')}
    </ul>`);
};

const createEventsItemTemplate = ({ destinations, offerTypes, event }) => {
  const { type: eventType, destination: destinationId, offers: eventSelectedOffers, basePrice, isFavorite, dateFrom, dateTo } = event;

  const destinationItem = destinations.get(destinationId);
  const offerTypeItem = offerTypes.get(eventType);

  return (/*html*/`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${convertDate(dateFrom, DateFormat.EVENT_DATE)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${he.encode(capitalizeWord(eventType))} ${he.encode(destinationItem.name)}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${convertDate(dateFrom, DateFormat.TIME)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${convertDate(dateTo, DateFormat.TIME)}</time>
          </p>
          <p class="event__duration">${formatDuration(getDuration(dateFrom, dateTo))}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(basePrice.toString())}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${createSelectedOffersTemplate(eventSelectedOffers, offerTypeItem)}
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
};

export default class EventItemView extends AbstractView {
  #data = {};

  constructor({ data: { destinations, offerTypes, event }, onRollupButtonClick, onFavoriteButtonClick }) {
    super();
    this.#data = { destinations, offerTypes, event };
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', onRollupButtonClick);

    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', onFavoriteButtonClick);
  }

  get template() {
    return createEventsItemTemplate(this.#data);
  }
}
