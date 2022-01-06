import React, { useState } from 'react'
import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut  } from "firebase/auth";
import FirebaseApp from './Firebase/firebase.config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import {signInWithEmailAndPassword } from "firebase/auth";
import {updateProfile } from "firebase/auth";
FirebaseApp();
function App() {
  const [newUser, setNewUser] = useState(false);
  const  [user, setUser] = useState({
    isSignIn: false,
    newUser: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
  });
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const handleSignIn = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
      const { displayName, photoURL, email} = result.user;
      const signInUser = {
        isSignIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signInUser);
    })
    .catch((error) => {
      console.log(error);
      console.log(error.message);
    });

  }
  const handleSignOut = () => {
    const auth = getAuth();
signOut(auth).then(() => {
  // Sign-out successful.
  const signOutUser = {
    isSignIn: false,
    name: '',
    email: '',
    photo: ''
  }
  setUser(signOutUser)
}).catch((error) => {
  // An error happened.
  console.log(error);
});
  }
  const updateUserName = (name) =>{
  const auth = getAuth();
  updateProfile(auth.currentUser, {
  displayName: name
  }).then(() => {
  console.log("User name updated successfully");
  }).catch((error) => {
  console.log(error); 
  });
  }
const handleSubmit = (e) => {
// console.log(user.name, user.email, user.password);
if(newUser && user.name && user.email && user.password){
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, user.email, user.password)
    .then(res => {
      // Signed in 
      const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success = true;
      setUser(newUserInfo); 
      updateUserName(user.name);

      // const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      //const errorCode = error.code;
      //const errorMessage = error.message;
     // console.log(errorCode, errorMessage);
      const newUserInfo = {...user};
      newUserInfo.error = error.message;
      newUserInfo.success = true;
      setUser(newUserInfo);
      // ..
     
    });
}
if(!newUser && user.email && user.password){
  const auth = getAuth();
  signInWithEmailAndPassword(auth, user.email, user.password)
    .then((res) => {
      // Signed in 
      //const user = userCredential.user;
      // ...
      const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success = true;
      setUser(newUserInfo); 
      console.log(res.user);
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      const newUserInfo = {...user};
      newUserInfo.error = error.message;
      newUserInfo.success = true;
      setUser(newUserInfo);
    });
}
// stop default reload when click submit 
  e.preventDefault();
}

const handleBlur = (e) => {
 let isFieldValid;
  if(e.target.name === 'email'){
    isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    
  }
  if(e.target.name === 'password'){
    const isPasswordValid = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(e.target.value);
    const passwordHasNumber = /\d{1}/.test(e.target.value);

    isFieldValid = isPasswordValid && passwordHasNumber;
  }
  if(e.target.name === 'name'){
    isFieldValid = /^[a-zA-Z ]{2,30}$/.test(e.target.value);
  }
  if(isFieldValid){
    const newUserInfo = {...user};
    newUserInfo[e.target.name] = e.target.value;
    setUser(newUserInfo); 
  }
}
	return <div className="App">
    {
      user.isSignIn? <button onClick={handleSignOut}>Sign Out</button> : 
      <button onClick={handleSignIn}>Sign In</button>
    }
    {
      user.isSignIn && <div>
        <p>Welcome, {user.name}</p>
        <p>Your email: {user.email}</p>
        <img src={user.photo} alt="" />
      </div>
    }
    <h1>Our Own Authentication</h1>
    <input type="checkbox" onChange={()=>setNewUser(!newUser) } name="newUser" id="" />
    <label htmlFor="newUser">New User Sign Up</label>
    <form onSubmit={handleSubmit}>
     {newUser && <input type="text" onBlur={handleBlur} name="name" placeholder='Write your name here' required />}  <br />
    <input type="text" onBlur={handleBlur} name='email' placeholder='Your E-mail'required /> <br />
    <input type="password" onBlur={handleBlur} name="password" autoComplete='on' placeholder='Your Password' required /> <br />
    <input type="submit" value={newUser? 'Sign up': 'Sign in'} /> 
    </form>
    <p style={{color: 'red'}}>{user.error}</p>
    {user.success &&  <p style={{color: 'green'}}>User {newUser? 'Created': 'Logged In'} Successfully.</p> }
   
  </div>;
}

export default App;
