/*
  SectionsView.js

  This module displays the sections and reports when a user clicks on one.

  props:
    sections - an array of section names
    setCurrentSection - a callback that expects a section as an argument

*/
import PropTypes from 'prop-types';
import styles from "../styles/SectionsView.module.css";

function SectionsView({ sections, setCurrentSection }) {
  // Sections is an array. Create a shallow copy and sort.
  let sortedSections = [...sections].sort();

  // create a new copy through map and put each section inside a <li> with a callback when clicked
  sortedSections = sortedSections.map((singularSection) => (
    <li
      data-testid="section"
      onClick={() => setCurrentSection(singularSection)}
      key={singularSection}
    >
      {singularSection}
    </li>
  ));

  return (
    <div className={styles.sectionList}>
      <ul>{sortedSections}</ul>
    </div>
  );
}

SectionsView.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCurrentSection: PropTypes.func.isRequired,
};

export default SectionsView;
