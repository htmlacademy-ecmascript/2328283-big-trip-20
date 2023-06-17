import NewEventButtonView from '../view/new-event-button-view.js';
import EventFormItemView from '../../event/view/event-form-item-view';

import { RenderPosition, render, remove } from '../../../framework/render';
import { getRandomItem } from '../../../utils/common.js';
import { FilterType, UpdateType, UserAction } from '../../../const';

const tripMain = document.querySelector('.trip-main');

export default class NewEventPresenter {
  #destinationsModel = null;
  #offerTypesModel = null;
  #filtersModel = null;

  #boardPresenter = null;

  #newEventButtonComponent = null;
  #newEventFormComponent = null;

  constructor({ destinationsModel, offerTypesModel, filtersModel, boardPresenter }) {
    this.#destinationsModel = destinationsModel;
    this.#offerTypesModel = offerTypesModel;
    this.#filtersModel = filtersModel;
    this.#boardPresenter = boardPresenter;
  }

  init() {
    this.#renderNewEventButton();
    this.deactivateNewEventButton();
  }

  setSaving() {
    this.#newEventFormComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormDisabling = () =>
      this.#newEventFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });

    this.#newEventFormComponent.shake(resetFormDisabling);
  }

  activateNewEventButton = () => {
    this.#newEventButtonComponent.element.disabled = false;
  };

  deactivateNewEventButton = () => {
    this.#newEventButtonComponent.element.disabled = true;
  };

  closeNewEventForm = () => {
    if (this.#newEventFormComponent === null) {
      return;
    }

    this.#boardPresenter.setIsCreatingFlagValue(false);
    this.activateNewEventButton();
    document.removeEventListener('keydown', this.#onDocumentEscapeKeydown);

    remove(this.#newEventFormComponent);
    this.#newEventFormComponent = null;

    if (this.#boardPresenter.events.length === 0) {
      this.#boardPresenter.clearEventsBoard();
      this.#boardPresenter.renderEventsBoard();
    }
  };

  #createNewEvent() {
    this.#newEventFormComponent = new EventFormItemView({
      data: {
        destinations: this.#destinationsModel.destinations,
        offerTypes: this.#offerTypesModel.offerTypes,
        event: this.#createNewEventBlank()
      },
      isNewEvent: true,
      onFormSubmit: this.#onNewEventFormSubmit,
      onButtonClick: this.#onCancelButtonClick
    });

    render(this.#newEventFormComponent, this.#boardPresenter.eventsBoardListComponent.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onDocumentEscapeKeydown);
  }

  #renderNewEventButton() {
    this.#newEventButtonComponent = new NewEventButtonView({
      onNewEventButtonClick: this.#onNewEventButtonClick
    });
    render(this.#newEventButtonComponent, tripMain);
  }

  #createNewEventBlank() {
    return {
      basePrice: 1,
      dateFrom: new Date(),
      dateTo: new Date(),
      destination: getRandomItem(this.#destinationsModel.destinations).id,
      isFavorite: false,
      offers: [],
      type: getRandomItem(this.#offerTypesModel.offerTypes).type
    };
  }

  #onNewEventButtonClick = () => {
    this.#boardPresenter.setIsCreatingFlagValue(true);
    this.#boardPresenter.setDefaultSortType();
    this.#filtersModel.setCurrentFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#createNewEvent();
    this.deactivateNewEventButton();
  };

  #onNewEventFormSubmit = (newEvent) => {
    this.#boardPresenter.onEventUserAction(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      newEvent
    );
  };

  #onCancelButtonClick = () => this.closeNewEventForm();

  #onDocumentEscapeKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.closeNewEventForm();
    }
  };
}
