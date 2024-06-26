import { useRouter } from "next/router";
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
      router.push("/edit");
    } else if (string === "edit") {
      router.push(`/articles/${currentArticle.id}/edit`);
    }
  };

  const articleValid = !!currentArticle;

  return (
    <>
      <IndexBar
        collection={collection}
        setCurrentArticle={setCurrentArticle}
        currentArticle={currentArticle}
      />
      {currentArticle && <Article currentArticle={currentArticle} />}
      <ButtonBar handleClick={handleClick} allowEdit={articleValid} />
    </>
  );
}

Simplepedia.propTypes = {
  collection: PropTypes.arrayOf(ArticleShape).isRequired,
  setCurrentArticle: PropTypes.func.isRequired,
  currentArticle: ArticleShape,
};
