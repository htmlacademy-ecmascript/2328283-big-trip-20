import { allDestinations, getDestinationById } from '../mocks/destinations.js';
import { getAllOffersByType, getOfferById } from '../mocks/offers.js';
import dayjs from 'dayjs';
import { CITIES, EVENTS } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createCityElements (cities) {
  return (
    cities.map((city) => (`<option value="${city}"></option>`)).join(' ')
  );
}

function createPictureElements (pictures) {
  return (
    pictures.map((picture) => (`<img class="event__photo" src="${picture.src}" alt="Event photo">`
    )).join('')
  );
}

function createEventsElements (events) {
  return (
    events.map((event) => (
      `<div class="event__type-item">
        <input id="event-type-${event}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${event}">
        <label class="event__type-label  event__type-label--${event}" for="event-type-${event}-1">${event.charAt(0).toUpperCase() + event.substr(1).toLowerCase()}</label>
      </div>`
    )).join('')
  );
}

function createOffersList (allOffers, checkedOffers) {
  const newOffers = [];
  let counter = 1;

  allOffers.forEach((offer) => {
    const isChecked = checkedOffers.includes(offer) ? 'checked' : '';

    newOffers.push(`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.split(' ').join('-')}-${counter}" type="checkbox" name="event-offer-${offer.title.split(' ').join('-')}" data-id="${offer.id}" ${isChecked}>
        <label class="event__offer-label" for="event-offer-${offer.title.split(' ').join('-')}-${counter}">
          <span class="event__offer-title">${offer.title}</span>
          +€&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`);
    counter += 1;
  });

  return newOffers.join('');
}

function createEditPointTemplate (point) {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = point;

  const destinations = getDestinationById(destination);

  const allOffers = getAllOffersByType(type);

  const checkedOffers = [];
  offers.forEach((id) => {
    checkedOffers.push(getOfferById(id));
  });

  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

            ${createEventsElements(EVENTS)}

          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations.name}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createCityElements(CITIES)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}">
        —
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          €
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${createOffersList(allOffers, checkedOffers)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destinations.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createPictureElements(destinations.pictures)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`);
}

export default class EditPointView extends AbstractStatefulView {

  #handleFormSubmit = null;
  #handleFormCancel = null;
  #handleFormDelete = null;

  #startDatepicker = null;
  #endDatepicker = null;

  constructor ({point, onFormSubmitClick, onFormCancelClick, onFormDeleteClick}) {
    super();
    this._setState(EditPointView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmitClick;
    this.#handleFormCancel = onFormCancelClick;
    this.#handleFormDelete = onFormDeleteClick;

    this._restoreHandlers();
  }

  get template () {
    return createEditPointTemplate(this._state);
  }

  _restoreHandlers = () => {
    const form = this.element.querySelector('form');

    form.addEventListener('submit', this.#onFormSubmitClick);
    form.addEventListener('reset', this.#onFormResetClick);

    form.querySelector('.event__rollup-btn').addEventListener('click', this.#onCancelButtonClick);
    form.querySelector('.event__type-group').addEventListener('change', this.#onEventTypeChange);
    form.querySelector('.event__input--destination').addEventListener('change', this.#onDestinationChange);
    form.querySelector('.event__input--price').addEventListener('change', this.#onPriceChange);
    form.querySelector('.event__available-offers').addEventListener('change', this.#onOfferChange);

    this.#setDatePicker();
  };

  #onFormSubmitClick = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #onFormResetClick = (evt) => {
    evt.preventDefault();
    this.#handleFormDelete();
  };

  #onCancelButtonClick = (evt) => {
    evt.preventDefault();
    this.#handleFormCancel();
  };

  #onEventTypeChange = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        offers: [],
        type: evt.target.value
      });
    }
  };

  #onDestinationChange = (evt) => {
    evt.preventDefault();
    const newDestination = allDestinations.find((destination) => destination.name === evt.target.value);

    if (newDestination) {
      this.updateElement({
        destination: newDestination.id
      });
    }

  };

  #onPriceChange = (evt) => {
    evt.preventDefault();
    const newPrice = Math.abs(parseFloat(evt.target.value));

    if (!isNaN(newPrice)) {
      this._setState({
        basePrice: newPrice
      });
      return;
    }
    this._setState({
      basePrice: 0
    });
  };

  #onOfferChange = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
      const offersIds = checkedOffers.map((offer) => offer.dataset.id);

      this._setState({
        offers: [...offersIds]
      });

    }
  };

  #startDateChangeHandler = ([dateFrom]) => {
    this.updateElement({
      dateFrom: dateFrom,
    });
  };

  #endDateChangeHandler = ([dateTo]) => {
    this.updateElement({
      dateTo: dateTo,
    });
  };

  #setDatePicker () {
    const startDate = this.element.querySelector('#event-start-time-1');
    const endDate = this.element.querySelector('#event-end-time-1');

    this.#startDatepicker = flatpickr(
      startDate,
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._state.dateTo,
        onChange: this.#startDateChangeHandler,
      }
    );

    this.#endDatepicker = flatpickr(
      endDate,
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        onChange: this.#endDateChangeHandler,
      }
    );
  }

  static parsePointToState = (point) => ({...point});

  static parseStateToPoint = (state) => ({...state});

  reset (point) {
    this.updateElement(EditPointView.parsePointToState(point));
  }

}
