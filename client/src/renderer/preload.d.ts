/* eslint-disable no-unused-vars */
declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
      };
    };
    theme: {
      set: (name: string) => void;
    };
  }
}

export {};
