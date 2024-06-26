/* eslint-disable */

import "../styles/globals.css";
import { useState } from "react";
import Head from "next/head";
import data from "../../data/seed.json";
import styles from "../styles/Simplepedia.module.css";
import { useRouter } from "next/router";

function MainApp({ Component, pageProps }) {
  const [collection, setCollection] = useState(data);
  const router = useRouter();
  const { id } = router.query;

  const currentArticle = id
    ? collection.find((article) => +article.id === +id)
    : undefined;

  const setCurrentArticle = (article) => {
    if (article) {
      router.push(`/articles/${article.id}`);
    } else {
      router.push("/articles");
    }
  };

  const props = {
    ...pageProps,
    collection,
    setCollection,
    currentArticle,
    setCurrentArticle,
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

      <footer>
        <a
          className={styles.githubLink}
          href="https://github.com/Frank3549/Simplepedia.git"
        >
          Github Repository
        </a>
      </footer>
    </div>
  );
}

export default MainApp;
