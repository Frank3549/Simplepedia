/*
  IndexBar.js

  This component provides the section and title display that allows the user to 
  browse the available articles and select one for display. 

   props:
    collection - Array of articles in encyclopedia
    setCurrentArticle - Function to call set current article displayed
    currentArticle - The article to render
*/

import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import SectionsView from "./SectionsView";
import TitlesView from "./TitlesView";
import ArticleShape from "./ArticleShape";

export default function IndexBar({
  collection,
  setCurrentArticle,
  currentArticle,
}) {
  // Pass to TitlesView (child) which will update IndexBar.
  const [currentSection, setCurrentSection] = useState(null);

  // Update the section and clear the current article.
  const newSectionSelect = (section) => {
    setCurrentSection(section);
    setCurrentArticle();
  };

  const hashSet = new Set();
  let sections = [];

  // if collection is not undefine.
  if (collection) {
    collection.forEach((article) => {
      hashSet.add(article.title[0].toUpperCase());
    });
    sections = Array.from(hashSet);
  }

  useEffect(() => {
    if (currentArticle) {
      setCurrentSection(currentArticle.title[0].toUpperCase());
    }
  }, [currentArticle]);

  const articlesToDisplay = collection.filter(
    (article) => article.title[0].toUpperCase() === currentSection,
  );

  /*
   Generate the SectionView and the TitlesView only if currentSection != null/undefine
   Otherwise prompt a selection.
  */
  return (
    <div>
      <SectionsView sections={sections} setCurrentSection={newSectionSelect} />
      {currentSection ? (
        <TitlesView
          articles={articlesToDisplay} // only display relevant articles
          setCurrentArticle={setCurrentArticle}
        />
      ) : (
        <div>Please select a section</div>
      )}
    </div>
  );
}

IndexBar.propTypes = {
  collection: PropTypes.arrayOf(ArticleShape).isRequired,
  setCurrentArticle: PropTypes.func.isRequired,
  currentArticle: PropTypes.oneOfType([
    PropTypes.shape(ArticleShape),
    PropTypes.shape({}),
  ]),
};
