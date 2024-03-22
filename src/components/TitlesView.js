/*
  TitleList.js

  This module displays a list of titles and reports when a user clicks on one.

  props:
    articles - an array of objects with title and id properties
    setCurrentArticle - a callback that expects an article as an argument

*/
import PropTypes from "prop-types";
import ArticleShape from "./ArticleShape";

function TitlesView({ articles, setCurrentArticle }) {
  let sortedArticles = [...articles].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  sortedArticles = sortedArticles.map((singularArticle) => (
    <li
      data-testid="title"
      onClick={() => setCurrentArticle(singularArticle)}
      key={singularArticle.id}
    >
      {singularArticle.title}
    </li>
  ));

  return (
    <div>
      <ul>{sortedArticles}</ul>
    </div>
  );
}

TitlesView.propTypes = {
  articles: PropTypes.arrayOf(ArticleShape).isRequired,
  setCurrentArticle: PropTypes.func.isRequired,
};

export default TitlesView;
