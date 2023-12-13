import React, { useState } from "react";
import amicoSignUp from "../assets/amicoSignup.svg";
import logo from "../assets/logo.svg";
import envelop from "../assets/envelop.svg";
import lock from "../assets/lock.svg";
import userIcon from "../assets/user.svg";
import styles from "./SignUp.module.css";

import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
export default function SignUp() {
  const [cookies, setCookie] = useCookies();
  // console.log(cookies)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleUserChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("All FEILDS are compulsory");
      return;
    }

    if (password.length < 8) {
      alert("Password should be atleast of 8 characters");
      return;
    }

    const res = await axios.post("http://localhost:3000/createUser", {
      name,
      email,
      password,
    });

    if (res.data.success) {
      setCookie("token", res.data.token);
      navigate("/home");
      alert("Logged In");
    } else {
      alert("please enter valid credentials");
    }
  };

  return (
    <div className={styles.sign_up}>
      <div className={styles.div}>
        <div className={styles.overlap}>
          <form className={styles.frame}>
            <div className={styles.data}>

              <div className={styles.form__group}>
                <input
                  type="text"
                  className={`${styles.form__field} ${styles.usr}`}
                  placeholder="Username"
                  value={name}
                  onChange={handleUserChange}
                  required
                  id="name"
                />
                <label className={styles.form__label} htmlFor="name">
                  Username
                </label>
                <img
                  className={styles.username}
                  alt="Username"
                  src={userIcon}
                />
              </div>

              <div className={styles.form__group}>
                <input
                  type="email"
                  className={styles.form__field}
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  id="email"
                />
                <label className={styles.form__label} htmlFor="email">
                  Email
                </label>
                <img
                  className={styles.icon_envelope}
                  alt="Icon envelope"
                  src={envelop}
                />
              </div>

              <div className={styles.form__group}>
                <input
                  type="password"
                  className={styles.form__field}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  id="paswd"
                />
                <label className={styles.form__label} htmlFor="paswd">
                  Password
                </label>
                <img className={styles.icon_lock} alt="Icon lock" src={lock} />
              </div>
            </div>
            <button className={styles.signup_btn} onClick={handleSignUp}>
              Create account
            </button>
          </form>

          <div className={styles.frame_8}>
            <Link to="/" className={styles.group}>
              <div className={styles.do_it}>Do-it!</div>
              <img className={styles.logo} alt="Logo" src={logo} />
            </Link>
            <div className={styles.frame_9}>
              <Link to="/signin" className={styles.login}>
                Login
              </Link>
              <Link to="/signup" className={styles.text_wrapper_3}>
                Sign Up
              </Link>
            </div>
          </div>

          <div className={styles.frame_10}>
            <div className={styles.SIGN_UP}>Sign Up</div>
            <p className={styles.register_and_start}>
              Register And Start Discovering Our Application.
            </p>
          </div>
          <div className={styles.frame_11}>
            <div className={styles.rectangle} />
            <img
              className={styles.sign_up_amico}
              alt="Sign up amico"
              src={amicoSignUp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
