import { nanoid } from 'nanoid';

const generateAuthToken = () => `Basic ${nanoid()}`;

export { generateAuthToken };
