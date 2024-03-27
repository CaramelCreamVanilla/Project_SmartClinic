import React, { createContext, useContext, useState , useEffect } from 'react';
import axios from 'axios'; 

const AuthContext = createContext(); 

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function
  const login = async (username, password) => {
    try {
      const { data } = await axios.post(import.meta.env.VITE_API+'/auth/login', { username, password }); // Assuming the response contains user data
      // console.log(data.token)
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  //Decode token
  const decodeToken = async () =>{
    const token = localStorage.getItem('token');
      if(!token){
        return null;
      }
    try{
      const response = await axios.post(import.meta.env.VITE_API+'/auth/decodeToken', { token });
      setUser(response.data.decoded)
      return response.data.decoded;
    }
    catch (error){
      console.error('Error decoding token:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  }

    // Logout function
    const logout = () => {
      setUser(null);
      localStorage.clear();
    };

// Add new user
  const addUser = async (formData) =>{
    try{
      const res = await axios.post(import.meta.env.VITE_API+'/auth/registerUser',{formData});
      if(res.status === 201){
        console.log("User ID:", res.data.userId);
        return res.data.userId
      }
    }catch(error){
      console.error('Error adding new user:', error);
      return false
    }
  }

// Update User
  const updateUser = async (formData) =>{
    const userId = formData.account_id
    try{
      const res = await axios.post(import.meta.env.VITE_API+'/auth/updateUser',{formData , userId})
    }catch(error){
      console.error('Error adding new user:', error);
      return false
    }
  }

// Add new Question
  const addQuestion = async (question ,answerForm) =>{
    try{
      const res = await axios.post(import.meta.env.VITE_API+'/question/createQuestion',{question ,answerForm})
      if(res.status === 200){
        try{
          await sysnthesis(res.data.q_row , question) //flask
        }catch(error){
          console.error(error);
        }
      }
      return res.status
    }catch(error){
      console.error('Error adding new question:', error);
    }
  }

// Update Question
  const updateQuestion = async (question,answerForm,q_id) =>{
    try{
      const res = await axios.post(import.meta.env.VITE_API+'/question/updateQuestion',{question ,answerForm, q_id})
      console.log(res.data.q_row)
      if(res.status === 200){
        try{
          await sysnthesis(res.data.q_row , question) //flask
        }catch(error){
          console.error(error);
        }
      }
      return res.status
    }catch(error){
      console.error(error);
    }
  }

  const sysnthesis = async (q_row , question) =>{
    // console.log(q_row)
    // console.log(question)
    try{
      const res = await axios.post('http://localhost:5558/synthesis', {q_row , question})//flask
      console.log(res)
    }catch(error){
      console.error('Error create voice question:', error);
    }
  }

  return (
    <AuthContext.Provider 
    value={{
          user, 
          login, 
          logout, 
          decodeToken,
          addUser,
          addQuestion,
          updateUser,
          updateQuestion}}>
        {children}
    </AuthContext.Provider>
  );
};