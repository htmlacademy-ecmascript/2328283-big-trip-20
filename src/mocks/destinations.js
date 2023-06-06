import { getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import { CITIES, DESCRIPTIONS } from '../const.js';
import { nanoid } from 'nanoid';

const MAX_PICTURES = 5;

const getPicture = () => ({
  src: `https://loremflickr.com/248/152?random=${Math.random()}`,
  description: getRandomArrayElement(DESCRIPTIONS)
});

const createDestination = (city) => ({
  id: nanoid(),
  description: getRandomArrayElement(DESCRIPTIONS),
  name: city,
  pictures: Array.from({length: getRandomInteger(0, MAX_PICTURES)}, getPicture)
});

const getDestinations = () => {
  const destinations = [];
  for (let i = 0; i < CITIES.length; i++) {
    destinations[i] = createDestination(CITIES[i]);
  }
  return destinations;
};

const allDestinations = getDestinations();

const getDestinationsIds = () => allDestinations.map((destination) => destination.id);

const getDestinationById = (id) => {
  const destination = allDestinations.find((element) => element.id === id);
  return destination;
};

export { getDestinationsIds, getDestinationById, allDestinations };
