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
  // articles is a array of object that contains title, content, edited, and id.
  // sort the objects in the array by title.
  let sortedArticles = [...articles].sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });

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
