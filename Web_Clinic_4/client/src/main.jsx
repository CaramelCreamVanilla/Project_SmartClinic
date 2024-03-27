import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from './component/Authentication/ProtectedRoute.jsx';
// Import the AuthProvider
import { AuthProvider } from './component/Authentication/authContext.jsx'; // Adjust the path as necessary
import { SidebarProvider } from './component/Sidebar/sidebarcontext.jsx';
// Styles
import './index.css';

// Components
import Login from './component/Login/Login.jsx';
import RegistrationForm from './component/Admin/addNewUser.jsx';
import Sidebar from './component/Sidebar/sidebar.jsx';
import Dashboard from './component/Admin/DashBoard.jsx';
import Question from './component/Nurse/Question.jsx';
import Manageuser from './component/Admin/Manageuser.jsx';
import MedicalHistory from './component/Patient/medicalHistory.jsx';
import Personainfo from './component/Patient/Personalinfo.jsx';
// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login/>,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={['A']}><Sidebar/><Dashboard/></ProtectedRoute>,
  },
  {
    path: "/manageuser",
    element: <ProtectedRoute allowedRoles={['A']}><Sidebar/><Manageuser/></ProtectedRoute>,
  },
  {
    path: "/addUser",
    element: <ProtectedRoute allowedRoles={['A']}><RegistrationForm/></ProtectedRoute>,
  },
  {
    path: "/Question",
    element: <ProtectedRoute allowedRoles={['A','N']}><Sidebar/><Question/></ProtectedRoute>,
  },
  {
    path: "/medicalHistory",
    element: <ProtectedRoute allowedRoles={['A','P']}><Sidebar/><MedicalHistory/></ProtectedRoute>,
  },
  {
    path: "/Personalinfo",
    element: <ProtectedRoute allowedRoles={['A','P']}><Sidebar/><Personainfo/></ProtectedRoute>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </AuthProvider>
  </React.StrictMode>,
);