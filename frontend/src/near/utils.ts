import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  Account,
  utils,
} from "near-api-js";
import getConfig from "./config";

import { Buffer } from "buffer";
if (typeof window !== "undefined") window.Buffer = Buffer;
if (typeof global !== "undefined") global.Buffer = Buffer;

const nearConfig = getConfig("development");

export async function initContract() {
  const near:any = await connect(
    // @ts-ignore
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );
  window.near = near;
  window.walletConnection = new WalletConnection(near, null);

  window.accountId = window.walletConnection.getAccountId();

  console.log(window.accountId);

  window.configInfo = nearConfig;

  window.utils = utils;

  window.account = new Account(near, window.accountId);
  window.contract = new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: ["nft_total_supply", "nft_tokens_for_owner"],
      changeMethods: ["nft_mint"],
    }
  );
}

export function logout() {
  window.walletConnection.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  window.walletConnection.requestSignIn(nearConfig.contractName);
}
