import React, {useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import styles from "./SignIn.module.css";
import amico1 from "../assets/amicoLogin.svg";
import logo from "../assets/logo.svg";
import lock from "../assets/lock.svg";
import envelop from "../assets/envelop.svg";
import axios from 'axios';
import { useCookies } from "react-cookie";


export default function SignIn() {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
   console.log(cookies)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
   
  const navigate = useNavigate()

  const handleSignIn = async(e)=>{
    e.preventDefault();

        if( !email || !password){
            alert("All FEILDS are compulsory")
            return
        }

        if(password.length<8){
          alert("Password should be atleast of 8 characters")
            return
        }

        const res = await axios.post("http://localhost:3000/login",{
            email,
            password
        })
        console.log(res)

        if(res.data.success){
            
            setCookie('token',res.data.token)
            navigate('/home');
            alert("Logged In");
            
        }
        else{
          alert("please enter valid credentials")
        }
      



            


   
};

  return (
    <div className={styles.sign_in}>
      <div className={styles.parent}>
        <div className={styles.overlap}>
          <div className={styles.SigninAmico}>
            <img
              className={styles.computer_login_amico}
              alt="Computer login amico"
              src={amico1}
            />
          </div>
          <div className={styles.overlap_2}>
            <div className={styles.frame}>
              <form className={styles.frame_2}>
                <div className={styles.frame_3}>
                  <div className={styles.WELCOME_BACK}>Welcome Back!</div>
                  <p className={styles.sign_in_to_continue}>
                    Sign In To Continue To Our Application.
                  </p>
                </div>

                <div className={styles.email_password}>
                  <div className={styles.form__group}>
                    <input
                      type="email"
                      className={styles.form__field}
                      placeholder="Email"
                      value={email}
                      onChange={handleEmailChange}
                      id="email"
                      required
                    />
                    <label className={styles.form__label} htmlFor="email">Email</label>
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
                      id="password"
                    />
                    <label className={styles.form__label} htmlFor="password">Password</label>
                    <img
                      className={styles.icon_lock}
                      alt="Icon lock"
                      src={lock}
                    />
                  </div>
                </div>
                <button className={styles.login_btn} onClick={handleSignIn}>
                  Login
                </button>
              </form>
            </div>
          </div>
          <div className={styles.frame_9}>
            <Link to="/" className={styles.group}>
              <div className={styles.do_it}>Do-it!</div>
              <img className={styles.logo} alt="Logo" src={logo} />
            </Link>
            <div className={styles.frame_10}>
              <Link to="/signin" className={styles.login1}>
                Login
              </Link>
              <Link to="/signup" className={styles.signup1}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
