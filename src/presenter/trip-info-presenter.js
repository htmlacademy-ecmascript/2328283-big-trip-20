import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {

  #eventContainer = null;
  #pointsModel = null;

  #eventPoints = [];

  constructor({eventContainer, pointsModel}) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;
  }

  init () {
    this.#eventPoints = [...this.#pointsModel.points];

    if (!this.#eventPoints.length) {
      return;
    }

    render(new TripInfoView({points: this.#eventPoints}), this.#eventContainer, RenderPosition.AFTERBEGIN);
  }
}
