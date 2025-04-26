import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";
import more from "./more.png";
import { useState, useEffect } from "react";
import { supabase } from "../client";

const Card = ({ postId, content, likes, date, userId }) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  useEffect(() => {
    const checkIfLiked = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingLike } = await supabase
        .from("likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .maybeSingle();

      if (existingLike) {
        setHasLiked(true);
      }
    };

    checkIfLiked();
  }, [postId]);

  const toggleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to like posts.");
      return;
    }

    if (hasLiked) {
      // Unlike
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);

      if (!error) {
        await supabase
          .from("posts")
          .update({ post_likes: likeCount - 1 })
          .eq("id", postId);

        setLikeCount((prev) => prev - 1);
        setHasLiked(false);
      }
    } else {
      // Like
      const { error } = await supabase.from("likes").insert({
        user_id: user.id,
        post_id: postId,
      });

      if (!error) {
        await supabase
          .from("posts")
          .update({ post_likes: likeCount + 1 })
          .eq("id", postId);

        setLikeCount((prev) => prev + 1);
        setHasLiked(true);
      }
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body text-center">
        <p className="text-muted mb-2">
          <strong>Posted:</strong> {new Date(date).toISOString().slice(0, 10)}
        </p>

        <h5 className="card-text mb-3">{content}</h5>

        <p className="mb-3">
          <strong>Likes:</strong> {likeCount}
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link to={`details/${postId}`}>
            <button className="btn btn-dark">💬 Leave a Comment</button>
          </Link>

          <button className="btn btn-primary" onClick={toggleLike}>
            {hasLiked ? "👎 Unlike" : "👍 Like"}
          </button>

          <Link to={`edit/${postId}`}>
            <button className="btn btn-outline-secondary">✏️ Edit</button>
          </Link>
          <br />
          <p>Posted By: User {userId}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
