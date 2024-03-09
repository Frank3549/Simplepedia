import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Editor from "../components/Editor";
import ArticleShape from "../components/ArticleShape";

export default function SimplepediaCreator({
  collection,
  setCollection,
  setCurrentArticle,
}) {
  const router = useRouter();
  const complete = (article) => {
    if (article) {
      const updatedCollections = [...collection];
      const maxId = updatedCollections.reduce(
        (max, obj) => Math.max(max, obj.id),
        -Infinity,
      );
      // Intentional Disable to update article.id to a unique number
      // eslint-disable-next-line no-param-reassign
      article.id = maxId + 1;
      updatedCollections.push(article);
      setCollection(updatedCollections);
      setCurrentArticle(article);
      router.push(`http://localhost:3000/articles/${article.id}`);
    } else {
      router.back();
    }
  };
  return <Editor setCurrentArticle={setCurrentArticle} complete={complete} />;
}

SimplepediaCreator.propTypes = {
  collection: PropTypes.arrayOf(ArticleShape).isRequired,
  setCollection: PropTypes.func.isRequired,
  setCurrentArticle: PropTypes.func.isRequired,
};
