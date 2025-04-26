import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../client";
import CommentCard from "../components/CommentCard";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({ post_content: "" });
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      // Fetch post
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("post_content")
        .eq("id", postId)
        .single();

      if (!postError) setPost(postData || { post_content: "Post not found" });

      // Fetch comments
      const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .select("comment, created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (!commentError) setComments(commentData || []);
      setLoading(false);
    };

    fetchPostAndComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      comment: comment.trim(),
    });

    if (!error) {
      // Clear textarea
      setComment("");

      // Refresh comments
      const { data: updatedComments } = await supabase
        .from("comments")
        .select("comment, created_at")
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      setComments(updatedComments || []);
    } else {
      console.error("Error submitting comment:", error.message);
    }
  };

  return (
    <div className="PostDetails">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Post Content:</h2>
          <p>{post.post_content}</p>

          <hr />

          <h4>Leave a Comment:</h4>
          <form onSubmit={handleSubmit}>
            <textarea
              rows="4"
              cols="50"
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
            <br />
            <button type="submit">Submit Comment</button>
          </form>

          <hr />

          <h4>Comments:</h4>
          {comments.length > 0 ? (
            comments.map((c, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <CommentCard key={c.id} commentId={c.id} comment={c.comment} date={c.created_at} />
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </>
      )}
    </div>
  );
};

export default PostDetails;
