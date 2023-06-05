import { EVENTS } from '../const.js';
import { createIdGenerator, getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import { getDestinationsIds } from './destinations.js';
import { getOffersIds } from './offers.js';
import { nanoid } from 'nanoid';

const dateStep = createIdGenerator();

const getPoint = () => {
  const pointType = getRandomArrayElement(EVENTS);
  const offerIds = getOffersIds(pointType);
  const destinationsIds = getDestinationsIds();

  const point = {
    id: nanoid(),
    basePrice: getRandomInteger(100, 2000),
    dateFrom: new Date(new Date().getTime() + (dateStep() * getRandomInteger(500, 550) * 60 * 60 * 24)),
    dateTo: new Date(new Date().getTime() + (dateStep() * 550 * 60 * 60 * 24)),
    destination: getRandomArrayElement(destinationsIds),
    isFavorite: Math.random() < 0.5,
    offers: offerIds.slice(0, offerIds.length - getRandomInteger(0, offerIds.length)),
    type: pointType
  };
  return point;
};

export { getPoint };
