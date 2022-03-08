import short from './short.js';
import { Options } from '../types.js';

export default function getFormatter(format: Options['format']) {
  switch (format) {
    case 'short':
    default:
      return short;
  }
}
