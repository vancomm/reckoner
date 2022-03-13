import path from 'path';
import yaml from 'js-yaml';
import { fromHTML } from './html.js';

function getParser(filepath: string) {
  const ext = path.extname(filepath);

  switch (ext) {
    case '.json':
      return JSON.parse;
    case '.yaml':
    case '.yml':
      return yaml.load;
    case '.html':
      return fromHTML;
    default:
      return (raw: string) => raw;
  }
};

export default getParser;
