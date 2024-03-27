import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Components
import App from './component/Model/Model.jsx';
import Login from './component/Login/Login.jsx';
import QuestionForm from './component/QuestionForm/Questionform.jsx';
import Pressure from './component/addPressure/add_pressure.jsx';
import Anatomy from './component/Anatomy/Anatomy.jsx';
import ProtectedRoute from './component/Routes/ProtectedRoute.jsx';
import './index.css'
// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>
  },
  {
    path: "/form",
    element: <ProtectedRoute><QuestionForm/></ProtectedRoute>
  },
  {
    path: "/json",
    element: <Pressure/>
  },
  // {
  //   path: "/ana",
  //   element: <Anatomy/>
  // },
  // {
  //   path: "/ptr",
  //   element: <ProtectedRoute/>
  // },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <AuthProvider> Wrap RouterProvider with AuthProvider */}
      <RouterProvider router={router} />
    {/* </AuthProvider> */}
  </React.StrictMode>,
);
