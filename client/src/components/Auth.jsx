import React, { useState } from 'react'
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/signup.jpg';

const cookies = new Cookies();

const initialState = {
     fullName: '',
     username: '',
     password: '',
     confirmPassword: '',
     phoneNumber: '',
     avatarURL: '',
}


const Auth = () => {
     const [form, setForm] = useState(initialState);
     const [isSignup, setIsSignup] = useState(true)

     const handleChange = (e) => {
          setForm({...form, [e.target.name]: e.target.value}); // a form is not a single text field, it is actually an object, we have to put object there and spread all the items from the form
          // console.log(form);
     }

     const handleSubmit = async (e) => {
          e.preventDefault(); // usually when you submit a form, you need e.preventDefault(),  because it is going to reload the page, in react, we don;t want that.
          console.log(form);
          const {username, password, phoneNumber, avatarURL} = form;
          const URL = 'http://localhost:5000/auth';

          const {data: {token, userId, hashedPassword, fullName}} = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
               username, password, fullName: form.fullName, phoneNumber, avatarURL,
          }) // this is data we are parsing from front-end, we are also getting something back from the backend, data:{ token, userId, hashedPassword} is how we destructure something out of it. And we can also add {token, userId, hashedPassword} to browser cookies
          console.log('token coming back from axios call printed as ', token)
          cookies.set('token', token);
          cookies.set('username', username);
          cookies.set('fullName', fullName);
          cookies.set('userId', userId);

          if(isSignup) {
               cookies.set('phoneNumber', phoneNumber);
               cookies.set('avatarURL', avatarURL);
               cookies.set('hashedPassword', hashedPassword);
          }

          window.location.reload();
     }

     const switchMode = () => {
          setIsSignup((prevIsSignup) => !prevIsSignup);
          //this is correct way to do it in react when you change the state to the opposite of/depending on the the previous state
     }

     return (
  <div className="auth__form-container">
       <div className="auth__form-container_fields">
          <div className="auth__form-container_fields-content">
               <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
               <form onSubmit={handleSubmit}>
                    {isSignup && (
                         <div className="auth__form-container_fields-content_input">
                              <label htmlFor="fullName">Full Name</label>
                              <input type="text" 
                                     name="fullName"
                                     placeholder="Full Name"
                                     onChange={handleChange}
                                     required 
                              />
                         </div>
                    )}
                    <div className="auth__form-container_fields-content_input">
                         <label htmlFor="userName">Username</label>
                         <input type="text" 
                                   name="username"
                                   placeholder="Username"
                                   onChange={handleChange}
                                   required 
                         />
                    </div>
                    {isSignup && (
                         <div className="auth__form-container_fields-content_input">
                              <label htmlFor="phoneNumber">Phone Number</label>
                              <input type="text" 
                                     name="phoneNumber"
                                     placeholder="Phone Number"
                                     onChange={handleChange}
                                     required 
                              />
                         </div>
                    )}
                    {isSignup && (
                         <div className="auth__form-container_fields-content_input">
                              <label htmlFor="avatarURL">Avatar URL</label>
                              <input type="text" 
                                     name="avatarURL"
                                     placeholder="Avatar URL"
                                     onChange={handleChange}
                                     required 
                              />
                         </div>
                    )}
                    <div className="auth__form-container_fields-content_input">
                         <label htmlFor="password">Password</label>
                         <input type="password" 
                                   name="password"
                                   placeholder="Password"
                                   onChange={handleChange}
                                   required 
                         />
                    </div>
                    {isSignup && (
                         <div className="auth__form-container_fields-content_input">
                              <label htmlFor="confirmPassword">Confirm Password</label>
                              <input type="password" 
                                     name="confirmPassword"
                                     placeholder="Confirm Password"
                                     onChange={handleChange}
                                     required 
                              />
                         </div>
                    )}
                    <div className="auth__form-container_fields-content_button">
                         <button>{isSignup ? "Sign Up" : "Sign In"}</button>

                    </div>
               </form>
               <div className="auth__form-container_fields-account">
                    <p>
                         {isSignup
                         ? "Already have an account?"
                         : "Don't have an account?"
                         }
                         <span onClick={switchMode }>
                              {isSignup ? 'Sign In' : 'Sign Up'}
                         </span>
                    </p>
               </div>
          </div>
       </div>
       <div className="auth__form-container_image">
          <img src={signinImage} alt="sign in" />
       </div>
  </div>
 )
}

export default Auth