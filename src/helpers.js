export function hitTemplate(hit) {
  const {
    color_identity,
    flavor_text,
    image_uris,
    mana_cost,
    name,
    oracle_text,
    rarity,
    type_line,
  } = hit;

  let finalMana = '';
  let colorArr = [];
  const manaWithoutBrackets = mana_cost.replace(/{|}/g, '');
  // console.log('manaWithoutBrackets.slice(0, 1) :>> ', manaWithoutBrackets.slice(0, 1));
  const number = manaWithoutBrackets.slice(0, 1);
  const colors = manaWithoutBrackets.substring(1).split('');
  colors.forEach(color => colorArr.push(color));
  console.log('colors :>> ', colorArr);
  // const formatManaNumber = () => {
  //   // if (manaWithoutBrackets.length === 1) return finalMana = manaWithoutBrackets;
  // };

  // If first char is a letter, then there is no generic mana cost ->

  const formatManaColors = () => {
    manaWithoutBrackets.substring(1);
  };

  // console.log('formatMana :>> ', formatManaNumber());
  // console.log('finalMana :>> ', finalMana);
  // console.log('formatManaColors() :>> ', formatManaColors());

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
           <div class="hit-rarity">${rarity.charAt(0).toUpperCase() + rarity.slice(1)}          <span class="hit-mana">${mana_cost}
           </span></div>
           <div class="hit-text">
           <div class="hit-description">${oracle_text}</div>
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

/*        <div class="hit-type">${rarity}</div> */

// <div class="hit-color">${color_identity}</div>
/*  */
