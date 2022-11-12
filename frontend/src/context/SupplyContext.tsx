import { createContext, useContext } from "react";

const initialState = {
  totalSupply: 0,
};

export const SupplyContext = createContext(initialState);
export const useSupplyContext = () => useContext(SupplyContext);
