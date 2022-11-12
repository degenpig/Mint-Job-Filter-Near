// types/index.ts
export {};

declare global {
  interface Window {
    near: any;
    walletConnection: any;
    accountId: any;
    configInfo: any;
    utils: any;
    account: any;
    contract: any;
    nearInitPromise: any;
  }
}