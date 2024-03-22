/*
  Editor.js

  This provides a basic editor with space for entering a title and a body.

  The interface has two buttons. If "Cancel" is clicked, the `complete` callback
  is called with no arguments. If the "Save" button is clicked, the `complete` callback
  is called with a new article object with `title`, `contents`, and `date`. 

  If the optional `article` prop is set, the `title` and `contents` fields of the component
  are pre-loaded with the values. In addition, all other properties of the object are 
  included in the returned article object. 

  props:
    currentArticle - object with `title` and `contents` properties at minimum
    complete - function to call on completion (required)
*/
import { useState } from "react";
import PropTypes from "prop-types";
import ArticleShape from "./ArticleShape";
import styles from "../styles/Editor.module.css";

function Editor({ currentArticle, complete }) {
  const [newTitle, setTitle] = useState(
    currentArticle ? currentArticle.title : "",
  );
  const [newContent, setContent] = useState(
    currentArticle ? currentArticle.contents : "",
  );

  return (
    <div className={styles.editor}>
      <input
        type="text"
        id="title"
        placeholder="Title must be set"
        value={newTitle}
        onChange={(titleInput) => {
          setTitle(titleInput.target.value);
        }}
      />

      <textarea
        id="articleContent"
        placeholder="Contents"
        value={newContent}
        onChange={(changingContent) => setContent(changingContent.target.value)}
        className={styles.textarea}
      />

      <button
        type="button"
        disabled={!newTitle.trim()}
        onClick={() => {
          const currentDate = new Date().toISOString();
          const newArticle = {
            ...currentArticle,
            title: newTitle,
            contents: newContent,
            edited: currentDate,
          };
          complete(newArticle);
        }}
      >
        Save
      </button>

      {/* button type has been specified. Unsure why the eslint error */}
      {/* eslint-disable-next-line */}
      <button
        type="button"
        onClick={() => {
          complete();
        }}
      >
        Cancel
      </button>
    </div>
  );
}

Editor.propTypes = {
  currentArticle: ArticleShape,
  complete: PropTypes.func.isRequired,
};

export default Editor;
