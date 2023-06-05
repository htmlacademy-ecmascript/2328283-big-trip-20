import {getRandomNumber} from '../utils/util.js';

const mockOffers = [
  {
    id: '20',
    type: 'taxi',
    title: 'Order Uber',
    price: getRandomNumber(100, 1000)
  },
  {
    id: '21',
    type: 'bus',
    title: 'Add luggage',
    price: getRandomNumber(100, 1000)
  },
  {
    id: '22',
    type: 'train',
    title: 'Choose seats',
    price: getRandomNumber(100, 1000)
  },
  {
    id: '23',
    type: 'drive',
    title: 'Rent a car',
    price: getRandomNumber(100, 1000)
  },
  {
    id: '24',
    type: 'check-in',
    title: 'Add a branch',
    price: getRandomNumber(100, 1000)
  },
  {
    id: '25',
    type: 'train',
    title: 'Travel by train',
    price: getRandomNumber(100, 1000)
  }
];

export {mockOffers};
