// calculate the total navbar width from all the text that should be displayed
export function calculateNavBarWidth(
  arr: Array<{
    path: string;
    text: string;
  }>,
  paddingX: number,
  largeText: boolean = false
): number {
  let total = 0;
  arr.forEach((item) => {
    total += item.text.length;
  });

  return total * (largeText ? 10 : 7) + arr.length * 2 * paddingX;
}

// scroll item to be visible
// accounts for software keys and navigation bar
export function scrollItemIntoView(container: Element, item: HTMLElement) {
  if (itemInView(container, item)) {
    return;
  }

  const containerBoundaries = container.getBoundingClientRect();
  const itemBoundaries = item.getBoundingClientRect();

  if (itemBoundaries.bottom > containerBoundaries.bottom) {
    container.scrollBy(0, itemBoundaries.bottom - containerBoundaries.bottom);
  }
  if (itemBoundaries.top < containerBoundaries.top) {
    container.scrollBy(0, itemBoundaries.top - containerBoundaries.top);
  }
  if (containerBoundaries.left > itemBoundaries.left) {
    container.scrollBy(itemBoundaries.left - containerBoundaries.left, 0);
  }
  if (containerBoundaries.right < itemBoundaries.right) {
    container.scrollBy(itemBoundaries.right - containerBoundaries.right, 0);
  }
}

// tell if item is in view
export function itemInView(container: Element, item: HTMLElement) {
  const containerBoundaries = container.getBoundingClientRect();
  const itemBoundaries = item.getBoundingClientRect();

  return (
    itemBoundaries.bottom <= containerBoundaries.bottom &&
    itemBoundaries.top >= containerBoundaries.top &&
    containerBoundaries.left <= itemBoundaries.left &&
    containerBoundaries.right >= itemBoundaries.right
  );
}
