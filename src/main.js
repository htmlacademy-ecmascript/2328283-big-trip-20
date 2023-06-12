import { generateAuthToken } from './utils/api.js';
import { END_POINT } from './const.js';

const authToken = generateAuthToken();

import ServerDataApiService from './api/server-data-api-service.js';

import DestinationsModel from './model/destinations-model.js';
import OfferTypesModel from './model/offer-types-model.js';
import EventsModel from './model/events-model.js';
import FiltersModel from './model/filters-model.js';

import TripMainPresenter from './modules/trip-main/presenter/trip-main-presenter.js';
import FiltersPresenter from './modules/filters/presenter/filters-presenter.js';
import NewEventPresenter from './modules/new-event/presenter/new-event-presenter.js';
import EventsBoardPresenter from './modules/events-board/presenter/events-board-presenter.js';

const destinationsModel = new DestinationsModel({ serverDataApiService: new ServerDataApiService(END_POINT, authToken) });
const offerTypesModel = new OfferTypesModel({ serverDataApiService: new ServerDataApiService(END_POINT, authToken) });
const eventsModel = new EventsModel({ serverDataApiService: new ServerDataApiService(END_POINT, authToken) });
const filtersModel = new FiltersModel();

const tripMainPresenter = new TripMainPresenter({ destinationsModel, offerTypesModel, eventsModel });
const filtersPresenter = new FiltersPresenter({ eventsModel, filtersModel });
const eventsBoardPresenter = new EventsBoardPresenter({ destinationsModel, offerTypesModel, eventsModel, filtersModel });
const newEventPresenter = new NewEventPresenter({
  destinationsModel: destinationsModel,
  offerTypesModel: offerTypesModel,
  filtersModel: filtersModel,
  boardPresenter: eventsBoardPresenter,
});

tripMainPresenter.init();
filtersPresenter.init();
newEventPresenter.init();
eventsBoardPresenter.init({ newEventPresenter });

Promise.all([destinationsModel.init(), offerTypesModel.init()])
  .then(() => eventsModel.init())
  .then(() => newEventPresenter.activateNewEventButton())
  .catch(((error) => {
    eventsBoardPresenter.clearEventsBoard();
    eventsBoardPresenter.renderEventsBoardMessage({ error });
  }));
