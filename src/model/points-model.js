import { getPoint } from '../mocks/points';

const POINTS_COUNT = 5;

export default class PointsModel {
  #points = Array.from({length: POINTS_COUNT}, getPoint);

  get points() {
    return this.#points;
  }
}
