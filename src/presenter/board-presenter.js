import { SortType, UserAction, UpdateType } from '../const.js';
import {sortPoints} from '../utils/sort.js';
import {render, remove, replace} from '../framework/render.js';
import { filter, FilterType } from '../utils/filter.js';
import EventListView from '../view/event-list-view.js';
import NewPointButtonView from '../view/new-button-view.js';
import SortView from '../view/sort-view.js';
import NewPointPresenter from './new-point-presenter.js';
import PointPresenter from './point-presenter.js';
import MessageView from '../view/message-view.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export default class BoardPresenter {
  #eventListComponent = new EventListView();
  #container = null;
  #newPointButtonContainer = null;
  #destinationModel = null;
  #offersModel = null;
  #pointsModel = null;
  #sortComponent = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #filterModel = null;
  #newPointPresenter = null;
  #newPointButton = null;
  #messageComponent;
  #handleModelEvent = null;
  #isCreating = false;
  #isLoading = true;
  #loadingComponent = new LoadingView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({container, newPointButtonContainer, destinationsModel, offersModel, pointsModel, filterModel}) {
    this.#container = container;
    this.#newPointButtonContainer = newPointButtonContainer;
    this.#destinationModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#newPointDestroyHandler
    });

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const filteredPoints = filter[filterType](this.#pointsModel.points);

    return sortPoints(this.#currentSortType, filteredPoints);
  }

  init() {
    this.#newPointButton = new NewPointButtonView ({onclick: this.#newPointButtonClickHandler});
    render(this.#newPointButton, this.#newPointButtonContainer);
    this.#renderBoard();
  }

  #renderSort() {
    if (this.points.length !== 0) {
      const prevSortComponent = this.#sortComponent;

      this.#sortComponent = new SortView({
        sortType: this.#currentSortType,
        onSortTypeChange: this.#handleSortTypeChange,
        points: this.points
      });

      if (prevSortComponent) {
        replace(this.#sortComponent, prevSortComponent);
        remove(prevSortComponent);
      } else {
        render(this.#sortComponent, this.#container);
      }
    }

  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#clearPoints();
      this.#renderSort();
      this.#renderPoints();
    }
  };

  #renderListComponent() {
    render(this.#eventListComponent, this.#container);
  }

  #renderPoint = (point) => {

    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      destinationModel: this.#destinationModel,
      offersModel: this.#offersModel,
      onDataChange: this.#viewActionHandler,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  };

  #renderPoints() {
    this.points.forEach(this.#renderPoint);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderMessage() {
    this.#messageComponent = new MessageView({filterType: this.#filterModel.filter});
    render(this.#messageComponent, this.#container);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderBoard() {
    if (this.#isLoading) {
      return this.#renderLoading();
    }
    if (this.points.length === 0 && !this.#isCreating) {
      return this.#renderMessage();
    }

    this.#renderSort();
    this.#renderListComponent();
    this.#renderPoints();
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#clearPoints();
    if (this.#messageComponent) {
      remove(this.#messageComponent);
    }

    if (this.points.length === 0) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    const currentPointPresenter = this.#pointPresenters.get(update.id);
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        currentPointPresenter?.setSaving();
        try {
          await this.#pointsModel.update(updateType, update);
          currentPointPresenter?.setSuccesUpdate();
        } catch(err) {
          currentPointPresenter?.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        currentPointPresenter?.setDeleting();
        try {
          await this.#pointsModel.delete(updateType, update);
        } catch(err) {
          currentPointPresenter?.setAborting();
        }

        break;
      case UserAction.CREATE_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.add(updateType, update);
          this.#newPointPresenter.destroy();
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #modelEventHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #newPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButton.setDisabled(true);
    this.#newPointPresenter.init();
  };

  #newPointDestroyHandler = () => {
    this.#isCreating = false;
    this.#newPointButton.setDisabled(false);
    if (this.points.length === 0) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
      this.#renderMessage();
    }
  };
}
