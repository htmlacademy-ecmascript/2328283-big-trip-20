import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import DestinationsModel from './model/destination-model.js';
import OfferModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './service/points-api-service.js';
const AUTHORIZATION = 'Basic somebasicstring46512345';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';


const tripMain = document.querySelector('.trip-main');
const filterForm = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const destinationsModel = new DestinationsModel(pointsApiService);
const offersModel = new OfferModel(pointsApiService);
const pointsModel = new PointsModel({
  service: pointsApiService,
  destinationsModel,
  offersModel
});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  container: filterForm,
  pointsModel,
  filterModel
});

const titlePresenter = new TripInfoPresenter({container: tripMain, pointsModel, destinationsModel, offersModel});

const boardPresenter = new BoardPresenter({container: tripEventsContainer, newPointButtonContainer: tripMain, destinationsModel, offersModel, pointsModel, filterModel});

titlePresenter.init();
pointsModel.init();
filterPresenter.init();
boardPresenter.init();

