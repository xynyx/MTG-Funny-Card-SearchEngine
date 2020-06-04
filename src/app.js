/* global algoliasearch instantsearch */
import algoliasearch from 'algoliasearch';
import { hitTemplate } from './helpers';

const searchClient = algoliasearch(
  'HXQNTP2IKE',
  '947938c04243eedbd06b7667a81fb100'
);

const index = searchClient.initIndex('mtg-search');
// const cards = require('../StandardPrintings.json');
// const ELDCards = cards[0].ELD.cards;


index.setSettings({
  // Select the attributes you want to search in
  searchableAttributes: [
    'colors',
    'convertedManaCost',
    'name',
    'power',
    'type',
  ],
  customRanking: ['asc(name)'],
  attributeForDistinct: 'name',
  distinct: 1,
  // Set up some attributes to filter results on
  // attributesForFaceting: ['name', 'colors'],
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

// const encoded = encodeURIComponent("https://api.scryfall.com/cards/search?q=is:funny");

Promise.all([
  fetch(`https://api.scryfall.com/cards/search?q=is:funny`)
    .then(card => {
      // console.log('card :>> ', card);
      return card.json();
    })
    .then(body => {
      // console.log('body :>> ', body);
      return body.data;
    }),
  fetch(
    `https://api.scryfall.com/cards/search?format=json&include_extras=true&include_multilingual=false&order=name&page=2&q=is%3Afunny&unique=cards`
  )
    .then(card => {
      // console.log('card2 :>> ', card);
      return card.json();
    })
    .then(body => {
      // console.log('body2 :>> ', body);
      return body.data;
    }),
  fetch(
    `https://api.scryfall.com/cards/search?format=json&include_extras=true&include_multilingual=false&order=name&page=3&q=is%3Afunny&unique=cards`
  )
    .then(card => {
      // console.log('card2 :>> ', card);
      return card.json();
    })
    .then(body => {
      // console.log('body2 :>> ', body);
      return body.data;
    }),
]).then(cards => {
  const combinedCards = cards.flat();
  console.log('cards :>> ', combinedCards);
  return index.saveObjects(combinedCards, {
    autoGenerateObjectIDIfNotExist: true,
  })

});

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

// index.clearObjects();

search.start();

/* art_crop */
//

/* Scryfall produces multiple sizes of images and image crops for each Card object. Links to these images are available in each Card objects’ image_uris properties. */
