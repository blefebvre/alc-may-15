/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ALC sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * All selectors from page-templates.json, validated against migration-work/cleaned.html.
 *
 * Template sections:
 *   1. Hero Carousel - selector: "section.fca-carousel.hero" (no style)
 *   2. Recent Winners - selector: ["section.winners-carousel-header", "section.winners-carousel"] (style: "winners-section")
 *   3. Featured Games and Promotions - selector: ["section.featured-games-and-promos-header", "section.featured-games-and-promos"] (no style)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = template.sections;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];

      // Find the first element matching this section's selectors
      let firstElement = null;
      for (const sel of selectorList) {
        firstElement = element.querySelector(sel);
        if (firstElement) break;
      }

      if (!firstElement) continue;

      // Find the last element matching this section's selectors (for appending section metadata after)
      let lastElement = firstElement;
      for (const sel of selectorList) {
        const found = element.querySelector(sel);
        if (found) lastElement = found;
      }

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        lastElement.after(sectionMetadata);
      }

      // Add <hr> before the first element of each non-first section
      if (i > 0) {
        const hr = document.createElement('hr');
        firstElement.before(hr);
      }
    }
  }
}
