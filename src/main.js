
import FiltersView from './view/filters-view.js';
import EventsPresenter from './presenter/events-list-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import { render } from './framework/render.js';
import { generateFilter } from './mocks/filters.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel ();

const tripInfoPresenter = new TripInfoPresenter({eventContainer: tripMainElement, pointsModel});
const eventsPresenter = new EventsPresenter({eventContainer: tripEventsElement, pointsModel});

const filters = generateFilter(pointsModel.points);

render (new FiltersView({filters}), filtersElement);

tripInfoPresenter.init();
eventsPresenter.init();
