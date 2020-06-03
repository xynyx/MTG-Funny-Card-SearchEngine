/* global algoliasearch instantsearch */
import algoliasearch from 'algoliasearch';
import { hitTemplate } from './helpers';

const searchClient = algoliasearch(
  'HXQNTP2IKE',
  '947938c04243eedbd06b7667a81fb100'
);

const index = searchClient.initIndex('mtg-search');
const cards = require('../StandardPrintings.json');
const ELDCards = cards[0].ELD.cards;

console.log(ELDCards);

index.setSettings({
  // Select the attributes you want to search in
  searchableAttributes: ['colors', 'convertedManaCost', 'name', 'power'],
  customRanking: ['asc(name)'],
  attributeForDistinct: "name",
  distinct: 1,
  // Set up some attributes to filter results on
  attributesForFaceting: ['name', 'colors'],
});

index
  .saveObjects(ELDCards, {
    autoGenerateObjectIDIfNotExist: true,
  })
  .then(({ objectIDs }) => {
    // console.log(objectIDs);
  });

const search = instantsearch({
  indexName: 'mtg-search',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: 'Search for Cards',
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.addWidget(
  instantsearch.widgets.hits({
    container: '#hits',
    hitsPerPage: 10,
    templates: {
      item: function(hit) {
        return hitTemplate(hit);
      },
    },
  })
);

index.clearObjects()


search.start();
