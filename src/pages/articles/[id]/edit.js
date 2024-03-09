import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Editor from "../../../components/Editor";
import ArticleShape from "../../../components/ArticleShape";

export default function SimplepediaEditor({
  collection,
  setCollection,
  setCurrentArticle,
  currentArticle,
}) {
  const router = useRouter();
  const complete = (article) => {
    if (article && article.id) {
      const indexOfOldArticle = collection.findIndex(
        (oldArticle) => +oldArticle.id === +article.id,
      );
      const updatedCollections = [...collection];
      updatedCollections[indexOfOldArticle] = article;
      setCollection(updatedCollections);
      setCurrentArticle(article);
      router.push(`http://localhost:3000/articles/${article.id}`);
    } else {
      router.back();
    }
  };

  return (
    <Editor
      setCurrentArticle={setCurrentArticle}
      complete={complete}
      currentArticle={currentArticle}
      key={currentArticle.id}
    />
  );
}

SimplepediaEditor.propTypes = {
  collection: PropTypes.arrayOf(ArticleShape).isRequired,
  setCollection: PropTypes.func.isRequired,
  currentArticle: PropTypes.shape(ArticleShape).isRequired,
  setCurrentArticle: PropTypes.func.isRequired,
};
