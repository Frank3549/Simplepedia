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
  const complete = (newArticle) => {
    if (newArticle) {
      const updatedCollections = collection.map((oldArticle) =>
        oldArticle.id === newArticle.id ? newArticle : oldArticle,
      );
      setCollection(updatedCollections);
      setCurrentArticle(newArticle);
    } else {
      router.back();
    }
  };

  return (
    <Editor
      setCurrentArticle={setCurrentArticle}
      complete={complete}
      currentArticle={currentArticle}
      key={currentArticle?.id}
    />
  );
}

SimplepediaEditor.propTypes = {
  collection: PropTypes.arrayOf(ArticleShape).isRequired,
  setCollection: PropTypes.func.isRequired,
  currentArticle: ArticleShape.isRequired,
  setCurrentArticle: PropTypes.func.isRequired,
};
