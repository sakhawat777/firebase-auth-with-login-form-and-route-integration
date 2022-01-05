import React, { useState } from 'react'
import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut  } from "firebase/auth";
import FirebaseApp from './Firebase/firebase.config';
FirebaseApp();
function App() {
  const  [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    photo: ''
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
    <form >
    <input type="text" placeholder='Your E-mail' required /> <br />
    <input type="password" name="" placeholder='Your Password' required /> <br />
    <input type="submit" value="Submit" />
    </form>
  </div>;
}

export default App;
