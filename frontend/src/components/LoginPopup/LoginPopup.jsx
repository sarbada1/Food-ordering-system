import React, { useContext, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './LoginPopup.css';

import { FaGoogle } from "react-icons/fa";
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

function LoginPopup({ setShowLogin }) {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }
    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const { access_token } = response;
      try {
        const userProfile = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: 'application/json'
          }
        });
        handleGoogleLogin(userProfile.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  const generateRandomPassword = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  async function handleGoogleLogin(userProfile) {
    const userData = {
      name: userProfile.name,
      email: userProfile.email,
      password: generateRandomPassword(10),
    };
    const newUrl = `${url}/api/user/google-login`;
    try {
      const response = await axios.post(newUrl, userData);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? null : (
            <input name='name' value={data.name} onChange={onChangeHandler} type="text" placeholder='Your name' required />
          )}
          <input type="email" name='email' value={data.email} onChange={onChangeHandler} placeholder='Your email' required />
          <input type="password" name='password' value={data.password} onChange={onChangeHandler} placeholder='Password' required />
        </div>
        <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms and conditions of the privacy policy</p>
        </div>
        {currState === "Login" ? (
          <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        )}
        <div className="google-login-button">
          <button type="button" onClick={login}>
            <FaGoogle className="google-icon" />
            {currState === "Login" ? "Sign in" : "Sign up"} with Google
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPopup;
