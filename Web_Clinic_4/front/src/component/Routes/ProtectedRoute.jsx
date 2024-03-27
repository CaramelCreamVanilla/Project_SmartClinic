import React , {useState , useEffect} from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) =>{
    const [user,setUser] = useState(localStorage.getItem('account_id'))
    const [isAuth, setIsAuth] = useState(null)

    useEffect(()=>{
        const isLogin = () =>{
            if(!user){
                setIsAuth(false)
            }else{
                setIsAuth(true)
            }
        }
        isLogin();
    },[])

    if (isAuth === null) {
        return null;
      }

    return isAuth ? (children) : <Navigate to='/'/>
}

export default ProtectedRoute;