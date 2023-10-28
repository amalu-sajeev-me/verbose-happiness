import bodyParser, {OptionsJson, OptionsUrlencoded} from 'body-parser';

const urlOptions: OptionsUrlencoded = {
    extended: true
};
const jsonOptions: OptionsJson = {}; 

export const bodyParserMiddlewares = [
    bodyParser.urlencoded(urlOptions),
    bodyParser.json(jsonOptions)
]