import AbstractView from '../framework/view/abstract-view.js';

function cretateTripEventsListEmptyTemplate () {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class TripEventsListEmptyView extends AbstractView {
  get template () {
    return cretateTripEventsListEmptyTemplate();
  }
}
