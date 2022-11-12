import "../styles/globals.css";
import React, { useState, useEffect, useCallback } from "react";
import type { AppProps } from "next/app";
import 'bootstrap/dist/css/bootstrap.min.css';

// @components
import Loading from "components/loading";

// @context
import { SupplyContext } from "context/SupplyContext";

// @AOS
import AOS from "aos";
import "aos/dist/aos.css";

// @near
import { initContract } from "near/utils";

//----------------------------------------------------------

function MyApp({ Component, pageProps }: AppProps) {
  const [loaded, setLoaded] = useState(true);
  const [inited, setInited] = useState(false);
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    window.nearInitPromise = initContract()
      .then(() => setInited(true))
      .catch(console.error);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const getTotalSupply = useCallback(async () => {
    const num = await window?.contract?.nft_total_supply();
    console.log(num);
    setTotalSupply(num);
  }, []);

  useEffect(() => {
    getTotalSupply();
  }, []);

  return (
    <SupplyContext.Provider value={{ totalSupply }}>
      {inited ? (
        loaded ? (
          <Loading />
        ) : (
            <Component {...pageProps} />
        )
      ) : (
        <></>
      )}
    </SupplyContext.Provider>
  );
}

export default MyApp;
