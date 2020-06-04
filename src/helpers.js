export function hitTemplate(hit) {
  const { color_identity, flavor_text, image_uris, mana_cost, name, oracle_text, rarity } = hit;
  console.log('image_uris.art_crop :>> ', image_uris.art_crop);
  console.log('mana_cost :>> ', mana_cost);
  return `
    <div class="hit">
      <div class="hit-content">
        <div class="hit-title">
          <h2 class="hit-name">${name}</h2>
          <span class=${mana_cost? "hit-mana" : "invisible" }>${mana_cost}</span>
          <div class="hit-type">${rarity}</div>
        </div>
        <div >
          <img class="hit-image" src="${image_uris.art_crop}" />
        </div>
        <div class="hit-description">${oracle_text}</div>
        <div class="hit-color">${color_identity}</div>
        <span class=${hit.power? "hit-stats" : "invisible" }>${hit.power}/${hit.toughness}</span>
      </div>
    </div>
  `;
}



/*       // <div class="hit-image">
      //   <img />
      // </div> */