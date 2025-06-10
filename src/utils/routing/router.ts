import { writable } from "svelte/store";

export const screenRouteNames = {
  InitOnboarding: "/onboarding/init",
  RegisterUserOnboarding: "/onboarding/registerUser",
  PermissionsOnboarding: "/onboarding/permissions",
  Home: "/home",
  ConfirmCreateIncident: "/incident/confirm",
  CallService: "/incident/create",
  Profile: "/profile",
  HealthInformation: "/profile/health",
  TemporaryInformation: "/profile/temporary",
  PersonalInformation: "/profile/personal",
  ContactList: "/profile/contacts",
  ContactDetail: "/profile/contacts/detail/:index/:contact",
  AddContactFromContactList: "/profile/contacts/addContactList",
  Test: "/test",
  TestConfirmCreateIncident: "/test/confirm",
  TestCallService: "/test/create",
  TestResultScreen: "/test/result",
};

const initialPath = cleanHash(window.location.hash);

export const currentScreen = writable<string>(initialPath);
export const lastVisitedScreen = writable<string | undefined>(undefined);

export function pushScreen(route: string, data?: Record<string, any>) {
  window.location.assign(createNewUrl(route, data));
}

export function popScreen() {
  history.back();
}

export function replaceScreen(route: string, data?: Record<string, any>) {
  window.location.replace(createNewUrl(route, data));
}

export function getParamsFromRoute(routePattern: string): Record<string, any> {
  let params: Record<string, any> = {};

  let patternChunks = parseRoute(window.location.hash).split("/");
  let currentRouteChunks = cleanHash(window.location.hash).split("/");

  for (let i = 0; i < patternChunks.length; i++) {
    let patternChunk = patternChunks[i];
    let currentRouteChunk = currentRouteChunks[i];

    if (!patternChunk.startsWith(":") || currentRouteChunk === "") {
      continue;
    }

    params[patternChunk.substring(1)] = JSON.parse(currentRouteChunks[i]);
  }
  return params;
}

export function parseRoute(path: string): string {
  path = cleanHash(path);
  const routePatterns = Object.values(screenRouteNames);

  return (
    routePatterns.find((pattern) => {
      const patternSegments = pattern.split("/");
      const routeSegments = path.split("/");

      if (patternSegments.length !== routeSegments.length) {
        return false;
      }

      for (let i = 0; i < patternSegments.length; i++) {
        let segment = patternSegments[i];
        if (!segment.startsWith(":") && segment !== routeSegments[i]) {
          return false;
        }
      }

      return true;
    }) ?? "/"
  );
}

function createNewUrl(path: string, data?: Record<string, any>): string {
  // create a new url from path and data
  let baseUrl = window.location.href.replace(/#.*$/, "");
  if (!data) {
    return baseUrl + "#" + path;
  }

  let pathChunks = path.split("/");
  pathChunks.forEach((chunk, i) => {
    if (chunk.startsWith(":")) {
      chunk = chunk.substring(1);
      pathChunks[i] =
        data[chunk] !== undefined
          ? encodeURIComponent(JSON.stringify(data[chunk]))
          : "";
    }
  });

  return baseUrl + "#" + pathChunks.join("/");
}

function cleanHash(path: string): string {
  path = decodeURIComponent(path);
  return path.startsWith("#") ? path.substring(1) : "/";
}
