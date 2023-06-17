import Observable from '../framework/observable.js';

import { UpdateType } from '../const.js';

export default class EventsModel extends Observable {
  #serverDataApiService = null;
  #events = [];

  constructor({ serverDataApiService }) {
    super();
    this.#serverDataApiService = serverDataApiService;
  }

  get events() {
    return this.#events;
  }

  async init() {
    try {
      this.#events = await this.#serverDataApiService.getEvents();
    } catch {
      throw new Error('Can\'t load events data from server!');
    }

    this._notify(UpdateType.INIT);
  }

  async addEvent(updateType, event) {
    const addedEvent = await this.#serverDataApiService.addEvent(event);
    this.#events = [addedEvent, ...this.#events];
    this._notify(updateType);
  }

  async updateEvent(updateType, event) {
    const updatedEvent = await this.#serverDataApiService.updateEvent(event);
    const updatedEventIndex = this.#events.findIndex((eventItem) => eventItem.id === updatedEvent.id);
    this.#events = this.#events.map((eventItem, index) => index === updatedEventIndex ? updatedEvent : eventItem);
    this._notify(updateType, updatedEvent);
  }

  async deleteEvent(updateType, event) {
    await this.#serverDataApiService.deleteEvent(event);
    this.#events = this.#events.filter((eventItem) => eventItem.id !== event.id);
    this._notify(updateType);
  }
}
