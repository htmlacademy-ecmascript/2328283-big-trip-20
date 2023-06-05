import { OFFERS, EVENTS } from '../const.js';
import { getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import { nanoid } from 'nanoid';

const MAX_OFFERS = 5;

const createOfferDescription = () => ({
  id: nanoid(),
  title: getRandomArrayElement(OFFERS),
  price: getRandomInteger(10, 500)
});

const createOffersbyType = (type) => {

  const offerByType = {
    type: type,
    offers: Array.from({length: getRandomInteger(1, MAX_OFFERS)}, createOfferDescription)
  };

  return offerByType;
};

const getOffers = () => {
  const offers = [];
  for (let i = 0; i < EVENTS.length; i++) {
    offers[i] = createOffersbyType(EVENTS[i]);
  }
  return offers;
};

const allOffers = getOffers();

const getOffersIds = (type) => {
  const offersId = [];
  allOffers.forEach((offer) => {
    if (offer.type === type) {
      offer.offers.forEach((element) => offersId.push(element.id));
    }
  });
  return offersId;
};

const getOfferById = (id) => {
  let offerItem;
  allOffers.forEach((offer) => {
    offer.offers.forEach((item) => {
      if (item.id === id) {
        offerItem = item;
      }
    });
  });
  return offerItem;
};

const getAllOffersByType = (type) => {
  let offersByType = [];
  allOffers.forEach((offer) => {
    if (offer.type === type) {

      offersByType = offer.offers;
    }
  });
  return offersByType;
};


export { getOffersIds, getOfferById, getAllOffersByType };
