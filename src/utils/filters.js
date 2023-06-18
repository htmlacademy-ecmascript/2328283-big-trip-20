import { FilterType } from '../const.js';
import { isDateFuture, isDatePresent, isDatePast } from './date.js';

const filterEventsBy = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isDateFuture(event.dateFrom)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isDatePresent(event.dateFrom, event.dateTo)),
  [FilterType.PAST]: (events) => events.filter((event) => isDatePast(event.dateTo))
};

const initFilterTypes = (events) => Object.values(FilterType).reduce((result, filter) => {
  if (filter === FilterType.EVERYTHING) {
    return {
      ...result,
      [FilterType.EVERYTHING]: events.length
    };
  }

  return {
    ...result,
    [filter]: 0
  };
}, {});

const generateFilters = (events) => events.reduce((result, event) => {
  if (isDateFuture(event.dateFrom)) {
    result[FilterType.FUTURE]++;
  }

  if (isDatePast(event.dateTo)) {
    result[FilterType.PAST]++;
  }

  if (isDatePresent(event.dateFrom, event.dateTo)) {
    result[FilterType.PRESENT]++;
  }

  return result;
}, { ...initFilterTypes(events) }
);

export { generateFilters, filterEventsBy };
