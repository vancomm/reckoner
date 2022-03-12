import short from './short.js';
import { AssignedItem, Options } from '../types.js';

export default function getFormatter(format: Options['format']): (items: AssignedItem[]) => string {
  switch (format) {
    case 'short':
    default:
      return short;
  }
}
