/* eslint-disable */
import "../styles/globals.css";
import { useState } from "react";
import Head from "next/head";

import data from "../../data/seed.json";
import styles from "../styles/Simplepedia.module.css";

function MainApp({ Component, pageProps }) {
  const [collection, setCollection] = useState(data);

  const props = {
    ...pageProps,
    collection,
    setCollection,
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Simplepedia</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="title">Simplepedia</h1>
        <Component {...props} />
      </main>

      <footer>CS 312 Assignment 3</footer>
    </div>
  );
}

export default MainApp;
