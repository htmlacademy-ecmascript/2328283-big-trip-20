import {render, replace} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import EditEventView from '../view/edit-event-view.js';
import EventListView from '../view/event-list-view.js';
import PointView from '../view/point-view';
import EmptyListView from '../view/empty-list-view.js';

export default class BoardPresenter {
  #sortComponent = new SortView();
  #eventListView = new EventListView();

  #container = null;
  #pointsModel = null;
  #points = [];

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new EditEventView({
      point,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#eventListView. element);
  }

  #renderBoard() {
    render(this.#sortComponent, this.#container);
    render(this.#eventListView, this.#container);

    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#container);
      return;
    }
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderPoint(this.#points[i]);
    }
  }
}
