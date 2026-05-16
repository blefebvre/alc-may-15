/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ALC cleanup.
 * Removes non-authorable site chrome, modals, tracking pixels, and navigation.
 * All selectors validated against live DOM at https://www.alc.ca/content/alc/en.html
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    WebImporter.DOMUtils.remove(element, [
      '#loginFlow',
      '#ZN_3Eu2u7P45FmpwJ5',
      '.cmp-page__skiptomaincontent',
      '#collapsible-promo',
      '.collapsible-promo',
      '.alc-modal',
      '.modal-browser-check',
      'header',
      'nav#nav-mobile',
      '.user-dashboard',
      '.dashboard-container',
      '.account-menu',
      '.main-nav-wide',
      '.main-nav-mobile',
      '.navbar-collapse',
      '#nav-dashboard-mobile',
      'section.homepage-promo',
      '.alc-mobile-banner',
      '.banner.section',
      '.common-modals',
      'script',
      'noscript',
      'link',
      'iframe',
    ]);

    // Remove all body > div elements that precede the hero carousel
    // These contain login forms, account dashboards, and navigation chrome
    const hero = element.querySelector('section.fca-carousel.hero');
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
      'footer.main-footer',
    ]);
  }
}
