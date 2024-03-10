/*
  Article.js

  The Article displays the contents of an article.

  props:
    currentArticle - The article to render
*/
import PropTypes from "prop-types";
import styles from "../styles/Article.module.css";
import ArticleShape from "./ArticleShape";

function Article({ currentArticle }) {
  const date = new Date(currentArticle.edited);
  return (
    <div className={styles.article}>
      <h2>{currentArticle.title}</h2>
      <p>{currentArticle.contents}</p>
      <p className={styles.timestamp}>{date.toLocaleString()}</p>
    </div>
  );
}

Article.propTypes = {
  currentArticle: PropTypes.shape(ArticleShape).isRequired,
};

export default Article;
