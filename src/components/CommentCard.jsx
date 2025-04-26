import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";

const CommentCard = ({ id, comment, date }) => {
  return (
    <>
      <div className="card mb-4 p-3">
        <p>{comment}</p>
        <br />
        <p>Posted: {new Date(date).toISOString().slice(0, 10)}</p>
      </div>
    </>
  );
};

export default CommentCard;
