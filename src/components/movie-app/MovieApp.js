import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import parse from "html-react-parser";
import Axios from "axios";
import Button from "../common/Button";
import PropTypes from "prop-types";
import styles from "../common/Button.module.css";

function MovieApp() {
  const [movieContent, setMovieContent] = useState({
    title: "",
    content: "",
  });

  const [viewContent, setViewContent] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:8000/api/simpleboard").then((response) => {
      setViewContent(response.data);
    });
  }, [viewContent]);

  const submitReview = () => {
    Axios.post("http://localhost:8000/api/simpleboard", {
      title: movieContent.title,
      content: movieContent.content,
    }).then(() => {
      alert("등록 완료!");
    });
  };

  const getValue = (e) => {
    const { name, value } = e.target;
    setMovieContent({
      ...movieContent,
      [name]: value,
    });
    console.log(movieContent);
  };

  return (
    <div className="App">
      <h1 className={styles.title}>Movie Review</h1>
      <div className="movie-container">
        {viewContent.map((element, index) => (
          <div key={index}>
            <h2>{element.title}</h2>
            <div>{parse(element.content)}</div>
          </div>
        ))}
      </div>
      <div className="form-wrapper">
        <input
          className="title-input"
          type="text"
          placeholder="제목"
          onChange={getValue}
          name="title"
        />
        <CKEditor
          editor={ClassicEditor}
          data="<p>Hello from CKEditor 5!</p>"
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log({ event, editor, data });
            setMovieContent({
              ...movieContent,
              content: data,
            });
            console.log(movieContent);
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />
      </div>
      <Button text="입력" changeValue={submitReview} fontSize={16} />
    </div>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
};

export default MovieApp;
