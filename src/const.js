const POINTS_COUNT = 6;

const TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant'
];

const DESCRIPTION = [
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Aliquam erat volutpat.',
  'In rutrum ac purus sit amet tempus.'
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export {POINTS_COUNT, TYPES, DESCRIPTION, FilterType};
