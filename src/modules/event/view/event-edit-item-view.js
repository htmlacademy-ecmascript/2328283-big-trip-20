import AbstractStatefulView from '../../../framework/view/abstract-stateful-view.js';
import { capitalizeWord } from '../../../utils/common.js';
import { DatetimeFormat, convertDatetime } from '../../../utils/date.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

//* Шаблон разметки пункта назначения
//* ------------------------------------------------------

const createEventPhotosTemplate = (picturesList) => {
  if (!picturesList.length) {
    return '';
  }

  return (/*html*/`
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${picturesList.map((picture) => `<img class="event__photo" src="${picture.src}" alt="Event photo.">`).join('')}
      </div>
    </div>`);
};

const createEventsEditDestinationTemplate = (destinationItem) => (/*html*/`
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationItem.description}</p>
      ${createEventPhotosTemplate(destinationItem.pictures)}
    </section>`);

//* Шаблон разметки офферов
//* ------------------------------------------------------

const isOfferSelected = (offerId, eventSelectedOffers) => eventSelectedOffers.includes(offerId) ? 'checked' : '';

const createOffersListTemplate = (offersList, eventSelectedOffers) => (/*html*/`
    <div class="event__available-offers">
      ${offersList.map((offer) => (/*html*/`
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox visually-hidden"
            id="event-offer-${offer.title}-${offer.id}"
            data-offer-id="${offer.id}"
            type="checkbox"
            name="event-offer-${offer.title}"
            ${isOfferSelected(offer.id, eventSelectedOffers)}
          >
          <label class="event__offer-label" for="event-offer-${offer.title}-${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`)).join('')}
    </div>`);

const createEventsEditOffersTemplate = (typeItem, eventSelectedOffers) => {
  if (!typeItem.offers.length) {
    return '';
  }

  return (/*html*/`
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      ${createOffersListTemplate(typeItem.offers, eventSelectedOffers)}
    </section>`);
};

//* Шаблон разметки выбора пункта назначения
//* ------------------------------------------------------

const createDestinationListTemplate = ({ destinations, event }) => (/*html*/`
  <datalist id="destination-list-${event.id}">
    ${destinations.map((destination) => `<option value="${destination.name}" data-destination-id="${destination.id}"></option>`).join('')}
  </datalist>`);

//* Шаблон разметки выбора типа события
//* ------------------------------------------------------

const createEventTypeListTemplate = ({ types, event }) => (/*html*/`
    <div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${types.map((type) => (/*html*/`
          <div class="event__type-item">
            <input
              id="event-type-${type.type}-${event.id}"
              class="event__type-input  visually-hidden"
              type="radio"
              name="event-type"
              value="${type.type}"
              ${event.type === type.type ? 'checked' : ''}
            >
            <label class="event__type-label  event__type-label--${type.type}" for="event-type-${type.type}-${event.id}">${capitalizeWord(type.type)}</label>
          </div>`)).join('')}
      </fieldset>
    </div>`);

//* Шаблон разметки изменения точки маршрута
//* ------------------------------------------------------

const createEventsEditItemTemplate = ({ destinations, types, event }) => {
  const { type: eventType, offers: eventSelectedOffers, basePrice, typeItem, destinationItem, id: eventId, dateFrom, dateTo } = event;

  return (/*html*/`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${eventId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon.">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${eventId}" type="checkbox">
            ${createEventTypeListTemplate({ types, event })}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${eventId}">
              ${capitalizeWord(eventType)}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-${eventId}"
              type="text" name="event-destination"
              value="${destinationItem.name}"
              list="destination-list-${eventId}"
              data-event-id="${event.id}"
            >
            ${createDestinationListTemplate({ destinations, event })}
          </div>

          <div class="event__field-group  event__field-group--time-${eventId}">
            <label class="visually-hidden" for="event-start-time">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${eventId}" type="text" name="event-start-time" value="${convertDatetime(dateFrom, DatetimeFormat.EVENT_EDIT_DATE)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${eventId}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${eventId}" type="text" name="event-end-time" value="${convertDatetime(dateTo, DatetimeFormat.EVENT_EDIT_DATE)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${eventId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${eventId}" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createEventsEditOffersTemplate(typeItem, eventSelectedOffers)}
          ${createEventsEditDestinationTemplate(destinationItem)}
        </section>
      </form>
    </li>`
  );
};

export default class EventEditItemView extends AbstractStatefulView {
  #data = {};

  #onEditFormSubmit = null;
  #onRollupButtonClick = null;

  #datePickers = {
    dateFrom: null,
    dateTo: null
  };


  constructor({ data: { destinations, types, event }, onRollupButtonClick, onEditFormSubmit }) {
    super();
    this.#data = { destinations, types, event };
    this._setState(EventEditItemView.parseEventDataToState(this.#data));
    this.#onEditFormSubmit = onEditFormSubmit;
    this.#onRollupButtonClick = onRollupButtonClick;
    this._restoreHandlers();
  }

  get template() {
    return createEventsEditItemTemplate({ ...this.#data, event: this._state });
  }

  removeElement() {
    super.removeElement();

    Object.entries(this.#datePickers).forEach(([picker, isExist]) => {
      if (isExist) {
        this.#datePickers[picker].destroy();
        this.#datePickers[picker] = null;
      }
    });
  }

  reset() {
    this.updateElement(EventEditItemView.parseEventDataToState(this.#data));
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onRollupButtonClick);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__type-list').addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('click', this.#destinationFieldClickHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationFieldInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceFieldInputHandler);

    if (this._state.typeItem.offers.length !== 0) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#availableOfferChangeHandler);
    }

    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  #setDateFromPicker() {
    this.#datePickers.dateFrom = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        maxDate: this.element.querySelector(`#event-end-time-${this._state.id}`).value,
        onChange: this.#createDatetimeChangeHandler('dateFrom'),
        onClose: (_, datetime) => this.#datePickers.dateTo.set('minDate', datetime)
      }
    );
  }

  #setDateToPicker() {
    this.#datePickers.dateTo = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        minDate: this.element.querySelector(`#event-start-time-${this._state.id}`).value,
        onChange: this.#createDatetimeChangeHandler('dateTo'),
        onClose: (_, datetime) => this.#datePickers.dateFrom.set('maxDate', datetime)
      }
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onEditFormSubmit(EventEditItemView.parseStateToEventData(this._state));
  };

  #eventTypeChangeHandler = (evt) => {
    this.updateElement({
      offers: [],
      type: evt.target.value,
      typeItem: EventEditItemView.#getTypeItem(this.#data.types, evt.target.value)
    });
  };

  #destinationFieldClickHandler = (evt) => {
    evt.target.value = null;
  };

  #destinationFieldInputHandler = (evt) => {
    const newInputValueId = Number(this.element.querySelector(`#destination-list-${evt.target.dataset.eventId} [value='${evt.target.value}']`).dataset.destinationId);
    this.updateElement({
      destination: newInputValueId,
      destinationItem: EventEditItemView.#getDestinationItem(this.#data.destinations, newInputValueId)
    });
  };

  #createDatetimeChangeHandler = (propertyName) => ([datetime]) => {
    this._setState({
      ...this._state,
      [propertyName]: datetime
    });
  };

  #priceFieldInputHandler = (evt) => {
    this._setState({
      ...this._state,
      basePrice: evt.target.value
    });
  };

  #availableOfferChangeHandler = (evt) => {
    const checkedOffers = new Set(this._state.offers);
    const currentCheckedOfferId = Number(evt.target.dataset.offerId);

    if (checkedOffers.has(currentCheckedOfferId)) {
      checkedOffers.delete(currentCheckedOfferId);
    } else {
      checkedOffers.add(currentCheckedOfferId);
    }

    this.updateElement({
      offers: Array.from(checkedOffers)
    });
  };


  static parseEventDataToState({ destinations, types, event }) {
    return {
      ...event,
      typeItem: this.#getTypeItem(types, event.type),
      destinationItem: this.#getDestinationItem(destinations, event.destination)
    };
  }

  static parseStateToEventData(state) {
    const event = { ...state };

    delete event.typeItem;
    delete event.destinationItem;

    return event;
  }

  static #getTypeItem(types, eventType) {
    return types.find((type) => type.type === eventType);
  }

  static #getDestinationItem(destinations, eventDestinationId) {
    return destinations.find((item) => item.id === eventDestinationId);
  }
}
