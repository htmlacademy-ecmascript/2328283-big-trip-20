import TitleView from '../view/title-view.js';

import {RenderPosition, render, remove, replace} from '../framework/render.js';

export default class TripInfoPresenter {
  #container;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #destinations = [];
  #duration = 0;
  #sum = 0;

  #tripInfoComponent = null;

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#pointsModel.addObserver(this.#modelEventHandler);
  }

  #render = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TitleView({
      destinations: this.#destinationsModel.get(),
      offers: this.#offersModel.get(),
      points: this.#pointsModel.points
    });

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

  #modelEventHandler = () => {
    this.#render();
  };
}
