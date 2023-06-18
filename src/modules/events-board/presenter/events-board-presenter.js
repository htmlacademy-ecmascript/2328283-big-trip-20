import EventPresenter from '../../event/presenter/event-presenter.js';
import EventsBoardSortView from '../view/events-board-sort-view.js';
import EventsBoardListView from '../view/events-board-list-view.js';
import EventsBoardMessageView from '../view/events-board-message-view.js';
import UiBlocker from '../../../framework/ui-blocker/ui-blocker.js';

import { RenderPosition, remove, render } from '../../../framework/render.js';
import { sortByDurationDesc, sortByDateFromAsc } from '../../../utils/date.js';
import { filterEventsBy } from '../../../utils/filters.js';
import { sortByDesc } from '../../../utils/common.js';
import { TimeLimit, SortType, UpdateType, UserAction } from '../../../const.js';

const tripEvents = document.querySelector('.trip-events');

export default class EventsBoardPresenter {
  #destinationsModel = null;
  #offerTypesModel = null;
  #eventsModel = null;
  #filtersModel = null;

  #eventsBoardSortComponent = null;
  #eventsBoardMessageComponent = null;
  eventsBoardListComponent = new EventsBoardListView();

  #eventPresenters = new Map();
  #newEventPresenter = null;

  #defaultSortType = SortType.DAY;
  #currentSortType = this.#defaultSortType;

  #isCreating = false;
  #isLoading = true;

  #UIBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ destinationsModel, offerTypesModel, eventsModel, filtersModel }) {
    this.#destinationsModel = destinationsModel;
    this.#offerTypesModel = offerTypesModel;
    this.#eventsModel = eventsModel;
    this.#filtersModel = filtersModel;

    this.#eventsModel.addObserver(this.#onModelChange);
    this.#filtersModel.addObserver(this.#onModelChange);
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offerTypes() {
    return this.#offerTypesModel.offerTypes;
  }

  get events() {
    const currentFilter = this.#filtersModel.currentFilter;
    const filteredEvents = filterEventsBy[currentFilter](this.#eventsModel.events);

    switch (this.#currentSortType) {
      case (SortType.DAY):
        return filteredEvents.sort(sortByDateFromAsc);
      case (SortType.TIME):
        return filteredEvents.sort(sortByDurationDesc);
      case (SortType.PRICE):
        return filteredEvents.sort(sortByDesc('basePrice'));
      default:
        throw new Error(`No implementation of sorting by field found ${this.#currentSortType.name.toUpperCase()}`);
    }
  }

  init({ newEventPresenter }) {
    this.renderEventsBoard();
    this.#newEventPresenter = newEventPresenter;
  }

  setIsCreatingFlagValue(value) {
    this.#isCreating = value;
  }

  setDefaultSortType() {
    this.#currentSortType = this.#defaultSortType;
  }

  renderEventsBoard() {
    this.#renderEventsBoardList();

    if (this.#isLoading) {
      this.renderEventsBoardMessage({ message: 'Loading...' });
      return;
    }

    if (this.events.length === 0 && !this.#isCreating) {
      this.renderEventsBoardMessage({ currentFilter: this.#filtersModel.currentFilter });
      return;
    }

    this.#renderEventsBoardSort();
  }

  clearEventsBoard({ resetSortType = false } = {}) {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#eventsBoardSortComponent);
    remove(this.eventsBoardListComponent);
    remove(this.#eventsBoardMessageComponent);

    if (resetSortType) {
      this.#currentSortType = this.#defaultSortType;
    }
  }

  #renderEventsBoardSort() {
    this.#eventsBoardSortComponent = new EventsBoardSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#onSortTypeChange
    });

    render(this.#eventsBoardSortComponent, this.eventsBoardListComponent.element, RenderPosition.BEFOREBEGIN);
  }

  #renderEventsBoardList() {
    render(this.eventsBoardListComponent, tripEvents);
    this.events.forEach((event) => this.#renderEventsBoardItem({
      destinations: this.destinations,
      offerTypes: this.offerTypes,
      event
    }));
  }

  #renderEventsBoardItem({ destinations, offerTypes, event }) {
    const eventsBoardItemPresenter = new EventPresenter({
      eventsListContainer: this.eventsBoardListComponent,
      onEventUserAction: this.onEventUserAction,
      onEventModeChange: this.#onEventModeChange
    });

    eventsBoardItemPresenter.init({ destinations, offerTypes, event });
    this.#eventPresenters.set(event.id, eventsBoardItemPresenter);
  }

  renderEventsBoardMessage({ message, currentFilter, error = null }) {
    const messageText = error ? error.message : message;
    this.#eventsBoardMessageComponent = new EventsBoardMessageView({ message: messageText, currentFilter });
    render(this.#eventsBoardMessageComponent, tripEvents);
  }

  onEventUserAction = async (actionType, updateType, updatedEvent) => {
    this.#UIBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters
          .get(updatedEvent.id)
          .setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, updatedEvent);
        } catch {
          this.#eventPresenters
            .get(updatedEvent.id)
            .setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, updatedEvent);
          this.#newEventPresenter.activateNewEventButton();
        } catch {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters
          .get(updatedEvent.id)
          .setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, updatedEvent);
        } catch {
          this.#eventPresenters
            .get(updatedEvent.id)
            .setAborting();
        }
        break;
      default:
        throw new Error(`No implementation of interaction with the model with the type of user action was found ${actionType}`);
    }

    this.#UIBlocker.unblock();
  };

  #onModelChange = (updateType, updatedEvent) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters
          .get(updatedEvent.id)
          .init({
            destinations: this.destinations,
            offerTypes: this.offerTypes,
            event: updatedEvent
          });
        break;
      case UpdateType.MINOR:
        this.clearEventsBoard();
        this.renderEventsBoard();
        break;
      case UpdateType.MAJOR:
        this.clearEventsBoard({ resetSortType: true });
        this.renderEventsBoard();
        break;
      case UpdateType.INIT:
        try {
          this.#isLoading = false;
          this.clearEventsBoard();
          this.renderEventsBoard();
          break;
        } catch {
          throw new Error('Critical Web application initialization error!');
        }
      default:
        throw new Error(`No implementation of model change processing with the change type was found ${updateType}`);
    }
  };

  #onEventModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.closeEventEditForm());
    this.#newEventPresenter.closeNewEventForm();
  };

  #onSortTypeChange = (sortTypeName) => {
    this.#currentSortType = SortType[sortTypeName];
    this.clearEventsBoard();
    this.renderEventsBoard();
  };
}
