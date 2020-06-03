export function hitTemplate(hit) {
  return `
    <div class="hit">
      <div class="hit-image">
        <img />
      </div>
      <div class="hit-content">
        <div>
          <div class="hit-name">${hit.name}</div>
          <div class="hit-description"></div>
        </div>
        <div class="hit-power">${hit.power}</div>
      </div>
    </div>
  `;
}