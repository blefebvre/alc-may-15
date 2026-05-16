/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero variant.
 * Base block: carousel
 * Source selector: section.fca-carousel.hero
 * Generated: 2026-05-15
 *
 * Hero carousel with 5 full-width promotional image slides.
 * Each slide is a single large image (text baked in) wrapped in a link.
 * Images are CSS background-images on .slide-content (picturefill pattern),
 * or <img> tags in scraped HTML. Responsive variants in span[data-src].
 * Structure: each row = 1 slide, col 1 = image, col 2 = link.
 */
export default function parse(element, { document }) {
  // Select all slide <li> elements from the carousel
  const slides = element.querySelectorAll('ul.slides > li.slide');

  const cells = [];

  slides.forEach((slide) => {
    // Each slide has an <article> wrapping an <a> tag (entire slide is clickable)
    const link = slide.querySelector('article.fca-carousel-slide-promo > a');
    if (!link) return;

    const href = link.getAttribute('href');
    const slideContent = slide.querySelector('.slide-content');

    // Column 1: Extract image
    // Strategy 1: Look for an <img> element (scraped/cached HTML may have these)
    let img = slide.querySelector('.slide-content img');

    if (!img && slideContent) {
      // Strategy 2: Extract background-image URL from inline style on .slide-content
      const inlineStyle = slideContent.getAttribute('style') || '';
      const bgMatch = inlineStyle.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);

      if (bgMatch && bgMatch[1]) {
        img = document.createElement('img');
        img.src = bgMatch[1];
        img.alt = '';
      }
    }

    if (!img && slideContent) {
      // Strategy 3: Use the desktop span[data-src] (largest responsive variant)
      const spans = slideContent.querySelectorAll(':scope > span[data-src]');
      // Last span is typically the desktop/largest image
      const desktopSpan = spans.length > 0 ? spans[spans.length - 1] : null;
      if (desktopSpan) {
        img = document.createElement('img');
        img.src = desktopSpan.getAttribute('data-src');
        img.alt = '';
      }
    }

    // Build column 1: image
    const col1 = [];
    if (img) {
      col1.push(img);
    }

    // Build column 2: link as anchor element
    const col2 = [];
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = href;
      col2.push(a);
    }

    cells.push([col1, col2]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
