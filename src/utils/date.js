import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const DateFormat = {
  EVENT_DATE: 'MMM D',
  SHORT_EVENT_DATE: 'D',
  EVENT_EDIT_DATE: 'DD/MM/YY HH:mm',
  TIME: 'HH:mm',
  D_H_M_DURATION: 'DD[D] HH[H] mm[M]',
  H_M_DURATION: 'HH[H] mm[M]',
  M_DURATION: 'mm[M]'
};

const convertDate = (date, format) => dayjs(date).format(format);

const getDuration = (start, end) => dayjs.duration(dayjs(end).diff(dayjs(start)));

const formatDuration = (durationValue) => {
  if (durationValue.get('day')) {
    return durationValue.format(DateFormat.D_H_M_DURATION);
  }

  if (!durationValue.get('day') && durationValue.get('hour')) {
    return durationValue.format(DateFormat.H_M_DURATION);
  }

  return durationValue.format(DateFormat.M_DURATION);
};

const sortByDurationDesc = (pointA, pointB) => {
  const pointADuration = getDuration(pointA.dateFrom, pointA.dateTo);
  const pointBDuration = getDuration(pointB.dateFrom, pointB.dateTo);

  return pointBDuration.asMilliseconds() - pointADuration.asMilliseconds();
};

const sortByDateFromAsc = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const isDateFuture = (dateFrom) => dayjs().isBefore(dateFrom);

const isDatePresent = (dateFrom, dateTo) => dayjs().isAfter(dateFrom) && dayjs().isBefore(dateTo);

const isDatePast = (dateTo) => dayjs().isAfter(dateTo);

const isSameDate = (firstDate, secondDate, unit = null) => {
  if (unit) {
    return dayjs(firstDate).isSame(secondDate, unit);
  }
  return dayjs(firstDate).isSame(secondDate);
};

export {
  DateFormat,
  convertDate,
  getDuration,
  formatDuration,
  sortByDurationDesc,
  sortByDateFromAsc,
  isDateFuture,
  isDatePast,
  isDatePresent,
  isSameDate
};
