
import algoliasearch from '../node_modules/algoliasearch';
const index = searchClient.initIndex('mtg-search');
const searchClient = algoliasearch(
  'HXQNTP2IKE',
  '947938c04243eedbd06b7667a81fb100'
);

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
  return index.saveObjects(combinedCards, {
    autoGenerateObjectIDIfNotExist: true,
  });
});
