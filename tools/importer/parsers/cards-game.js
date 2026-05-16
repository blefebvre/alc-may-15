/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-game variant.
 * Base block: cards
 * Source: https://www.alc.ca/content/alc/en.html
 * Selector: .featured-games .game-tiles
 * Generated: 2026-05-15
 *
 * Extracts game tiles from the featured games grid. Each tile becomes one row
 * in the cards block: column 1 = game image, column 2 = game name heading +
 * description + optional draw date + optional prize amount + CTA link.
 *
 * Handles variations:
 * - Lottery games with jackpot overlays and draw dates (LOTTO MAX, LOTTO 649)
 * - Instant/casino games without jackpot info (Scratch'N Win, Power Crush, etc.)
 * - Optional "NEW" flag badge on image container
 * - Optional "Read more" inline link within description
 */
export default function parse(element, { document }) {
  // Select all game tile articles within the container
  const tiles = element.querySelectorAll(':scope .game-tile.parbase article.game-tile, :scope article.game-tile');

  const cells = [];

  tiles.forEach((tile) => {
    // --- Column 1: Game image ---
    // On the live site, game images are CSS background-image on .game-tile-image-container,
    // not <img> elements. Extract the URL from the inline style and create an <img> element.
    // Fallback: also check for a direct <img> child in case the markup changes.
    const imageContainer = tile.querySelector('.game-tile-image-container');
    let gameImage = null;
    if (imageContainer) {
      // First try: extract background-image URL from inline style
      const bgStyle = imageContainer.style.backgroundImage
        || (imageContainer.getAttribute('style') || '').match(/background-image:\s*url\(["']?([^"')]+)["']?\)/)?.[0];
      const bgMatch = (imageContainer.getAttribute('style') || '').match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
      if (bgMatch && bgMatch[1]) {
        gameImage = document.createElement('img');
        gameImage.src = bgMatch[1];
        // Use game title from heading as alt text
        const headingEl = tile.querySelector('.game-tile-content h1, .game-tile-content h2');
        gameImage.alt = headingEl ? headingEl.textContent.trim() : '';
      }
      // Fallback: direct <img> child (cached source HTML uses <img> elements)
      if (!gameImage) {
        gameImage = imageContainer.querySelector(':scope > img')
          || imageContainer.querySelector(':scope > picture');
      }
    }

    // --- Column 2: Text content ---
    const contentContainer = tile.querySelector('.game-tile-content');
    const contentParts = [];

    if (contentContainer) {
      // Game name heading (h1 in source)
      const heading = contentContainer.querySelector('h1, h2, h3');
      if (heading) contentParts.push(heading);

      // Description paragraph
      const description = contentContainer.querySelector('.game-tile-description p');
      if (description) contentParts.push(description);

      // Next draw date (lottery games only)
      const drawDate = contentContainer.querySelector('.next-jackpot-date');
      if (drawDate && drawDate.textContent.trim()) contentParts.push(drawDate);

      // Prize amount (lottery games: .next-jackpot-prize; other games: .prize-info may be empty)
      const prize = contentContainer.querySelector('.next-jackpot-prize');
      if (prize && prize.textContent.trim()) contentParts.push(prize);

      // CTA button link
      const cta = contentContainer.querySelector('a.button, a.arrow-button');
      if (cta) contentParts.push(cta);
    }

    // Build the row: [image cell, content cell]
    const imageCell = gameImage ? [gameImage] : [];
    cells.push([imageCell, contentParts]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-game', cells });
  element.replaceWith(block);
}
