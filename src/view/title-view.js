import AbstractView from '../framework/view/abstract-view.js';
import {getTripTitle, getTripDuration, getTripCost} from '../utils/trip-info.js';

function createTitleTemplate(points, destinations, offers) {
  return ` <section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getTripTitle(points, destinations)}</h1>

    <p class="trip-info__dates">${getTripDuration(points)}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripCost(points, offers)}</span>
  </p>
</section>`;
}

export default class TitleView extends AbstractView {

  #points = null;
  #destinations = null;
  #offers = null;

  constructor({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTitleTemplate(this.#points, this.#destinations, this.#offers);
  }
}
