import HeaderView from './view/header-view.js';
import {RenderPosition, render} from './framework/render.js';
import NewPointButtonView from './view/new-point-button-view.js';

import MainPresenter from './presenter/main-presenter.js';

import PointsModel from './model/points-model.js';

import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic svsld49thbne45b';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();
const mainPresenter = new MainPresenter({
  container: siteMainElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteFilterElement,
  filterModel,
  pointsModel,
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  mainPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(new HeaderView(), siteHeaderElement, RenderPosition.AFTERBEGIN);

filterPresenter.init();
mainPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, siteHeaderElement, RenderPosition.BEFOREEND);
  });
