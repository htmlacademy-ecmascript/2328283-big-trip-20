import flatpickr from 'flatpickr';
import he from 'he';

import { formatStringToDateTime } from '../utils.js';
import { EditType } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

import 'flatpickr/dist/flatpickr.min.css';

const POINT_EMPTY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: {
    id: '',
    description: '',
    name: '',
    pictures: []
  },
  isFavorite: false,
  offers: [],
  type: 'train'
};

const DEFAULT_TYPES = [
  {text: 'Taxi', id: 'taxi'},
  {text: 'Bus', id: 'bus'},
  {text: 'Train', id: 'train'},
  {text: 'Ship', id: 'ship'},
  {text:'Drive', id: 'drive'},
  {text: 'Flight', id: 'flight'},
  {text: 'Check-in', id: 'check-in'},
  {text: 'Sightseeing', id: 'sightseeing'},
  {text: 'Restaurant', id: 'restaurant'}];

const ButtonLabel = {
  [EditType.EDITING]: 'Delete',
  [EditType.CREATING]: 'Cancel'
};

function createDeleteButtonTemplate ({typeButton, isDisabled, isDeleting}) {
  return `<button class= "event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting
    ? 'Deleting...'
    : ButtonLabel[typeButton]}</button>`;
}

function createRollupButtonTemplate () {
  return '<button class= "event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>';
}

function createPointEditControlTemplate ({typeButton, isDisabled, isSaving, isDeleting}) {
  return `<button class= "event__save-btn btn btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving
    ? 'Saving...'
    : 'Save'}</button>
  ${createDeleteButtonTemplate({typeButton, isDisabled, isDeleting})}
  ${(typeButton !== EditType.CREATING) ? createRollupButtonTemplate() : ''}`;
}

const OFFFER_CHECKBOX_NAME = 'event-offer-luggage';

function createTypesTemplate () {
  return DEFAULT_TYPES.map((types) =>
    `<div class="event__type-item">
    <input id="event-type-${types.id}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${types.id}">
    <label class="event__type-label  event__type-label--${types.id}" for="event-type-${types.id}-1">${types.text}</label>
  </div>`
  ).join('');
}


function createOfferTemplate (offersData, checkedIDs, OffersByType) {
  const checkboxesMarkup = offersData.map((offer) =>
    `<div class="event__offer-selector">
<input class="event__offer-checkbox  visually-hidden" value="${offer.id}" id="${offer.id}" type="checkbox"
name=${OFFFER_CHECKBOX_NAME} ${checkedIDs.includes(offer.id) ? 'checked' : ''}>
<label class="event__offer-label" for="${offer.id}">
  <span class="event__offer-title">${offer.title}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${offer.price}</span>
</label>
</div>`).join('');

  if (OffersByType.length !== 0) {
    return `
  <section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">
  ${checkboxesMarkup}
  </div>
  </section>
    `;
  } return '';

}

function createPhotoTemplate (pictures) {
  return pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
  ).join('');
}

function createDestinationList (pointDestinations) {
  return pointDestinations.map((city) =>
    `<option value="${city.name}"></option>`
  ).join('');
}

function createDestinationTemplate (destination) {

  if (destination) {
    return `
  <section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${destination ? destination.description : ''}</p>
  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${createPhotoTemplate(destination ? destination.pictures : [])}
    </div>
  </div>
</section>`;
  } return '';
}


