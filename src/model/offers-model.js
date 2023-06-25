export default class OfferModel {

  #service = null;
  #offers = [];

  constructor(service) {
    this.#service = service;
  }

  async init() {
    this.#offers = await this.#service.getOffers();
    return this.#offers;
  }

  get() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers.find((offer) => offer.type === type).offers;
  }
}
