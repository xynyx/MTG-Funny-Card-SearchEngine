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
    // 'colors',
    'name',
    // 'power',
    // 'type',
    // 'rarity',
  ],
  customRanking: ['asc(name)'],
  attributesForFaceting: ['colors', 'rarity', 'type_line', 'set_name'],
  // Set up some attributes to filter results on
  // attributesForFaceting: ['name', 'colors'],
});

// API only allows you to fetch 175 cards at a time - use Promise.all and combine to get all 650 cards
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
  console.log('combinedCards :>> ', combinedCards);
  index.clearObjects();
  return index.saveObjects(combinedCards, {
    autoGenerateObjectIDIfNotExist: true,
  });
});

// const records = fetchData.then(cards => (cards)).then(card => card)

// .then(cards => {
//   const combinedCards = cards.flat();
//   return index.saveObjects(combinedCards, {
//     autoGenerateObjectIDIfNotExist: true,
//   });

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

search.addWidgets([
  instantsearch.widgets.hits({
    container: '#hits',
    hitsPerPage: 10,
    templates: {
      item: function(hit) {
        return hitTemplate(hit);
      },
    },
  }),
  instantsearch.widgets.refinementList({
    container: '#rarity',
    attribute: 'rarity',
    autoHideContainer: false,
    templates: {
      header: 'Categories',
    }
  }),
  instantsearch.widgets.refinementList({
    container: '#colors',
    attribute: 'colors',
    autoHideContainer: false,
    templates: {
      header: 'Colors',
    }
  }),
  instantsearch.widgets.refinementList({
    container: '#type',
    attribute: 'type_line',
    autoHideContainer: false,
    templates: {
      header: 'Type',
    }
  }),
  instantsearch.widgets.refinementList({
    container: '#set',
    attribute: 'set_name',
    autoHideContainer: false,
    templates: {
      header: 'Set',
    }
  })
]);

search.start();
