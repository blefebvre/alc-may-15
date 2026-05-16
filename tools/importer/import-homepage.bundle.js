/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll("ul.slides > li.slide");
    const cells = [];
    slides.forEach((slide) => {
      const link = slide.querySelector("article.fca-carousel-slide-promo > a");
      if (!link) return;
      const href = link.getAttribute("href");
      const slideContent = slide.querySelector(".slide-content");
      let img = slide.querySelector(".slide-content img");
      if (!img && slideContent) {
        const inlineStyle = slideContent.getAttribute("style") || "";
        const bgMatch = inlineStyle.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
        if (bgMatch && bgMatch[1]) {
          img = document.createElement("img");
          img.src = bgMatch[1];
          img.alt = "";
        }
      }
      if (!img && slideContent) {
        const spans = slideContent.querySelectorAll(":scope > span[data-src]");
        const desktopSpan = spans.length > 0 ? spans[spans.length - 1] : null;
        if (desktopSpan) {
          img = document.createElement("img");
          img.src = desktopSpan.getAttribute("data-src");
          img.alt = "";
        }
      }
      const col1 = [];
      if (img) {
        col1.push(img);
      }
      const col2 = [];
      if (href) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = href;
        col2.push(a);
      }
      cells.push([col1, col2]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-winners.js
  function parse2(element, { document }) {
    const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned) .slide");
    const cells = [];
    slides.forEach((slide) => {
      const col1 = [];
      const winnerImage = slide.querySelector(".winner-image");
      if (winnerImage) {
        const style = winnerImage.getAttribute("style") || "";
        const match = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
        if (match) {
          const img = document.createElement("img");
          img.src = match[1];
          img.alt = "";
          col1.push(img);
        }
      }
      const col2 = [];
      const winnerName = slide.querySelector(".winner-info h1");
      if (winnerName) {
        const h3 = document.createElement("h3");
        h3.textContent = winnerName.textContent.trim();
        col2.push(h3);
      }
      const location = slide.querySelector(".winner-info h2");
      if (location) {
        const p = document.createElement("p");
        p.textContent = location.textContent.trim();
        col2.push(p);
      }
      const gameLogo = slide.querySelector(".prize-details img.winning-game-logo");
      if (gameLogo) {
        col2.push(gameLogo);
      }
      const prizeAmountEl = slide.querySelector(".prize-details .prize-amount");
      if (prizeAmountEl) {
        const spans = prizeAmountEl.querySelectorAll("span");
        if (spans.length > 0) {
          const parts = Array.from(spans).map((s) => s.textContent.trim()).filter(Boolean);
          const formattedAmount = "$" + parts.join(",");
          const prizeP = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = formattedAmount;
          prizeP.appendChild(strong);
          col2.push(prizeP);
        }
      }
      const ctaLink = slide.querySelector(".winner-info a.all-winners");
      if (ctaLink) {
        const a = document.createElement("a");
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        col2.push(a);
      }
      if (col1.length > 0 || col2.length > 0) {
        cells.push([col1, col2]);
      }
    });
    const parent = element.parentElement;
    if (parent) {
      parent.querySelectorAll(".slick-prev, .slick-next, .slick-dots").forEach((el) => el.remove());
      [...parent.childNodes].forEach((node) => {
        if (node.nodeType === 3 && /^\s*(previous|next)\s*$/i.test(node.textContent)) {
          node.remove();
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Carousel Winners", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-game.js
  function parse3(element, { document }) {
    const tiles = element.querySelectorAll(":scope .game-tile.parbase article.game-tile, :scope article.game-tile");
    const cells = [];
    tiles.forEach((tile) => {
      var _a;
      const imageContainer = tile.querySelector(".game-tile-image-container");
      let gameImage = null;
      if (imageContainer) {
        const bgStyle = imageContainer.style.backgroundImage || ((_a = (imageContainer.getAttribute("style") || "").match(/background-image:\s*url\(["']?([^"')]+)["']?\)/)) == null ? void 0 : _a[0]);
        const bgMatch = (imageContainer.getAttribute("style") || "").match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
        if (bgMatch && bgMatch[1]) {
          gameImage = document.createElement("img");
          gameImage.src = bgMatch[1];
          const headingEl = tile.querySelector(".game-tile-content h1, .game-tile-content h2");
          gameImage.alt = headingEl ? headingEl.textContent.trim() : "";
        }
        if (!gameImage) {
          gameImage = imageContainer.querySelector(":scope > img") || imageContainer.querySelector(":scope > picture");
        }
      }
      const contentContainer = tile.querySelector(".game-tile-content");
      const contentParts = [];
      if (contentContainer) {
        const heading = contentContainer.querySelector("h1, h2, h3");
        if (heading) contentParts.push(heading);
        const description = contentContainer.querySelector(".game-tile-description p");
        if (description) contentParts.push(description);
        const drawDate = contentContainer.querySelector(".next-jackpot-date");
        if (drawDate && drawDate.textContent.trim()) contentParts.push(drawDate);
        const prize = contentContainer.querySelector(".next-jackpot-prize");
        if (prize && prize.textContent.trim()) contentParts.push(prize);
        const cta = contentContainer.querySelector("a.button, a.arrow-button");
        if (cta) contentParts.push(cta);
      }
      const imageCell = gameImage ? [gameImage] : [];
      cells.push([imageCell, contentParts]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-game", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/alc-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#loginFlow",
        "#ZN_3Eu2u7P45FmpwJ5",
        ".cmp-page__skiptomaincontent",
        "#collapsible-promo",
        ".collapsible-promo",
        ".alc-modal",
        ".modal-browser-check",
        "header",
        "nav#nav-mobile",
        ".user-dashboard",
        ".dashboard-container",
        ".account-menu",
        ".main-nav-wide",
        ".main-nav-mobile",
        ".navbar-collapse",
        "#nav-dashboard-mobile",
        "section.homepage-promo",
        ".alc-mobile-banner",
        ".banner.section",
        ".common-modals",
        "script",
        "noscript",
        "link",
        "iframe"
      ]);
      const hero = element.querySelector("section.fca-carousel.hero");
      if (hero) {
        let sibling = hero.previousElementSibling;
        while (sibling) {
          const prev = sibling.previousElementSibling;
          sibling.remove();
          sibling = prev;
        }
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "footer.main-footer"
      ]);
    }
  }

  // tools/importer/transformers/alc-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let firstElement = null;
        for (const sel of selectorList) {
          firstElement = element.querySelector(sel);
          if (firstElement) break;
        }
        if (!firstElement) continue;
        let lastElement = firstElement;
        for (const sel of selectorList) {
          const found = element.querySelector(sel);
          if (found) lastElement = found;
        }
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          lastElement.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          firstElement.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "carousel-winners": parse2,
    "cards-game": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "ALC homepage - main landing page with hero carousel, winners carousel, and featured games",
    urls: [
      "https://www.alc.ca/content/alc/en.html"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: ["section.fca-carousel.hero"]
      },
      {
        name: "carousel-winners",
        instances: ["section.winners-carousel .winners-carousel-slides"]
      },
      {
        name: "cards-game",
        instances: [".featured-games .game-tiles"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: "section.fca-carousel.hero",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Recent Winners",
        selector: ["section.winners-carousel-header", "section.winners-carousel"],
        style: "winners-section",
        blocks: ["carousel-winners"],
        defaultContent: ["section.winners-carousel-header h1"]
      },
      {
        id: "section-3",
        name: "Featured Games and Promotions",
        selector: ["section.featured-games-and-promos-header", "section.featured-games-and-promos"],
        style: null,
        blocks: ["cards-game"],
        defaultContent: ["section.featured-games-and-promos-header h1", ".promos .reference .cmp-image a"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
