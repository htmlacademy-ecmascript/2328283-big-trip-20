import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {convertDateTimePoint} from '../utils/point.js';

import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';

function createOffer (offers, isDisabled) {
  return (
    `${offers.map((offer) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${he.encode(offer.id)}" type="checkbox" name="event-offer-${he.encode(offer.id)}" ${offer.checked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${he.encode(offer.id)}" ${isDisabled ? 'disabled' : ''}>
        <span class="event__offer-title">${he.encode(offer.title)}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${he.encode(String(offer.price))}</span>
      </label>
    </div>`).join('')}`
  );
}

function createImgDescription (destination) {
  if (destination) {
    return (
      `${Object.entries(destination.pictures).map((value, index) => `
      <img class="event__photo" src="${he.encode(destination.pictures[index].src)}" alt="${he.encode(destination.pictures[index].description)}">`).join('')}`
    );
  }
}

function createTypeList(value, typePoint, isDisabled) {
  const {type} = value;
  return (
    `<div class="event__type-item">
    <input id="event-type-${he.encode(type.toLowerCase())}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${he.encode(type.toLowerCase())}" ${isDisabled ? 'disabled' : ''} ${type === typePoint ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${he.encode(type.toLowerCase())}" for="event-type-${he.encode(type.toLowerCase())}-1" ${isDisabled ? 'disabled' : ''}>${he.encode(type.charAt(0).toUpperCase() + type.slice(1))}</label>
  </div>
    `
  );
}

function createDestinationList (value) {
  return (
    `<option value="${he.encode(value)}"></option>
    `
  );
}

function createBlockTemplate(point, isCreating) {

  const {type = 'taxi', price, destination, offers = [], dateFrom, dateTo, allOffers, allDestinations, isDisabled, isSaving, isDeleting} = point;

  const offerType = allOffers.find((typeOffer) => typeOffer.type === type);

  const offersData = offerType.offers.map((offer) => ({
    ...offer,
    checked: offers.includes(offer.id) || false,
  })
  );

  const uniqueDestination = allDestinations.find((oneDestination) => oneDestination.id === destination);

  const timeFrom = convertDateTimePoint(dateFrom);
  const timeTo = convertDateTimePoint(dateTo);
  const repeatingOffer = createOffer(offersData, isDisabled);
  const repeatingImg = createImgDescription(uniqueDestination);

  const typeItemsTemplate = allOffers
    .map((value) => createTypeList(value, type, isDisabled))
    .join('');

  const destinationsTemplate = allDestinations
    .map((value) => createDestinationList(value.name))
    .join('');

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${typeItemsTemplate}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1" ${isDisabled ? 'disabled' : ''}>
        ${he.encode(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${uniqueDestination ? he.encode(uniqueDestination.name) : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1" ${isDisabled ? 'disabled' : ''}>
          ${destinationsTemplate}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${he.encode(timeFrom)}" ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${he.encode(timeTo)}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(String(price))}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isCreating ? 'Cancel' : 'Delete'}${isDeleting ? 'Deleting...' : ''}</button>
      <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">


        <section class="event__section  event__section--offers" ${isDisabled ? 'disabled' : ''}>
        <h3 class="event__section-title  event__section-title--offers">Offers</h3><div class="event__available-offers">${repeatingOffer}</div></section>

      ${uniqueDestination ? `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${uniqueDestination ? he.encode(uniqueDestination.description) : ''}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${uniqueDestination ? repeatingImg : ''}
          </div>
        </div>
      </section>
      ` : ''}
    </section>
  </form>
  </li>`
  );
}

export default class EditEventView extends AbstractStatefulView {
  #point = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #handleExitClick = null;
  #offers = null;
  #destinations = null;
  #datepickerDateFrom = null;
  #datepickerDateTo = null;
  #isCreating = null;

  constructor({point, offers, destinations, onFormSubmit, onDeleteClick, onFormExit, isCreating = false}) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;

    this._setState(EditEventView.parsePointToState(point, offers, destinations));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#handleExitClick = onFormExit;
    this.#isCreating = isCreating;
    this._restoreHandlers();
  }

  get template() {
    return createBlockTemplate(this._state, this.#isCreating);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerDateFrom) {
      this.#datepickerDateFrom.destroy();
      this.#datepickerDateFrom = null;
    }

    if (this.#datepickerDateTo) {
      this.#datepickerDateTo.destroy();
      this.#datepickerDateTo = null;
    }
  }

  reset(point, offers, destinations) {
    this.updateElement(
      EditEventView.parsePointToState(point, offers, destinations),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceChangeHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formExitHandler);

    this.#setDatepicker();
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#destinations.find((value) => value.name.toLowerCase() === evt.target.value.toLowerCase());
    if (destination) {
      this.updateElement({
        destination: destination.id,
      });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      price: evt.target.value,
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditEventView.parseStateToPoint(this._state));
  };

  #formExitHandler = () => {
    this.#handleExitClick(EditEventView.parseStateToPoint(this._state));
  };

  #setDatepicker() {
    this.#datepickerDateFrom = flatpickr(
      this.element.querySelector('.event__input--time[id="event-start-time-1"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: convertDateTimePoint(this._state.dateFrom),
        maxDate: convertDateTimePoint(this._state.dateTo),
        onChange: this.#dateFromChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );

    this.#datepickerDateTo = flatpickr(
      this.element.querySelector('.event__input--time[id="event-end-time-1"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: convertDateTimePoint(this._state.dateTo),
        minDate: convertDateTimePoint(this._state.dateFrom),
        onChange: this.#dateToChangeHandler, // На событие flatpickr передаём наш колбэк
      },
    );
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditEventView.parseStateToPoint(this._state));
  };

  static parsePointToState(point, allOffers, allDestinations) {
    return {...point,
      allOffers,
      allDestinations,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    const offers = Array.from(document.querySelectorAll('.event__offer-checkbox'));
    const checkedOffers = offers.filter((offer) => offer.checked === true);
    const checkedOffersId = checkedOffers.map((checkedOffer) => checkedOffer.id.substring(12, checkedOffer.id.length));
    point.offers = checkedOffersId;
    point.dateFrom = dayjs(point.dateFrom).format();
    point.dateTo = dayjs(point.dateTo).format();

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
