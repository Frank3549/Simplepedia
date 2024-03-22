/*
  ArticleShape.js

  This provides a PropTypes shape descriptor of article objects. This is pulled out
  since multiple components take articles as props.
*/

import PropTypes from "prop-types";

const ArticleShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  contents: PropTypes.string.isRequired,
  edited: PropTypes.string.isRequired,
});

export default ArticleShape;
