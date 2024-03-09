import { useRouter } from "next/router";
// import { handleClientScriptLoad } from "next/script";
import PropTypes from "prop-types";
import IndexBar from "../../components/IndexBar";
import ArticleShape from "../../components/ArticleShape";
import Article from "../../components/Article";
import ButtonBar from "../../components/ButtonBar";

export default function Simplepedia({
  collection,
  currentArticle,
  setCurrentArticle,
}) {
  const router = useRouter();
  const handleClick = (string) => {
    if (string === "add") {
      router.push("http://localhost:3000/edit");
    } else if (string === "edit") {
      router.push(`http://localhost:3000/articles/${currentArticle.id}/edit`);
    }
  };

  const allowEdit = currentArticle || false;

  return (
    <>
      <IndexBar
        collection={collection}
        setCurrentArticle={setCurrentArticle}
        currentArticle={currentArticle}
      />
      {currentArticle ? <Article currentArticle={currentArticle} /> : <div />}
      <ButtonBar handleClick={handleClick} allowEdit={allowEdit} />
    </>
  );
}

Simplepedia.propTypes = {
  collection: PropTypes.arrayOf(ArticleShape).isRequired,
  setCurrentArticle: PropTypes.func.isRequired,
  currentArticle: PropTypes.oneOfType([
    PropTypes.shape(ArticleShape).isRequired,
    // eslint-disable-next-line
    PropTypes.undefined, //currentArticle can be undefined.
  ]),
};