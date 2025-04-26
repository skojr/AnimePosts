import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../client";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!session?.user) {
    toast.error("You must be logged in to continue!");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
