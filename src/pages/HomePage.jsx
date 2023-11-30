import React from "react";
import amico from '../assets/amico.svg';
import logo from  '../assets/logo.svg';
import './Style.css';
import {Link} from "react-router-dom";
export default function HomePage(){
    return (
        <div className="home-page">
            <div className="content">
                <nav className="HomeNav" to='/home'>
                    <Link to='/' className="group">
                        <div className="do-it">Do-it!</div>
                        <img className="logo" alt="Logo" src={logo} />
                    </Link>
                    <div className="log">
                        <div className="login">
                        <Link className="log-in" to="/signin">Sign In</Link>
                        </div>
                        <div className="signup">
                        <Link className="sign-up" to="/signup">Sign Up</Link>
                        </div>
                    </div>
                </nav>
                <div className="wlcm">
                    <p className="welcome-to-do-it">
                        <span className="span">Welcome to </span>
                        <span className="text-wrapper">Do-It!</span>
                    </p>
                    <p className="your-daily-game">
                        Your Daily Game-changer! Our Website Is Your Weapon For Mastering Time. Craft Your Perfect Day, Check Off
                        Tasks, And Conquer Life With Confidence. Don’t Hesistate To Try It Now!
                    </p>
                    <div className="tryitnow">
                            <Link className="try-it-now" to='/signup'>Try It Now!</Link>
                    </div>
                </div>
                <img className="to-do-list-amico" alt="To do list amico" src={amico} />
            </div>
        </div>
    );
}