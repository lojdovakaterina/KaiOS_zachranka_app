export function setTextSize() {
  let enabled = (navigator as any).largeTextEnabled;
  changeTextStyles(enabled);
}

// change font sizes if large text is enabled
function changeTextStyles(enabled: boolean) {
  document.documentElement.style.setProperty(
    "--textsize-l",
    `${enabled ? "21px" : "17px"}`
  );
  document.documentElement.style.setProperty(
    "--textsize-m",
    `${enabled ? "19px" : "14px"}`
  );
  document.documentElement.style.setProperty(
    "--textsize-s",
    `${enabled ? "17px" : "12px"}`
  );
}
