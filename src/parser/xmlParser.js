// XmlParser.js
const xml2js = require('xml2js');

function parseXMLToJSON(xml) {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    parser.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export { parseXMLToJSON };
