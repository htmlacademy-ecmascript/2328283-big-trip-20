import EditPointView from '../view/edit-point-view.js';
import {render, remove, RenderPosition} from '../framework/render.js';
import {UserAction, UpdateType, EditType} from '../const.js';


export default class NewPointPresenter {

  #container = null;
  #destinationModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;
  #pointNewComponent = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #handleDestroy = null;
  #handleEscKeyDown = null;
  #handleDataChange = null;
  #handleDestroyPresenter = null;

  constructor({container, destinationsModel, offersModel, pointsModel, filterModel, onDataChange, onDestroy}) {
    this.#container = container;
    this.#destinationModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroyPresenter = onDestroy;

    this._eventEditComponent = null;
  }

  init() {
    if (this.#pointNewComponent !== null) {
      return;
    }

    this.#pointNewComponent = new EditPointView({
      pointDestinations: this.#destinationModel.get(),
      offers: this.#offersModel.get(),
      onFormSubmit: this.#formSubmitHandler,
      onCloseClick: this.#handleClickClose,
      typeButton: EditType.CREATING,
      getOffersByType: (type) => this.#offersModel.getByType(type),
      getDestinationById: (destination) => this.#destinationModel.getById(destination),
      getDestinationByCity: (city) => this.#destinationModel.getByCity(city)
    });

    render(this.#pointNewComponent, this.#container, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy () {
    if (this.#pointNewComponent === null) {
      return;
    }
    this.#handleDestroyPresenter();
    document.querySelector('.trip-main__event-add-btn').disabled = false;
    remove(this.#pointNewComponent);
    this.#pointNewComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.CREATE_POINT,
      UpdateType.MINOR,
      {...point},
    );
  };

  #handleClickClose = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  setSaving() {
    this.#pointNewComponent.updateElement({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointNewComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    this.#pointNewComponent.shake(resetFormState);
  }
}
