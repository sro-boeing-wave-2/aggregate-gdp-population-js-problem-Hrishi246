/**
* Aggregates GDP and Population Data by Continents
* @param {*} filePath
*/
const fs = require('fs');

const reader = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      resolve(data);
      reject(err);
    });
  });
};

const writer = (filepath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, JSON.stringify(data), function (err) {
      if (err) reject('error');
      else resolve('success');
    });
  });
};

const aggregate = (filepath) => {
  Promise.all([reader(filepath), reader('mapping.json')]).then((values) => {
    const [header, ...rows] = values[0].replace(/"/g, '').split('\n');
    const jsonMapping = JSON.parse(values[1]);
    const countryNameIndex = header.split(',').indexOf('Country Name');
    const populationIndex = header.split(',').indexOf('Population (Millions) - 2012');
    const gdpIndex = header.split(',').indexOf('GDP Billions (US Dollar) - 2012');
    const outputString = {};
    rows.forEach((row) => {
      const country = row.split(',')[countryNameIndex];
      if (outputString[jsonMapping[country]] === undefined) {
        outputString[jsonMapping[country]] = {};
        outputString[jsonMapping[country]]['POPULATION_2012'] = parseFloat(row.split(',')[populationIndex]);
        outputString[jsonMapping[country]]['GDP_2012'] = parseFloat(row.split(',')[gdpIndex]);
      } else {
        outputString[jsonMapping[country]]['POPULATION_2012'] += parseFloat(row.split(',')[populationIndex]);
        outputString[jsonMapping[country]]['GDP_2012'] += parseFloat(row.split(',')[gdpIndex]);
      }
    });
    delete outputString[undefined];
    writer('output/output.json', outputString);
  });
};
aggregate('data/datafile.csv');
module.exports = aggregate;
