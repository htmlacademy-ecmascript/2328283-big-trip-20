export default class OfferTypesModel {
  #offerTypes = [];
  #serverDataApiService = null;

  constructor({ serverDataApiService }) {
    this.#serverDataApiService = serverDataApiService;
  }

  get offerTypes() {
    return this.#offerTypes;
  }

  async init() {
    try {
      this.#offerTypes = await this.#serverDataApiService.getOfferTypes();
    } catch {
      throw new Error('Can\'t load offer types data from server!');
    }
  }
}
