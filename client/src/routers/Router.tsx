import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Register from "../components/Register";
import Login from "../components/Login";
import CategoryManager from "../components/CategoryManager";
import Dashboard from "../components/Dashboard";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/manager",
    element: <CategoryManager />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

export default router;
