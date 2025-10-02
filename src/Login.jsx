import React, { useState } from "react";
import "./Login.css";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { login } from "./features/userSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  // ✅ Login function
  const loginToApp = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userAuth) => {
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
          })
        );
      })
      .catch((error) => alert(error.message));
  };

  // ✅ Register function
  const register = () => {
    if (!name) {
      return alert("Please enter a full name");
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userAuth) => {
        updateProfile(userAuth.user, {
          displayName: name,
        }).then(() => {
          dispatch(
            login({
              email: userAuth.user.email,
              uid: userAuth.user.uid,
              displayName: name,
            })
          );
        });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/a/aa/LinkedIn_2021.svg"
        alt=""
      />
      <h2 className="login__tagline">Make the most of your professional life</h2>
      <form>
  <div className="login__input">
    <label>Full Name</label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      type="text"
    />
  </div>

  <div className="login__input">
    <label>Email</label>
    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      type="email"
    />
  </div>

  <div className="login__input">
    <label>Password</label>
    <input
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      type="password"
    />
  </div>

  <button type="submit" onClick={loginToApp}>
    Log in
  </button>
</form>

      <p>
        Not a member?{" "}
        <span className="login__register" onClick={register}>
          Register Now
        </span>
      </p>
    </div>
  );
}

export default Login;
