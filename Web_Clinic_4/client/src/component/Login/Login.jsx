import React, { useEffect, useState } from 'react';
import { useAuth } from '../Authentication/authContext'; // Adjust path as necessary
import { useNavigate } from "react-router-dom";
import LoginCSS from './Login.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login , decodeToken} = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    const checkUser = async () =>{
      const res = await decodeToken()
      if(localStorage.getItem('token')){
        if(res.role_id =='P'){navigate('/medicalHistory')}
        else if(res.role_id =='N'){navigate('/CreateQueastion')}
        else if(res.role_id =='A'){navigate('/dashboard')}
      }
    }
    checkUser()
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      console.log('Login successful');
      navigate('/dashboard')
      // Redirect user or update UI accordingly
    } catch (error) {
      console.error('Login failed', error);
      // Handle login error (e.g., show message)
    }
  };

  const wd = () =>{
    localStorage.removeItem('account_id')
    localStorage.removeItem('height')
    localStorage.removeItem('pressure_json')
    localStorage.removeItem('token')
    localStorage.removeItem('weight')
  }


  return (

    <div className={LoginCSS['container']} >
      <div className={LoginCSS.wrapper}>
    <div className={LoginCSS.title}><span>CLINIC</span></div>
    <form onSubmit={handleSubmit}>
      <div className={LoginCSS.inputBox}>
        <div className={LoginCSS.titleinput}>CARD ID</div>
        <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
      </div>
      <div className={LoginCSS.inputBox}>
        <div className={LoginCSS.titleinput}>PASSWORD</div>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <button type="submit" className={LoginCSS.btn}>SIGN IN</button>
    </form>
  </div>
  {/* <button onClick={Clearstorage}>Clear Storage</button> */}
    </div>
  );
}

export default Login;