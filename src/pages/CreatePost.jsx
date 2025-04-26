import React, { useState } from "react";
import { supabase } from "../client";

const CreatePost = () => {
  const [postContent, setPostContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("❌ You must be logged in to create a post.");
      return;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      post_content: postContent,
      post_likes: 0
    });

    if (error) {
      console.error("Insert failed:", error.message);
      setMessage(`❌ Failed to create post: ${error.message}`);
    } else {
      setMessage("✅ Post created successfully!");
      setPostContent("");
      setTimeout(() => (window.location = "/"), 1000); // Redirect home
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="post_content">Your Post</label> <br />
        <textarea
          id="post_content"
          name="post_content"
          rows="5"
          cols="60"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Type your thoughts about anime..."
          required
        />
        <br /><br />
        <input type="submit" value="Create Post" className="btn btn-primary" />
        {message && <p className="mt-3">{message}</p>}
      </form>
    </div>
  );
};

export default CreatePost;