function getEditPointTemplate ({point, pointDestinations, offers, typeButton, isDisabled, isSaving, isDeleting},
  getOffersByType, getDestinationById) {

  const {
    basePrice, dateFrom, dateTo, type
  } = point;

  const OffersByType = getOffersByType(type);

  const destination = getDestinationById(point.destination);

  return `<li class="trip-events__item">
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
             ${createTypesTemplate()}
          </fieldset>
        </div>
      </div>



      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
        value="${destination ? he.encode(destination.name) : ''}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${createDestinationList(pointDestinations)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
        value="${typeButton === EditType.EDITING ? formatStringToDateTime(dateFrom) : ''}">
         &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
        value="${typeButton === EditType.EDITING ? formatStringToDateTime(dateTo) : ''}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
      </div>
        ${createPointEditControlTemplate({typeButton, isDisabled, isDeleting, isSaving})}

        <span class="visually-hidden">Open event</span>
        </button>
        </header>

      <section class="event__details">
        ${typeButton === EditType.EDITING ? createOfferTemplate(offers, point.offers, OffersByType) : createOfferTemplate(OffersByType, point.offers, OffersByType)}

        ${createDestinationTemplate(destination)}
      </section>
    </form>
  </li>
`;
}export default class EditPointView extends AbstractStatefulView {
  #pointDestinations = null;
  #onFormSubmit = null;
  #onCloseClick = null;
  #getOffersByType = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #onDeleteClick = null;
  #getDestinationById = null;
  #getDestinationByCity = null;

  constructor({point = POINT_EMPTY, pointDestinations, offers, onFormSubmit, onDeleteClick, onCloseClick, getOffersByType,
    getDestinationById, typeButton = EditType.EDITING, getDestinationByCity}) {
    super();
    this.#getOffersByType = getOffersByType;
    this.#getDestinationById = getDestinationById;
    this.#getDestinationByCity = getDestinationByCity;

    this._setState({
      point,
      offers,
      pointDestinations,
      typeButton,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });
    this.#pointDestinations = pointDestinations;
    this.#onFormSubmit = onFormSubmit;
    this.#onDeleteClick = onDeleteClick;
    this.#onCloseClick = onCloseClick;

    this._restoreHandlers();
  }

  get template() {
    return getEditPointTemplate(this._state, this.#getOffersByType, this.#getDestinationById);
  }

  /**
   * @param {Event} evt
   */
  #onTypeChange = (evt) => {
    const type = evt.target.value;

    this.updateElement({
      point: {
        ...this._state.point,
        type,
      },
      offers: this.#getOffersByType(type)
    });

  };

  #priceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.valueAsNumber
      }
    });
  };

  #destinationInputChange = (evt) => {
    const destination = this.#getDestinationByCity(evt.target.value);
    const isEnteredNewDestination = destination && destination.id !== this._state.point.destination;

    if (destination && isEnteredNewDestination) {
      this.updateElement({
        point: {
          ...this._state.point,
          destination: destination.id
        }
      });
    }
  };

  reset = (point) => this.updateElement({point});

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate
      }
    });
    this.#datepickerFrom.set('maxDate', this._state.point.dateTo);
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate
      }
    });
    this.#datepickerFrom.set('minDate', this._state.point.dateFrom);
  };

  #setDatepickers = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateFrom,
        onClose: this.#dateFromChangeHandler,
        enableTime: true,
        maxDate: this._state.point.dateTo,
        locale: {
          firstDayOfWeek: 1,
        },
        'time_24hr': true
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateTo,
        onClose: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.point.dateFrom,
        locale: {
          firstDayOfWeek: 1,
        },
        'time_24hr': true
      },
    );
  };

  _restoreHandlers = () => {
    const form = this.element.querySelector('form');

    form.addEventListener('submit', this.#onFormSubmitClick);

    if (this._state.typeButton === EditType.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onCloseClick);

      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onFormDeleteHandler);
    }
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onFormCancelHandler);

    this.element.querySelector('.event__type-group').addEventListener('change', this.#onTypeChange);

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputChange);

    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputChange);

    this.#setDatepickers();
  };

  #isCorrectDate = () => this.#datepickerFrom.selectedDates.length > 0 && this.#datepickerTo.selectedDates.length > 0;


  #onFormSubmitClick = (evt) => {
    evt.preventDefault();
    const form = evt.target;
    const formData = new FormData(form);
    const offers = formData.getAll(OFFFER_CHECKBOX_NAME);

    this._state.point.offers = offers;

    if (this.#isCorrectDate()) {
      return this.#onFormSubmit({
        ...this._state.point,
        offers
      });
    }
    this.shake();
  };

  #onFormDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick({...this._state.point,});
  };

  #onFormCancelHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseClick();
  };
}
