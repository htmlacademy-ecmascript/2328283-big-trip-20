import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);


const DATE_FORMAT = 'D MMM';
const TIME_FORMAT = 'HH:mm';

const humanizePointDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : '';
const humanizePointTime = (time) => time ? dayjs(time).format(TIME_FORMAT) : '';

const getDuration = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom));

const getEventDuration = (dateFrom, dateTo) => {
  const diff = dayjs.duration(dayjs(dateTo) - dayjs(dateFrom));

  let eventDuration = '';

  if (diff.days() > 0) {
    eventDuration += `${diff.days()}D `;
  }
  if (diff.days() > 0 || diff.hours() > 0) {
    eventDuration += `${diff.hours()}H`;
  }
  if (diff.days() > 0 || diff.hours() > 0 || diff.minutes() > 0) {
    eventDuration += ` ${diff.minutes()}M`;
  }

  return eventDuration;
};

function isPointFuture(dateFrom) {
  return dateFrom && dayjs().isBefore(dateFrom, 'D');
}

function isPointPast(dateTo) {
  return dateTo && dayjs().isAfter(dateTo, 'D');
}

function isPointPreset(dateFrom, dateTo) {
  const isDateFromSameDateOrBefore = dayjs().isSameOrAfter(dayjs(dateFrom), 'D');
  const isDateToSameDateOrAfter = dayjs().isSameOrBefore(dayjs(dateTo), 'day');

  return isDateFromSameDateOrBefore && isDateToSameDateOrAfter;
}

export { humanizePointDate, humanizePointTime, getDuration, getEventDuration, isPointFuture, isPointPast, isPointPreset };
