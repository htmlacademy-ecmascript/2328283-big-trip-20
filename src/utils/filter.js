import {FilterType} from '../const';
import dayjs from 'dayjs';

const now = dayjs().format();

const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => point.dateFrom > now),
  [FilterType.PRESENT]: (points) => points.filter((point) => point.dateFrom <= now && point.dateTo >= now),
  [FilterType.PAST]: (points) => points.filter((point) => point.dateTo < now),
};

export {filter};
