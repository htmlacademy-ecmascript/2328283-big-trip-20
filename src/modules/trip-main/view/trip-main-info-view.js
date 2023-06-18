import AbstractView from '../../../framework/view/abstract-view.js';

import { sortByAsc } from '../../../utils/common.js';
import { DateFormat, convertDate, isSameDate } from '../../../utils/date.js';
import { MAX_DISPLAYED_DESTINATIONS } from '../../../const.js';

//* Определение наименования маршрута
//* ------------------------------------------------------

const getTitle = ({ destinations, events }) => {
  const destinationNamesList = events
    .sort(sortByAsc('dateFrom'))
    .map((event) => destinations.get(event.destination).name);

  if (destinationNamesList.length <= MAX_DISPLAYED_DESTINATIONS) {
    return destinationNamesList.join('&nbsp;&mdash;&nbsp;');
  }

  return `${destinationNamesList[0]}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${destinationNamesList.at(-1)}`;
};

//* Определение дат начала и конца путешествия
//* ------------------------------------------------------

const getTripDates = ({ events }) => {
  if (events.length === 0) {
    return '';
  }

  const firstEventSortedByDateTo = events
    .sort(sortByAsc('dateFrom'))
    .at(0);
  const lastEventSortedByDateTo = events
    .sort(sortByAsc('dateTo'))
    .at(-1);

  const formattedDateFrom = convertDate(firstEventSortedByDateTo.dateFrom, DateFormat.EVENT_DATE);
  let formattedDateTo = convertDate(lastEventSortedByDateTo.dateTo, DateFormat.EVENT_DATE);

  if (isSameDate(formattedDateFrom, formattedDateTo, 'M')) {
    formattedDateTo = convertDate(lastEventSortedByDateTo.dateTo, DateFormat.SHORT_EVENT_DATE);
  }

  return `${formattedDateFrom}&nbsp;&mdash;&nbsp;${formattedDateTo}`;
};

//* Подсчет итоговой стоимости
//* ------------------------------------------------------

const calculateTotalCost = ({ offerTypes, events }) => {
  if (events.length === 0) {
    return 0;
  }

  const totalCost = events.reduce((result, event) => {
    let offersCost = 0;
    const { offers } = offerTypes.get(event.type);

    if (offers.length !== 0 && event.offers !== 0) {
      offersCost = offers.reduce((accum, offer) => event.offers.includes(offer.id) ? accum + offer.price : accum, 0);
    }

    return result + event.basePrice + offersCost;
  }, 0);

  return totalCost;
};

const createTripMainInfoTemplate = ({ destinations, offerTypes, events }) => (/*html*/`
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTitle({ destinations, offerTypes, events })}</h1>
      <p class="trip-info__dates">${getTripDates({ events })}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateTotalCost({ offerTypes, events })}</span>
    </p>
  </section>`);

export default class TripMainInfoView extends AbstractView {
  #data = {};

  constructor({ destinations, offerTypes, events }) {
    super();
    this.#data = { destinations, offerTypes, events };
  }

  get template() {
    return createTripMainInfoTemplate(this.#data);
  }
}

