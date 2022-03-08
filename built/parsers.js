import path from 'path';
import yaml from 'js-yaml';
const fromJSON = JSON.parse;
const fromYAML = yaml.load;
const getParser = (filepath) => {
    const ext = path.extname(filepath);
    if (ext === '.json') {
        return fromJSON;
    }
    if (ext === '.yaml' || ext === '.yml') {
        return fromYAML;
    }
    return fromJSON;
};
export default getParser;
