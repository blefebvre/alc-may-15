/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-winners
 * Base block: carousel
 * Source: https://www.alc.ca/content/alc/en.html
 * Selector: section.winners-carousel .winners-carousel-slides
 *
 * Extracts winner slides from a Slick carousel. Each slide becomes one row
 * in a 2-column carousel block table:
 *   Column 1: winner photo (from background-image on .winner-image)
 *   Column 2: winner name (h3), location, game logo, prize amount, CTA link
 *
 * Skips .slick-cloned slides to avoid duplicate rows.
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned) .slide');

  const cells = [];

  slides.forEach((slide) => {
    // Column 1: winner photo from background-image
    const col1 = [];
    const winnerImage = slide.querySelector('.winner-image');
    if (winnerImage) {
      const style = winnerImage.getAttribute('style') || '';
      const match = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
      if (match) {
        const img = document.createElement('img');
        img.src = match[1];
        img.alt = '';
        col1.push(img);
      }
    }

    // Column 2: winner details
    const col2 = [];

    const winnerName = slide.querySelector('.winner-info h1');
    if (winnerName) {
      const h3 = document.createElement('h3');
      h3.textContent = winnerName.textContent.trim();
      col2.push(h3);
    }

    const location = slide.querySelector('.winner-info h2');
    if (location) {
      const p = document.createElement('p');
      p.textContent = location.textContent.trim();
      col2.push(p);
    }

    const gameLogo = slide.querySelector('.prize-details img.winning-game-logo');
    if (gameLogo) {
      col2.push(gameLogo);
    }

    const prizeAmountEl = slide.querySelector('.prize-details .prize-amount');
    if (prizeAmountEl) {
      const spans = prizeAmountEl.querySelectorAll('span');
      if (spans.length > 0) {
        const parts = Array.from(spans).map((s) => s.textContent.trim()).filter(Boolean);
        const formattedAmount = '$' + parts.join(',');
        const prizeP = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = formattedAmount;
        prizeP.appendChild(strong);
        col2.push(prizeP);
      }
    }

    const ctaLink = slide.querySelector('.winner-info a.all-winners');
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      col2.push(a);
    }

    if (col1.length > 0 || col2.length > 0) {
      cells.push([col1, col2]);
    }
  });

  // Remove slick navigation buttons that remain as siblings
  const parent = element.parentElement;
  if (parent) {
    parent.querySelectorAll('.slick-prev, .slick-next, .slick-dots').forEach((el) => el.remove());
    // Also remove any stray text nodes with "previous" / "next"
    [...parent.childNodes].forEach((node) => {
      if (node.nodeType === 3 && /^\s*(previous|next)\s*$/i.test(node.textContent)) {
        node.remove();
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Carousel Winners', cells });
  element.replaceWith(block);
}
