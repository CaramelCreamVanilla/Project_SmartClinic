import React , {useState , useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const ProtectedRoute = ({ children , allowedRoles  }) => {
  const { decodeToken } = useAuth();
  const [isAuth, setIsAuth] = useState(null)
  const [userRole, setUserRole] = useState(null);

  useEffect(() =>{
    const fecthCurrentUser = async () =>{
      try{
        const res = await decodeToken()
        if(!res){
          setIsAuth(false)
        }else{
          setUserRole(res.role_id);
          setIsAuth(true)
        }
      }catch(error){
        console.error('Error fetching user data', error);
        setIsAuth(false);
      }
    }
    fecthCurrentUser();
  },[]);

  

  if (isAuth === null) {
    return null;
  }

  return isAuth && allowedRoles.includes(userRole) ? (
    children
  ) : userRole === 'P' ? (
    <Navigate to="/medicalHistory" />
  ) : userRole === 'N' ? (
    <Navigate to="/Question" />
  ) : userRole === 'A' ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoute;
