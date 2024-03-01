/*
  TitleList.js

  This module displays a list of titles and reports when a user clicks on one.

  props:
    articles - an array of objects with title and id properties
    setCurrentArticle - a callback that expects an article as an argument

*/
import ArticleShape from "./ArticleShape";

export default function TitlesView({ articles, setCurrentArticle }) {
  return <ul>Titles go here</ul>;
}
