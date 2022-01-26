console.log('printing');
const objectsToCsv = require('objects-to-csv');
const data = require('./wordlist.json');

(async () => {
  const vals = data.words.map((ele, index) => ({
    id: index + 1,
    word: ele,
    frequency: 0,
    alreadyUsedAsWordle: 0,
  }));

  await new objectsToCsv(vals).toDisk('../data/words.csv');
})();
