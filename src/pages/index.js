import PropTypes from "prop-types";
import IndexBar from "../components/IndexBar";
import ArticleShape from "../components/ArticleShape";

export default function Simplepedia({ collection }) {
  return <IndexBar collection={collection} />;
}

Simplepedia.propTypes = {
  collection: PropTypes.arrayOf(ArticleShape).isRequired,
};
