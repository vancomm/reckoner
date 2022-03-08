import short from './short.js';

export default function getFormatter(format) {
  switch (format) {
    case 'short':
    default:
      return short;
  }
}
