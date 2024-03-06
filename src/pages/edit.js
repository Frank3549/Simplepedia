
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Editor from '../components/Editor';
import ArticleShape from '../components/ArticleShape';



export default function SimplepediaCreator({collection, setCollection, setCurrentArticle}){
    const router = useRouter();
    const complete = (article) =>  {
        if(article){
            const updatedCollections = [...collection];
            updatedCollections.push(article);
            setCollection(updatedCollections);
        }else{
            router.back();
        }
    };
    return <Editor setCurrentArticle={setCurrentArticle} complete={complete} />
}

SimplepediaCreator.propTypes = {
    collection: PropTypes.arrayOf(ArticleShape).isRequired,
    setCollection: PropTypes.func.isRequired,
    setCurrentArticle: PropTypes.func.isRequired,
}