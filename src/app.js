const searchClient = algoliasearch(
  ALGOLIA_KEY,
  ALGOLIA_SECRET
);

const index = searchClient.initIndex('mtg-search');

function hitTemplate(hit) {
  const {
    flavor_text,
    image_uris,
    mana_cost,
    name,
    oracle_text,
    rarity,
    type_line,
  } = hit;

  // Hash table to convert special mana values -> icons 
  const converter = {
    '{1}': '[',
    '{2}': '\\',
    '{3}': ']',
    '{4}': '^',
    '{5}': '_',
    '{6}': '`',
    '{7}': '{',
    '{8}': '|',
    '{9}': '}',
    '{0}': '~',
    '{R}': '<',
    '{G}': '>',
    '{B}': '=',
    '{U}': '+',
    '{W}': '@',
  };

  // Converts into icons by finding all instances of {.} and splitting there; includes {}
  const convertedIcons = text => {
    return text
      .split(/(?<={.})/g)
      .map(letter => {
        // If the split portion does not include {.}, then it is not a special character; 
        if (!letter.includes('{')) return letter;
        return (letter = converter[letter]);
      })
      .join('');
  };

  return `
    <div class="hit">
      <div class="hit-content">
        <div class="hit-title">
          <h2 class="hit-name">${name}</h2>
          <div class="hit-type">${type_line}</div>
          <div class="img-container">
            <img class="hit-image" src="${image_uris.art_crop}" />
          </div>
        </div>
        <div class="hit-rarity">${rarity.charAt(0).toUpperCase() +
          rarity.slice(1)}
          <span class="hit-mana">${convertedIcons(mana_cost)}</span>
        </div>
        <div class="hit-text">
          <div class=${
            oracle_text ? 'hit-description' : 'invisible'
          }>${oracle_text}</div>
           <div class=${
             flavor_text ? 'hit-flavor-text' : 'invisible'
           }>${flavor_text}</div>
           <span class=${hit.power ? 'hit-stats' : 'invisible'}>${hit.power}/${
    hit.toughness
  }</span>
        </div>
      </div>
    </div>
  `;
}

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
