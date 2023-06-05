import {render, RenderPosition} from './framework/render.js';
import FilterView from './view/filter-view.js';
import InfoView from './view/info-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from '../model/model.js';

import {generateFilter} from './mock.js/filter.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsFilter = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter({
  container: tripEvents,
  pointsModel,
});

const filters = generateFilter(pointsModel.points);

render(new FilterView({filters}), tripControlsFilter);
render(new InfoView(), tripMainElement, RenderPosition.AFTERBEGIN);

boardPresenter.init();
