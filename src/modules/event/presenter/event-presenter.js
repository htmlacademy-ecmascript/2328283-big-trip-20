import EventItemView from '../view/event-item-view.js';
import EventFormItemView from '../view/event-form-item-view.js';

import { render, replace, remove } from '../../../framework/render.js';
import { isSameDate } from '../../../utils/date.js';
import { EventMode, UserAction, UpdateType } from '../../../const.js';

export default class EventPresenter {
  #data = {};

  #eventsListContainer = null;
  #eventItem = null;
  #eventFormItem = null;

  #onEventUserAction = null;
  #onEventModeChange = null;

  #mode = EventMode.DEFAULT;

  constructor({ eventsListContainer, onEventUserAction, onEventModeChange }) {
    this.#eventsListContainer = eventsListContainer;
    this.#onEventModeChange = onEventModeChange;
    this.#onEventUserAction = onEventUserAction;
  }

  init({ destinations, offerTypes, event }) {
    this.#data = { destinations, offerTypes, event };

    const prevEventItemComponent = this.#eventItem;
    const prevEventEditItemComponent = this.#eventFormItem;

    this.#eventItem = new EventItemView({
      data: this.#data,
      onRollupButtonClick: this.#onEventRollupButtonClick,
      onFavoriteButtonClick: this.#onFavoriteButtonClick
    });

    this.#eventFormItem = new EventFormItemView({
      data: this.#data,
      onRollupButtonClick: this.#onEditFormRollupButtonClick,
      onFormSubmit: this.#onEditFormSubmit,
      onButtonClick: this.#onDeleteButtonClick
    });

    if (prevEventItemComponent === null) {
      render(this.#eventItem, this.#eventsListContainer.element);
      return;
    }

    if (this.#mode === EventMode.DEFAULT) {
      replace(this.#eventItem, prevEventItemComponent);
    }

    if (this.#mode === EventMode.EDITING) {
      replace(this.#eventItem, prevEventEditItemComponent);
      this.#mode = EventMode.DEFAULT;
    }

    remove(prevEventItemComponent);
    remove(prevEventEditItemComponent);
  }

  setSaving() {
    if (this.#mode === EventMode.EDITING) {
      this.#eventFormItem.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  }

  setDeleting() {
    if (this.#mode === EventMode.EDITING) {
      this.#eventFormItem.updateElement({
        isDisabled: true,
        isDeleting: true
      });
    }
  }

  setAborting() {
    if (this.#mode === EventMode.DEFAULT) {
      this.#eventItem.shake();
      return;
    }

    const resetFormDisabling = () =>
      this.#eventFormItem.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });

    this.#eventFormItem.shake(resetFormDisabling);
  }

  destroy() {
    remove(this.#eventItem);
    remove(this.#eventFormItem);
  }

  closeEventEditForm() {
    if (this.#mode !== EventMode.DEFAULT) {
      this.#eventFormItem.reset();
      this.#replaceEditFormToEventItem();
    }
  }

  #replaceEventItemToEditForm() {
    replace(this.#eventFormItem, this.#eventItem);
    this.#onEventModeChange();
    this.#mode = EventMode.EDITING;
    document.addEventListener('keydown', this.#onDocumentEscapeKeydown);
  }

  #replaceEditFormToEventItem() {
    replace(this.#eventItem, this.#eventFormItem);
    this.#mode = EventMode.DEFAULT;
    document.removeEventListener('keydown', this.#onDocumentEscapeKeydown);
  }

  #onEventRollupButtonClick = () => this.#replaceEventItemToEditForm();

  #onEditFormRollupButtonClick = () => this.closeEventEditForm();

  #onFavoriteButtonClick = () => this.#onEventUserAction(
    UserAction.UPDATE_EVENT,
    UpdateType.PATCH,
    { ...this.#data.event, isFavorite: !this.#data.event.isFavorite }
  );

  #onEditFormSubmit = (updatedEvent) => {
    const isPricesEqual = this.#data.event.basePrice !== updatedEvent.basePrice;
    const isDatesFromEqual = !isSameDate(this.#data.event.dateFrom, updatedEvent.dateFrom);
    const isDatesToEqual = !isSameDate(this.#data.event.dateTo, updatedEvent.dateTo);
    const isMinorUpdate = isPricesEqual || isDatesFromEqual || isDatesToEqual;

    this.#onEventUserAction(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      updatedEvent
    );
  };

  #onDeleteButtonClick = (updatedEvent) => {
    this.#onEventUserAction(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      updatedEvent
    );
  };

  #onDocumentEscapeKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.closeEventEditForm();
      document.removeEventListener('keydown', this.#onDocumentEscapeKeydown);
    }
  };
}
