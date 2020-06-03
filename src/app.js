/* global algoliasearch instantsearch */
import algoliasearch from 'algoliasearch';
import { hitTemplate } from "./helpers";


const searchClient = algoliasearch(
  'HXQNTP2IKE',
  '947938c04243eedbd06b7667a81fb100'
);

const index = searchClient.initIndex('mtg-search');
const cards = require("../StandardPrintings.json");
const ELDCards = cards[0].ELD.cards;

// index.setSettings({
//   // Select the attributes you want to search in
//   searchableAttributes: [
//     'colors', 'convertedManaCost', 'name', 'power'
//   ],
//   // Define business metrics for ranking and sorting
//   // customRanking: [
//   //   'desc(popularity)'
//   // ],
//   // Set up some attributes to filter results on
//   attributesForFaceting: [
//     'name', 'colors'
//   ]
// });


index.saveObjects(ELDCards, {
  autoGenerateObjectIDIfNotExist: true
}).then(({objectIDs}) => {
  console.log(objectIDs);
});


const search = instantsearch({
  indexName: 'mtg-search',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: "Search for Cards"
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    hitsPerPage: 10,
    templates: {
      item: function(hit) {
        return hitTemplate(hit);
      }
    },

  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
