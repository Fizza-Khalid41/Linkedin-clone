import React, { useState } from "react";
import "./Login.css";
import { useDispatch } from "react-redux";
import { login } from "./features/userSlice";
import axios from "axios";

function Login() {
  const [email, setEmail]       = useState("");
  const [name, setName]         = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  // ✅ Login Function
  const loginToApp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        email:       res.data.user.email,
        uid:         res.data.user.id,
        displayName: res.data.user.name,
      }));

      dispatch(login({
        email:       res.data.user.email,
        uid:         res.data.user.id,
        displayName: res.data.user.name,
      }));

    } catch (error) {
      alert("Email ya Password galat hai!");
    }
  };

  // ✅ Register Function
  const register = async () => {
    if (!name) {
      return alert("Please enter a full name");
    }
    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username: name,
        email,
        password,
      });

      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        email:       res.data.user.email,
        uid:         res.data.user.id,
        displayName: res.data.user.name,
      }));

      dispatch(login({
        email:       res.data.user.email,
        uid:         res.data.user.id,
        displayName: res.data.user.name,
      }));

    } catch (error) {
      alert("Account banana mein masla hua!");
    }
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