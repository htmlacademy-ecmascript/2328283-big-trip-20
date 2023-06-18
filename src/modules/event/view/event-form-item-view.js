import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import AbstractStatefulView from '../../../framework/view/abstract-stateful-view.js';

import { capitalizeWord } from '../../../utils/common.js';
import { DateFormat, convertDate } from '../../../utils/date.js';

//* Шаблон разметки пункта назначения
//* ------------------------------------------------------

const createEventPhotosTemplate = (picturesList) => {
  if (picturesList.length === 0) {
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
      <p class="event__destination-description">${he.encode(destinationItem.description)}</p>
      ${createEventPhotosTemplate(destinationItem.pictures)}
    </section>`);

//* Шаблон разметки офферов
//* ------------------------------------------------------

const isOfferSelected = (offerId, eventSelectedOffers) => eventSelectedOffers.includes(offerId) ? 'checked' : '';

const createOffersListTemplate = (offersList, eventSelectedOffers, isDisabled) => (/*html*/`
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
            ${isDisabled ? 'disabled' : ''}
          >
          <label class="event__offer-label" for="event-offer-${offer.title}-${offer.id}">
            <span class="event__offer-title">${he.encode(offer.title)}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${he.encode(offer.price.toString())}</span>
          </label>
        </div>`)).join('')}
    </div>`);

const createEventsEditOffersTemplate = (offerTypeItem, eventSelectedOffers, isDisabled) => {
  if (offerTypeItem.offers.length === 0) {
    return '';
  }

  return (/*html*/`
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      ${createOffersListTemplate(offerTypeItem.offers, eventSelectedOffers, isDisabled)}
    </section>`);
};

//* Шаблон разметки выбора пункта назначения
//* ------------------------------------------------------

const createDestinationListTemplate = ({ destinations, event }) => (/*html*/`
  <datalist id="destination-list-${event.id}">
    ${Array
    .from(destinations.values())
    .map((destination) => `<option value="${destination.name}" data-destination-id="${destination.id}"></option>`)
    .join('')}
  </datalist>`);

//* Шаблон разметки выбора типа события
//* ------------------------------------------------------

const createEventTypeListTemplate = ({ offerTypes, event }) => (/*html*/`
  <div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${Array
    .from(offerTypes.values())
    .map((offerType) => (/*html*/`
        <div class="event__type-item">
          <input
            id="event-type-${offerType.type}-${event.id}"
            class="event__type-input  visually-hidden"
            type="radio"
            name="event-type"
            value="${offerType.type}"
            ${event.type === offerType.type ? 'checked' : ''}
          >
          <label
            class="event__type-label  event__type-label--${offerType.type}"
            for="event-type-${offerType.type}-${event.id}"
            >
            ${capitalizeWord(offerType.type)}
          </label>
        </div>`)).join('')}
    </fieldset>
  </div>`);

//* Шаблон разметки изменения точки маршрута
//* ------------------------------------------------------

const createButtonsTemplate = (isNewEvent, isDisabled, isDeleting) => isNewEvent
  ? (/*html*/`<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>`)
  : (/*html*/`
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
      <span class="visually-hidden">Open event</span>
    </button>`);

const createEventsFormItemTemplate = ({ destinations, offerTypes, event }, isNewEvent) => {
  const {
    type: eventType,
    offers: eventSelectedOffers,
    basePrice,
    offerTypeItem,
    destinationItem,
    id: eventId,
    dateFrom,
    dateTo,
    isDisabled,
    isSaving,
    isDeleting
  } = event;

  return (/*html*/`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${eventId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon.">
            </label>
            <input
              class="event__type-toggle  visually-hidden"
              id="event-type-toggle-${eventId}"
              type="checkbox"
              ${isDisabled ? 'disabled' : ''}
            >
            ${createEventTypeListTemplate({ offerTypes, event })}
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
              ${isDisabled ? 'disabled' : ''}
            >
            ${createDestinationListTemplate({ destinations, event })}
          </div>

          <div class="event__field-group  event__field-group--time-${eventId}">
            <label class="visually-hidden" for="event-start-time">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-${eventId}"
              type="text"
              name="event-start-time"
              value="${convertDate(dateFrom, DateFormat.EVENT_EDIT_DATE)}"
              ${isDisabled ? 'disabled' : ''}
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-${eventId}">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-${eventId}"
              type="text"
              name="event-end-time"
              value="${convertDate(dateTo, DateFormat.EVENT_EDIT_DATE)}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${eventId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-${eventId}"
              type="number"
              min="1"
              name="event-price"
              value="${basePrice}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <button
            class="event__save-btn  btn  btn--blue"
            type="submit"
            ${isDisabled ? 'disabled' : ''}
            >
            ${isSaving ? 'Saving' : 'Save'}
          </button>
          ${createButtonsTemplate(isNewEvent, isDisabled, isDeleting)}
        </header>
        <section class="event__details">
          ${createEventsEditOffersTemplate(offerTypeItem, eventSelectedOffers, isDisabled)}
          ${createEventsEditDestinationTemplate(destinationItem)}
        </section>
      </form>
    </li>`);
};

export default class EventFormItemView extends AbstractStatefulView {
  #data = {};
  #isNewEvent = null;

  #onFormSubmit = null;
  #onButtonClick = null;
  #onRollupButtonClick = null;

  #datePickers = {
    dateFrom: null,
    dateTo: null
  };

  constructor({ data: { destinations, offerTypes, event }, onFormSubmit, onButtonClick, onRollupButtonClick, isNewEvent = false }) {
    super();
    this.#data = { destinations, offerTypes, event };
    this.#isNewEvent = isNewEvent;
    this.#onFormSubmit = onFormSubmit;
    this.#onButtonClick = onButtonClick;
    this.#onRollupButtonClick = onRollupButtonClick;

    this._setState(EventFormItemView.parseEventDataToState(this.#data));
    this._restoreHandlers();
  }

  get template() {
    return createEventsFormItemTemplate({ ...this.#data, event: this._state }, this.#isNewEvent);
  }

  removeElement() {
    super.removeElement();

    Object
      .entries(this.#datePickers)
      .forEach(([picker, isExist]) => {
        if (isExist) {
          this.#datePickers[picker].destroy();
          this.#datePickers[picker] = null;
        }
      });
  }

  reset() {
    this.updateElement(EventFormItemView.parseEventDataToState(this.#data));
  }

  _restoreHandlers() {
    if (!this.#isNewEvent) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#onRollupButtonClick);
    }

    if (this._state.offerTypeItem.offers.length !== 0) {
      this.element
        .querySelector('.event__available-offers')
        .addEventListener('change', this.#availableOfferChangeHandler);
    }

    this.element
      .querySelector('.event__type-list')
      .addEventListener('change', this.#eventTypeChangeHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationFieldInputHandler);

    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#priceFieldInputHandler);

    this.element
      .querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteButtonClickHandler);


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
        onChange: this.#createDateChangeHandler('dateFrom'),
        onClose: (_, date) => this.#datePickers.dateTo.set('minDate', date)
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
        onChange: this.#createDateChangeHandler('dateTo'),
        onClose: (_, date) => this.#datePickers.dateFrom.set('maxDate', date)
      }
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(EventFormItemView.parseStateToEventData(this._state));
  };

  #deleteButtonClickHandler = () => this.#onButtonClick(EventFormItemView.parseStateToEventData(this._state));

  #eventTypeChangeHandler = (evt) => {
    this.updateElement({
      offers: [],
      type: evt.target.value,
      offerTypeItem: this.#data.offerTypes.get(evt.target.value)
    });
  };

  #destinationFieldInputHandler = (evt) => {
    const destinationListItem = this.element.querySelector(`#destination-list-${evt.target.dataset.eventId} [value='${evt.target.value}']`);

    if (destinationListItem) {
      const newInputValueId = destinationListItem.dataset.destinationId;
      this.updateElement({
        destination: newInputValueId,
        destinationItem: this.#data.destinations.get(newInputValueId)
      });
    }
  };

  #createDateChangeHandler = (propertyName) => ([date]) => {
    this._setState({
      ...this._state,
      [propertyName]: date
    });
  };

  #priceFieldInputHandler = (evt) => {
    this._setState({
      ...this._state,
      basePrice: Number(evt.target.value)
    });
  };

  #availableOfferChangeHandler = (evt) => {
    const checkedOffers = new Set(this._state.offers);
    const currentCheckedOfferId = evt.target.dataset.offerId;

    if (checkedOffers.has(currentCheckedOfferId)) {
      checkedOffers.delete(currentCheckedOfferId);
    } else {
      checkedOffers.add(currentCheckedOfferId);
    }

    this._setState({
      ...this._state,
      offers: Array.from(checkedOffers)
    });
  };

  static parseEventDataToState({ destinations, offerTypes, event }) {
    return {
      ...event,
      offerTypeItem: offerTypes.get(event.type),
      destinationItem: destinations.get(event.destination),
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToEventData(state) {
    const event = { ...state };

    delete event.offerTypeItem;
    delete event.destinationItem;
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;

    return event;
  }
}
