/* eslint-disable */
/* global WebImporter */

import carouselHeroParser from './parsers/carousel-hero.js';
import carouselWinnersParser from './parsers/carousel-winners.js';
import cardsGameParser from './parsers/cards-game.js';

import alcCleanupTransformer from './transformers/alc-cleanup.js';
import alcSectionsTransformer from './transformers/alc-sections.js';

const parsers = {
  'carousel-hero': carouselHeroParser,
  'carousel-winners': carouselWinnersParser,
  'cards-game': cardsGameParser,
};

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'ALC homepage - main landing page with hero carousel, winners carousel, and featured games',
  urls: [
    'https://www.alc.ca/content/alc/en.html',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['section.fca-carousel.hero'],
    },
    {
      name: 'carousel-winners',
      instances: ['section.winners-carousel .winners-carousel-slides'],
    },
    {
      name: 'cards-game',
      instances: ['.featured-games .game-tiles'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: 'section.fca-carousel.hero',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Recent Winners',
      selector: ['section.winners-carousel-header', 'section.winners-carousel'],
      style: 'winners-section',
      blocks: ['carousel-winners'],
      defaultContent: ['section.winners-carousel-header h1'],
    },
    {
      id: 'section-3',
      name: 'Featured Games and Promotions',
      selector: ['section.featured-games-and-promos-header', 'section.featured-games-and-promos'],
      style: null,
      blocks: ['cards-game'],
      defaultContent: ['section.featured-games-and-promos-header h1', '.promos .reference .cmp-image a'],
    },
  ],
};

const transformers = [
  alcCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [alcSectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((el) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element: el,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
