import {DESCRIPTION} from '../const.js';
import {getRandomArrayElement, getRandomNumber} from '../utils/util.js';

const mockDestinations = [
  {
    id: '10',
    description: getRandomArrayElement(DESCRIPTION),
    name: 'Geneva',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 50)}`,
        description: getRandomArrayElement(DESCRIPTION),
      },
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 50)}`,
        description: getRandomArrayElement(DESCRIPTION),
      }
    ]
  },
  {
    id: '11',
    description: getRandomArrayElement(DESCRIPTION),
    name: 'Rome',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 50)}`,
        description: getRandomArrayElement(DESCRIPTION),
      }
    ]
  },
  {
    id: '12',
    description: getRandomArrayElement(DESCRIPTION),
    name: 'Amsterdam',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 50)}`,
        description: getRandomArrayElement(DESCRIPTION),
      },
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 50)}`,
        description: getRandomArrayElement(DESCRIPTION),
      },
    ]
  },
  {
    id: '13',
    description: getRandomArrayElement(DESCRIPTION),
    name: 'Tokyo',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 50)}`,
        description: getRandomArrayElement(DESCRIPTION),
      }
    ]
  },
  {
    id: '14',
    description: getRandomArrayElement(DESCRIPTION),
    name: 'Oslo',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 50)}`,
        description: getRandomArrayElement(DESCRIPTION),
      },
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 50)}`,
        description: getRandomArrayElement(DESCRIPTION),
      }
    ]
  }
];

export {mockDestinations};
