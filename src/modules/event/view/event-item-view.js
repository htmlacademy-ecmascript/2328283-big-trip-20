import AbstractView from '../../../framework/view/abstract-view.js';
import { capitalizeWord, renameKeys } from '../../../utils/common.js';
import { DatetimeFormat, stringToDayjsObj, convertDatetime, getDuration, formatDuration } from '../../../utils/date.js';

const isEventFavorite = (isFavorite) => isFavorite ? 'event__favorite-btn--active' : '';

const createSelectedOffersTemplate = (eventSelectedOffers, typeItem) => {
  if (!eventSelectedOffers.length) {
    return '';
  }

  return (/*html*/`
    <ul class="event__selected-offers">
      ${eventSelectedOffers.map((id) => {
      const offerItem = typeItem.offers.find((offer) => offer.id === id);

      return (/*html*/`
        <li class="event__offer">
          <span class="event__offer-title">${offerItem.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offerItem.price}</span>
        </li>`);
    }).join('')}
    </ul>`);
};

const createEventsItemTemplate = ({ destinations, types, event }) => {
  const { type: eventType, destination: destinationId, offers: eventSelectedOffers, basePrice, isFavorite } = event;
  let { dateFrom, dateTo} = event;

  const destinationItem = destinations.find((destination) => destination.id === destinationId);
  const typeItem = types.find((type) => type.type === eventType);

  //! Временный костыль для моков
  //! ----------------------------------------------------------------------------
  const newKeys = {$y: 'year', $M: 'month', $D: 'day', $H: 'hour', $m: 'minute'};

  if ('$y' in dateFrom) {
    dateFrom = renameKeys(dateFrom, newKeys);
  } else {
    dateFrom = stringToDayjsObj(dateFrom);
  }

  if ('$y' in dateTo) {
    dateTo = renameKeys(dateTo, newKeys);
  } else {
    dateTo = stringToDayjsObj(dateTo);
  }
  //! ----------------------------------------------------------------------------

  return (/*html*/`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${convertDatetime(dateFrom, DatetimeFormat.EVENT_DATE)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeWord(eventType)} ${destinationItem.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${convertDatetime(dateFrom, DatetimeFormat.TIME)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${convertDatetime(dateTo, DatetimeFormat.TIME)}</time>
          </p>
          <p class="event__duration">${formatDuration(getDuration(dateFrom, dateTo))}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${createSelectedOffersTemplate(eventSelectedOffers, typeItem)}
        <button class="event__favorite-btn ${isEventFavorite(isFavorite)}" type="button">
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

  constructor({ data: { destinations, types, event }, onRollupButtonClick, onFavoriteButtonClick }) {
    super();
    this.#data = { destinations, types, event };
    this.element.querySelector('.event__rollup-btn').addEventListener('click', onRollupButtonClick);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', onFavoriteButtonClick);
  }

  get template() {
    return createEventsItemTemplate(this.#data);
  }
}
