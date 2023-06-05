import {mockOffers} from './offers';
import {mockDestinations} from './destination.js';
import {getRandomArrayElement, getRandomNumber} from '../utils/util.js';
import {TYPES} from '../const.js';

const mockPoints = [
  {
    id: '1',
    price: getRandomNumber(50, 500),
    type: getRandomArrayElement(TYPES),
    dateFrom: '2023-04-24T18:25',
    dateTo: '2023-04-24T22:36',
    destination: mockDestinations.find((value) => value.id === '10'),
    isFavorite: false,
    isOffer: {
      20: false,
      21: false,
      22: true,
      23: false,
      24: true,
      25: true
    },
    offers: [
      mockOffers.find((value) => value.id === '22'),
      mockOffers.find((value) => value.id === '24'),
      mockOffers.find((value) => value.id === '25'),
    ]
  },
  {
    id: '2',
    price: getRandomNumber(50, 500),
    type: getRandomArrayElement(TYPES),
    dateFrom: '2023-04-26T22:55',
    dateTo: '2023-04-27T02:18',
    destination: mockDestinations.find((value) => value.id === '14'),
    isFavorite: true,
    isOffer: {
      20: false,
      21: true,
      22: false,
      23: false,
      24: false,
      25: false
    },
    offers: [
      mockOffers.find((value) => value.id === '21')
    ]
  },
  {
    id: '3',
    price: getRandomNumber(50, 500),
    type: getRandomArrayElement(TYPES),
    dateFrom: '2023-05-03T04:28',
    dateTo: '2023-05-03T08:52',
    destination: mockDestinations.find((value) => value.id === '10'),
    isFavorite: false,
    isOffer: {
      20: false,
      21: true,
      22: false,
      23: false,
      24: true,
      25: true
    },
    offers: [
      mockOffers.find((value) => value.id === '21'),
      mockOffers.find((value) => value.id === '24'),
      mockOffers.find((value) => value.id === '25')
    ]
  },
  {
    id: '4',
    price: getRandomNumber(50, 500),
    type: getRandomArrayElement(TYPES),
    dateFrom: '2023-05-04T17:31',
    dateTo: '2023-05-04T21:43',
    destination: mockDestinations.find((value) => value.id === '12'),
    isFavorite: false,
    isOffer: {
      20: true,
      21: false,
      22: false,
      23: true,
      24: false,
      25: false
    },
    offers: [
      mockOffers.find((value) => value.id === '20'),
      mockOffers.find((value) => value.id === '23')
    ]
  },
  {
    id: '5',
    price: getRandomNumber(50, 500),
    type: getRandomArrayElement(TYPES),
    dateFrom: '2023-05-06T23:14',
    dateTo: '2023-05-07T05:17',
    destination: mockDestinations.find((value) => value.id === '11'),
    isFavorite: true,
    isOffer: {
      20: false,
      21: true,
      22: true,
      23: false,
      24: false,
      25: true
    },
    offers: [
      mockOffers.find((value) => value.id === '21'),
      mockOffers.find((value) => value.id === '22'),
      mockOffers.find((value) => value.id === '25')
    ]
  },
  {
    id: '6',
    price: getRandomNumber(50, 500),
    type: getRandomArrayElement(TYPES),
    dateFrom: '2023-05-10T14:38',
    dateTo: '2023-05-10T19:20',
    destination: mockDestinations.find((value) => value.id === '13'),
    isFavorite: true,
    isOffer: {
      20: true,
      21: false,
      22: false,
      23: false,
      24: true,
      25: false
    },
    offers: [
      mockOffers.find((value) => value.id === '20'),
      mockOffers.find((value) => value.id === '24')
    ]
  },
  {
    id: '7',
    price: getRandomNumber(50, 500),
    type: getRandomArrayElement(TYPES),
    dateFrom: '2023-05-12T13:41',
    dateTo: '2023-05-12T16:05',
    destination: mockDestinations.find((value) => value.id === '10'),
    isFavorite: true,
    isOffer: {
      20: false,
      21: false,
      22: true,
      23: false,
      24: false,
      25: false
    },
    offers: [
      mockOffers.find((value) => value.id === '22')
    ]
  },
  {
    id: '8',
    price: getRandomNumber(50, 500),
    type: getRandomArrayElement(TYPES),
    dateFrom: '2023-05-15T18:34',
    dateTo: '2023-05-15T21:09',
    destination: mockDestinations.find((value) => value.id === '14'),
    isFavorite: false,
    isOffer: {
      20: false,
      21: false,
      22: true,
      23: true,
      24: false,
      25: false
    },
    offers: [
      mockOffers.find((value) => value.id === '22'),
      mockOffers.find((value) => value.id === '23')
    ]
  },
  {
    id: '9',
    price: getRandomNumber(50, 500),
    type: getRandomArrayElement(TYPES),
    dateFrom: '2023-05-16T08:55',
    dateTo: '2023-05-16T11:39',
    destination: mockDestinations.find((value) => value.id === '12'),
    isFavorite: false,
    isOffer: {
      20: true,
      21: true,
      22: false,
      23: false,
      24: false,
      25: true
    },
    offers: [
      mockOffers.find((value) => value.id === '20'),
      mockOffers.find((value) => value.id === '21'),
      mockOffers.find((value) => value.id === '25')
    ]
  },
  {
    id: '10',
    price: getRandomNumber(50, 500),
    type: getRandomArrayElement(TYPES),
    destination: mockDestinations.find((value) => value.id === '10'),
    dateFrom: '2023-05-21T22:51',
    dateTo: '2023-05-22T03:47',
    isFavorite: false,
    isOffer: {
      20: false,
      21: false,
      22: false,
      23: false,
      24: true,
      25: false
    },
    offers: [
      mockOffers.find((value) => value.id === '24')
    ]
  }
];

const getRandomRoutPoint = () => getRandomArrayElement(mockPoints);

export {getRandomRoutPoint};
