/* global algoliasearch instantsearch */

const searchClient = algoliasearch(
  'HXQNTP2IKE',
  '6ae68d922f42d63bd999c60ba6201754'
);

const search = instantsearch({
  indexName: 'mtg-search',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();
