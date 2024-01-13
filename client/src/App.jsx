import React from 'react';
import {

  createBrowserRouter,
  
  RouterProvider,
  
} from "react-router-dom";
import Landing from './pages/landing';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Content from './components/content';
import Home from './components/home';
import Profile from './components/profile';
import Tasks from './components/tasks';
import Admin from './components/admin';
import Topic from './components/topic';



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
      path: "/dashboard/home",
      element: <Home/>,
    },
    {
      path: "/dashboard/content",
      element: <Content/>,
    },
    {
      path: "/dashboard/tasks",
      element: <Tasks/>,
    },
    {
      path: "/dashboard/profile",
      element: <Profile/>,
    },
    {
      path: "/dashboard/admin",
      element: <Admin/>
    },
    
    {
      path: "/dashboard/content/:subject/:unit",
      element: <Topic/>
    }
  ],
},
  
]);

const App = () => {
  return (
    
    <RouterProvider router={router}/>

    
  );
};

export default App;
