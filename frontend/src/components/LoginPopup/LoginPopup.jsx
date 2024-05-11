import React, { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import './LoginPopup.css'
import { FaGoogle } from "react-icons/fa";
import { assets } from '../../assets/assets'
function LoginPopup({ setShowLogin }) {
  const [currState, setCurrState] = useState("Login")

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });
  return (
    <div className='login-popup'>
      <form className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? <></> :
            <input type="text" placeholder='Your name' required />}
          <input type="email" placeholder='Your email' required />
          <input type="password" placeholder='Password' required />
        </div>
        <button>{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms and condition of privacy policy</p>
        </div>
        {currState === "Login" ?
          <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span> </p> :
          <p>ALready have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        }
        <div className="google-login-button">
          <button onClick={login}>
            <FaGoogle className="google-icon" />
          {currState==="Login"?"Sign in":"Sign up"} with Google
          </button>
        </div>


      </form>
    </div>
  )
}

export default LoginPopup
