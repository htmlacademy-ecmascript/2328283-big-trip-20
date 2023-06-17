import ApiService from '../framework/api-service.js';

import { HTTPMethod } from '../const.js';

export default class ServerDataApiService extends ApiService {
  async getDestinations() {
    const response = await this._load({ url: 'destinations' });
    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedDestinations = this.#adaptServerDestinationsToClient(parsedResponse);

    return adaptedDestinations;
  }

  async getOfferTypes() {
    const response = await this._load({ url: 'offers' });
    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedDestinations = this.#adaptServerOfferTypesToClient(parsedResponse);

    return adaptedDestinations;
  }

  async getEvents() {
    const response = await this._load({ url: 'points' });
    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedEvents = parsedResponse.map(this.#adaptServerEventToClient);

    return adaptedEvents;
  }

  async addEvent(event) {
    const response = await this._load({
      url: 'points',
      method: HTTPMethod.POST,
      body: JSON.stringify(this.#adaptClientEventToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedEvent = this.#adaptServerEventToClient(parsedResponse);

    return adaptedEvent;
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `points/${event.id}`,
      method: HTTPMethod.PUT,
      body: JSON.stringify(this.#adaptClientEventToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
    const parsedResponse = await ApiService.parseResponse(response);
    const adaptedEvent = this.#adaptServerEventToClient(parsedResponse);

    return adaptedEvent;
  }

  async deleteEvent(event) {
    const response = await this._load({
      url: `points/${event.id}`,
      method: HTTPMethod.DELETE
    });

    return response;
  }

  #adaptServerEventToClient(event) {
    const adaptedEvent = {
      ...event,
      basePrice: event['base_price'],
      dateFrom: new Date(event['date_from']),
      dateTo: new Date(event['date_to']),
      isFavorite: event['is_favorite']
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }

  #adaptClientEventToServer(event) {
    const adaptedEvent = {
      ...event,
      'base_price': event['basePrice'],
      'date_from': event['dateFrom'].toISOString(),
      'date_to': event['dateTo'].toISOString(),
      'is_favorite': event['isFavorite']
    };

    delete adaptedEvent['basePrice'];
    delete adaptedEvent['dateFrom'];
    delete adaptedEvent['dateTo'];
    delete adaptedEvent['isFavorite'];

    return adaptedEvent;
  }

  #adaptServerDestinationsToClient(parsedResponse) {
    return new Map(parsedResponse.map((item) => [item.id, item]));
  }

  #adaptServerOfferTypesToClient(parsedResponse) {
    return new Map(parsedResponse.map((item) => [item.type, item]));
  }
}
