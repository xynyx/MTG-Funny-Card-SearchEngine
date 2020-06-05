/* global algoliasearch instantsearch */
import algoliasearch from 'algoliasearch';
import { hitTemplate } from './helpers';

const searchClient = algoliasearch(
  'HXQNTP2IKE',
  '947938c04243eedbd06b7667a81fb100'
);

const index = searchClient.initIndex('mtg-search');

index.setSettings({
  // Select the attributes you want to search in
  searchableAttributes: ['name'],
  // Sort by name
  customRanking: ['asc(name)'],
  attributesForFaceting: ['colors', 'rarity', 'type_line', 'set_name'],
});

// API only allows you to fetch 175 cards at a time - use Promise.all and combine to get all 604 cards
Promise.all([
  fetch(`https://api.scryfall.com/cards/search?q=is:funny`)
    .then(card => {
      // Must return json first; data not retrievable immediately
      return card.json();
    })
    .then(body => {
      return body.data;
    }),
  fetch(
    `https://api.scryfall.com/cards/search?format=json&include_extras=true&include_multilingual=false&order=name&page=2&q=is%3Afunny&unique=cards`
  )
    .then(card => {
      return card.json();
    })
    .then(body => {
      return body.data;
    }),
  fetch(
    `https://api.scryfall.com/cards/search?format=json&include_extras=true&include_multilingual=false&order=name&page=3&q=is%3Afunny&unique=cards`
  )
    .then(card => {
      return card.json();
    })
    .then(body => {
      return body.data;
    }),
  fetch(
    `https://api.scryfall.com/cards/search?format=json&include_extras=true&include_multilingual=false&order=name&page=4&q=is%3Afunny&unique=cards`
  )
    .then(card => {
      return card.json();
    })
    .then(body => {
      return body.data;
    }),
]).then(cards => {
  const combinedCards = cards.flat();
  index.clearObjects();
  return index.saveObjects(combinedCards, {
    autoGenerateObjectIDIfNotExist: true,
  });
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
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
    templates: {
      resetLabel: 'Clear Filters',
    },
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    hitsPerPage: 10,
    templates: {
      item: function(hit) {
        return hitTemplate(hit);
      },
    },
  }),
  // Filters
  instantsearch.widgets.refinementList({
    container: '#rarity',
    attribute: 'rarity',
    autoHideContainer: false,
  }),
  instantsearch.widgets.refinementList({
    container: '#colors',
    attribute: 'colors',
    autoHideContainer: false,
  }),
  instantsearch.widgets.refinementList({
    container: '#type',
    attribute: 'type_line',
    autoHideContainer: false,
    sortBy: ['name:asc'],
  }),
  instantsearch.widgets.refinementList({
    container: '#set',
    attribute: 'set_name',
    autoHideContainer: false,
    sortBy: ['name:asc'],
  }),
  // Stats (page loading speed / how many items)
  instantsearch.widgets.stats({
    container: '#stats',
    templates: {
      text: `
        {{#hasNoResults}}No results{{/hasNoResults}}
        {{#hasOneResult}}1 result{{/hasOneResult}}
        {{#hasManyResults}}{{#helpers.formatNumber}}{{nbHits}}{{/helpers.formatNumber}} results{{/hasManyResults}}
        found in {{processingTimeMS}}ms
      `,
    },
  }),
  // Adjust hits/page
  instantsearch.widgets.hitsPerPage({
    container: '#hits-per-page',
    items: [
      { label: '12 cards per page', value: 12, default: true },
      { label: '24 cards per page', value: 24 },
      { label: '36 cards per page', value: 36 },
    ],
  }),
]);

search.start();
