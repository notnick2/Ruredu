import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Landing from './pages.jsx/landing';
import Register from './pages.jsx/register';
import Login from './pages.jsx/login';
import Dashboard from './pages.jsx/dashboard';
import Sidebar from './components/sidebar';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing/>,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login/>,
      }
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
    children: [
      {
        path: "/dashboard",
        element: <Sidebar/>,
      }
    ]
  }
  
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;
