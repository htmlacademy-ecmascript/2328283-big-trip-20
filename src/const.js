const MAX_DISPLAYED_DESTINATIONS = 3;
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';
const ERROR_MESSAGE_SHOW_TIME = 5000;

const HTTPMethod = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PRESENT: 'PRESENT',
  PAST: 'PAST'
};

const EmptyFilterMessage = {
  [FilterType.EVERYTHING]: 'Click "New Event" to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

const SortType = {
  DAY: {
    name: 'day',
    disabled: false
  },
  EVENT: {
    name: 'event',
    disabled: true
  },
  TIME: {
    name: 'time',
    disabled: false
  },
  PRICE: {
    name: 'price',
    disabled: false
  },
  OFFERS: {
    name: 'offers',
    disabled: true
  }
};

const EventMode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

export {
  MAX_DISPLAYED_DESTINATIONS,
  END_POINT, ERROR_MESSAGE_SHOW_TIME,
  HTTPMethod,
  TimeLimit,
  SortType,
  FilterType,
  EmptyFilterMessage,
  EventMode,
  UserAction,
  UpdateType
};
