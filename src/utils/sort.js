import { SortType } from '../const.js';

import { getPointsDateDifference, getPointsDurationDifference, getPointsPriceDifference } from '../utils/point.js';

function sortPoints(sortType, data) {
  switch (sortType) {
    case SortType.DAY:
      data.sort(getPointsDateDifference);
      break;
    case SortType.TIME:
      data.sort(getPointsDurationDifference);
      break;
    case SortType.PRICE:
      data.sort(getPointsPriceDifference);
      break;
  }
  return data;
}

export {sortPoints};
