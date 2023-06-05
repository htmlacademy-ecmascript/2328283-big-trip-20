import TripEventsListView from '../view/trip-events_list.js';
import SortingView from '../view/sorting-view.js';
import TripEventsListEmptyView from '../view/trip-events_list-empty.js';
import { render } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { getDuration } from '../utils/point.js';

export default class EventsPresenter {
  #eventsListComponent = new TripEventsListView();
  #sortComponent = null;
  #emptyListComponent = new TripEventsListEmptyView();

  #eventContainer = null;
  #pointsModel = null;

  #eventPoints = [];
  #eventPresenters = new Map();

  #currentSortType = SortType.DAY;
  #sourcedEventPoints = [];

  constructor({eventContainer, pointsModel}) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;
  }

  init () {
    this.#eventPoints = [...this.#pointsModel.points].sort((a, b) => a.dateFrom - b.dateFrom);
    this.#sourcedEventPoints = this.#eventPoints.slice();
    this.#renderEventsList();
  }

  #renderEventsList() {
    if (!this.#eventPoints.length) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderEvents();
  }

  #handleEventChange = (updatedEvent) => {
    this.#eventPoints = updateItem(this.#eventPoints, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEvent(point) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(point);

    this.#eventPresenters.set(point.id, eventPresenter);
  }

  #renderEvents() {
    render (this.#eventsListComponent, this.#eventContainer);

    for (let i = 0; i < this.#eventPoints.length; i++) {
      this.#renderEvent(this.#eventPoints[i]);
    }
  }

  #clearEventsList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#eventContainer);
  }

  #sortEvents(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#eventPoints.sort((a, b) => {
          const durationA = getDuration(a.dateFrom, a.dateTo);
          const durationB = getDuration(b.dateFrom, b.dateTo);
          return durationB - durationA;
        });
        break;
      case SortType.PRICE:
        this.#eventPoints.sort((a, b) => b.basePrice - a.basePrice);
        break;
      default:
        this.#eventPoints = [...this.#sourcedEventPoints];
    }
    this.#currentSortType = sortType;
  }

  #handleSortChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#sortEvents(sortType);
    this.#clearEventsList();
    this.#renderEvents();
  };

  #renderSort() {
    this.#sortComponent = new SortingView({onSortChange: this.#handleSortChange});

    render (this.#sortComponent, this.#eventContainer);
  }

}
