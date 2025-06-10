import { get, writable } from "svelte/store";
import { currentScreen, replaceScreen } from "./routing/router";
import { noAction } from "../constants/keyOptions";
import { scrollVertical } from "./navigationUtils";
import { screenRouteNames } from "../constants/screenRouteNames";

class KeyManager {
  verticalIndex: number = 0;
  private scrollListSelector: string = ".navigationPool";
  private scrollContainer: string = ".content";

  left = writable<KeyOption>(noAction);
  right = writable<KeyOption>(noAction);
  center = writable<KeyOption>(noAction);
  backspace = writable<KeyOption>(noAction);

  private mainScreens;

  constructor(mainScreens: string[]) {
    this.mainScreens = mainScreens;
  }

  private moveHorizontal = (move: number) => {
    for (let i = 0; i < this.mainScreens.length; i++) {
      if (this.mainScreens[i] !== get(currentScreen)) {
        continue;
      }
      const _next = i + move;
      if (_next >= 0 && _next < this.mainScreens.length) {
        replaceScreen(this.mainScreens[_next]);
        break;
      }
    }
  };

  private moveVertical = (move: number) => {
    this.verticalIndex = scrollVertical(
      this.verticalIndex,
      move,
      this.scrollListSelector,
      this.scrollContainer
    );
  };

  // set all key options --> use when on a new page
  set(param?: keyManagerParameters) {
    this.verticalIndex = param?.verticalIndex ?? 0;
    this.scrollListSelector = param?.scrollListSelector ?? ".navigationPool";
    this.scrollContainer = param?.scrollContainer ?? ".content";
    this.left.set(param?.left ?? noAction);
    this.right.set(param?.right ?? noAction);
    this.center.set(param?.center ?? noAction);
    this.backspace.set(param?.backspace ?? noAction);
  }

  // update key options --> use when page state changes
  update(param: keyManagerParameters) {
    if (param.left) {
      this.left.set(param.left);
    }
    if (param.right) {
      this.right.set(param.right);
    }
    if (param.center) {
      this.center.set(param.center);
    }
    if (param.backspace) {
      this.backspace.set(param.backspace);
    }
    if (param.verticalIndex) {
      this.verticalIndex = param.verticalIndex;
    }
    if (param.scrollListSelector) {
      this.scrollListSelector = param.scrollListSelector;
    }
    if (param.scrollContainer) {
      this.scrollContainer = param.scrollContainer;
    }
  }

  // get current manager options
  // used in Dialog to restore state after closing
  returnCurrentOptions(): keyManagerParameters {
    return {
      left: get(this.left),
      right: get(this.right),
      center: get(this.center),
      backspace: get(this.backspace),
      verticalIndex: this.verticalIndex,
      scrollListSelector: this.scrollListSelector,
      scrollContainer: this.scrollContainer,
    };
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    try {
      switch (e.key) {
        case "SoftLeft":
          if (this.left !== undefined) {
            get(this.left).action();
          }
          break;
        case "SoftRight":
          if (this.right !== undefined) {
            get(this.right).action();
          }
          break;
        case "Enter":
          if (this.center !== undefined) {
            get(this.center).action();
          }
          break;
        case "Backspace":
          if (this.backspace !== undefined) {
            get(this.backspace).action(e);
          }
          break;
        case "ArrowRight":
          this.moveHorizontal(1);
          break;
        case "ArrowLeft":
          this.moveHorizontal(-1);
          break;
        case "ArrowUp":
          this.moveVertical(-1);
          break;
        case "ArrowDown":
          this.moveVertical(1);
          break;
      }
    } catch (e) {
      console.warn(e);
    }
  };

  createListener = () => {
    document.addEventListener("keydown", this.handleKeyDown);
  };

  removeListener = () => {
    document.removeEventListener("keydown", this.handleKeyDown);
  };
}

export interface KeyOption {
  text: string;
  action: (e?: any) => void;
}

export interface keyManagerParameters {
  left?: KeyOption;
  right?: KeyOption;
  center?: KeyOption;
  backspace?: KeyOption;
  verticalIndex?: number;
  scrollListSelector?: string;
  scrollContainer?: string;
}

export const keyManager = new KeyManager([
  screenRouteNames.Test,
  screenRouteNames.Home,
  screenRouteNames.Profile,
]);
