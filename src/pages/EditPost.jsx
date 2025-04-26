import { supabase } from "../client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./EditPost.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({
    content: "",
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPost = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      const { data, error } = await supabase
        .from("posts")
        .select("post_content, user_id")
        .eq("id", postId)
        .single();

      if (error) {
        console.error("Error fetching post:", error.message);
      } else if (data.user_id !== user.id) {
        setLoading(false);
        toast.error("You can't edit a post you don't own.");
        navigate("/");
      } else {
        setPost(data);
      }

      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePost = async (event) => {
    event.preventDefault();

    const { error } = await supabase
      .from("posts")
      .update({
        post_content: post.post_content,
      })
      .eq("id", postId);

    if (error) {
      console.error("Error updating post:", error.message);
    } else {
      window.location = "/";
    }
  };

  const deletePost = async (event) => {
    event.preventDefault();
    await supabase.from("posts").delete().eq("id", postId);
    window.location = "/";
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={updatePost}>
          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">
              What's on your mind!
            </label>
            <textarea
              className="form-control"
              id="post_content"
              name="post_content"
              rows="3"
              value={post.post_content}
              onChange={handleChange}
            ></textarea>
          </div>
          <br />
          <input type="submit" value="Submit" />
          <button onClick={deletePost} className="deleteButton" type="button">
            Delete
          </button>
        </form>
      )}
    </div>
  );
};

export default EditPost;
