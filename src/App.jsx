import "./App.css";
import React from "react";
import { useRoutes } from "react-router-dom";
import { Link } from "react-router-dom";
import Signup from "./pages/SignUp";
import HomeFeed from "./pages/HomeFeed";
import EditPost from "./pages/EditPost";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  // Sets up routes
  let element = useRoutes([
    {
      path: "/",
      element: <HomeFeed />,
    },
    {
      path: "/edit/:postId",
      element: (
        <ProtectedRoute>
          <EditPost />
        </ProtectedRoute>
      ),
    },
    {
      path: "/new",
      element: <CreatePost />,
    },
    {
      path: "/details/:postId",
      element: <PostDetails />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="text-light"
        style={{ minHeight: "100vh", paddingTop: "80px" }}
      >
        {element}
      </div>
    </>
  );
};

export default App;
