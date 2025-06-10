import { itemInView, scrollItemIntoView } from "./frontEndUtils";
import { keyManager } from "./keyManager";

// set focus when first entering a page
export function setInitialFocus(
  index: number = 0,
  itemSelector: string = ".navigationPool",
  containerSelector: string = ".content"
) {
  // set vertical navigation index
  keyManager.verticalIndex = focusNthElement(
    index,
    itemSelector,
    containerSelector
  );
}

export function scrollVertical(
  index: number,
  move: number,
  itemSelector: string,
  containerSelector: string
) {
  const items = document.querySelectorAll<HTMLElement>(itemSelector);
  if (items.length === 0) {
    return 0;
  }
  const container = document.querySelector(containerSelector);
  if (container === null) {
    return 0;
  }

  let item = items[index];

  if (move > 0 && !itemInView(container, item)) {
    scrollItemIntoView(container, item);
    return index;
  }

  let newIndex = index + move;

  if (
    newIndex < 0 &&
    itemInView(container, items[index]) &&
    container.scrollTop > 0
  ) {
    container.scrollTop = 0;
    return index;
  }

  // wrap the navigation over
  if (newIndex < 0 || newIndex >= items.length) {
    newIndex < 0 ? (newIndex += items.length) : (newIndex %= items.length);
  }

  item = items[newIndex];
  item.focus();
  // request frame to get the current position of element after focus gets applied
  requestAnimationFrame(() => {
    if (newIndex === 0 && move > 0) {
      container.scrollTop = 0;
    } else {
      scrollItemIntoView(container, item);
    }
  });

  return newIndex;
}

export function focusNthElement(
  index: number = 0,
  itemSelector: string = ".navigationPool",
  containerSelector: string = ".content"
) {
  const items = document.querySelectorAll<HTMLElement>(itemSelector);
  if (items.length === 0) {
    console.warn(`no focusable elements on page`);
    return 0;
  }

  const container = document.querySelector(containerSelector);
  if (container === null) {
    console.warn(`container not provided`);
    return 0;
  }

  // wrap the navigation over
  if (index < 0 || index >= items.length) {
    index < 0 ? (index += items.length) : (index %= items.length);
  }

  let item = items[index];
  item.focus();

  // request frame to get the current position of element after focus gets applied
  requestAnimationFrame(() => {
    if (index === 0) {
      // scroll container to the top
      container.scrollTop = 0;
    } else {
      scrollItemIntoView(container, item);
    }
  });

  return index;
}

// bring focus back to input container after date/time/selection picker gets hidden
export function focusAfterInputExit(
  input: HTMLInputElement | HTMLSelectElement,
  container: HTMLDivElement
) {
  if (document.activeElement === input) {
    return;
  }

  if (container) {
    container.focus();
  }
}

export function clickItem(selector: string = ".navigationPool") {
  const index: number = keyManager.verticalIndex;
  const items = document.querySelectorAll(selector);

  // nothing to click
  if (items.length === 0) {
    return;
  }

  if (items[index] != null) {
    (items[index] as HTMLElement).click();
  }
}
