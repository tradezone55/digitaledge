const fs = require('fs');
const original = JSON.parse(fs.readFileSync('src/i18n/locales/en/questions.json'));
const additions = JSON.parse(fs.readFileSync('additions.json'));

original.domains['1'] = [...original.domains['1'], ...additions.domain1];
original.domains['2'] = [...original.domains['2'], ...additions.domain2];
original.domains['3'] = [...original.domains['3'], ...additions.domain3];
original.domains['4'] = [...original.domains['4'], ...additions.domain4];
original.domains['5'] = [...original.domains['5'], ...additions.domain5];

Object.keys(original.domains).forEach(d => {
  console.log('Domain ' + d + ': ' + original.domains[d].length + ' questions');
});

fs.writeFileSync('src/i18n/locales/en/questions.json', JSON.stringify(original, null, 2));
console.log('Done! questions.json updated.');