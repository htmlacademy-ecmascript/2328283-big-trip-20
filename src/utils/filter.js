import {dayjs} from '../utils.js';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

function generateFilters(points) {
  return Object.entries(filter)
    .map(([filterType, filterPoints]) => ({
      type: filterType,
      hasPoints: filterPoints(points).length > 0
    }));
}


function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}


export {generateFilters, FilterType, filter, isPointFuture, isPointPresent, isPointPast};

