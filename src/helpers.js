export function hitTemplate(hit) {
  const { color_identity, flavor_text, image_uris, mana_cost, name, oracle_text, rarity, type_line } = hit;
  return `
    <div class="hit">
      <div class="hit-content">
        <div class="hit-title">
          <h2 class="hit-name">${name}</h2>
          <span class=${mana_cost? "hit-mana" : "invisible" }>${mana_cost}</span>
          <div class="hit-type">${type_line}</div>
   

        </div>
        <div class="img-container">
          <img class="hit-image" src="${image_uris.art_crop}" />
        </div>
        <div class="hit-description">${oracle_text}</div>
        <div class="hit-color">${color_identity}</div>
        <span class=${hit.power? "hit-stats" : "invisible" }>${hit.power}/${hit.toughness}</span>
      </div>
    </div>
  `;
}

/*        <div class="hit-type">${rarity}</div> */