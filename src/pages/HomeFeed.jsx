import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { supabase } from "../client";

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [sortByNewest, setSortByNewest] = useState(true); // true means newest first

  useEffect(() => {
    fetchPosts();
  }, [sortByNewest]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .order("created_at", { ascending: !sortByNewest }); // Flip order based on sortByNewest

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data);
    }
  };

  const handleSort = () => {
    setSortByNewest((prev) => !prev); // toggle
  };

  return (
    <div
      className="d-flex flex-column align-items-center py-5"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="text-center mb-4">🔥 Explore Anime Posts</h1>

      <button className="btn btn-primary mb-5" onClick={handleSort}>
        {sortByNewest ? "Sort By Oldest" : "Sort By Newest"}
      </button>

      {posts && posts.length > 0 ? (
        <div className="w-100 d-flex flex-column align-items-center gap-4">
          {posts.map((post) => (
            <div key={post.id} className="w-100" style={{ maxWidth: "800px" }}>
              <Card
                postId={post.id}
                content={post.post_content}
                likes={post.post_likes}
                date={post.created_at}
                userId={post.user_id}
              />
            </div>
          ))}
        </div>
      ) : (
        <h2 className="text-center">{"No Posts Yet 🛸"}</h2>
      )}
    </div>
  );
};

export default HomeFeed;
