import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import styles from "./navaside.module.css";
import logo from "../assets/logo.svg";
import settings from "../assets/settings.svg";
import pomodoro from "../assets/pomodoro.svg";
import scheduled from "../assets/scheduled.svg";
import mylist from "../assets/mylist.svg";
import dashboard from "../assets/dashboard.svg";
import logout from "../assets/logout.svg";
import category from "../assets/addlist.svg";

const Navaside = () => {
  const [cookies, setCookies, removeCookie] = useCookies();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/categories",
        {
          name: categoryName,
        },
        { headers: { token: cookies.token } }
      );

      setCategoryName("");
      console.log(response.data);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axios.get("http://localhost:3000/categories", {
          headers: { token: cookies.token },
        });
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCategories();
  }, []);

  return (
    <div className={styles.frame}>
      <div className={styles.frame_2}>
        <div className={styles.frame_3}>
          <Link to="/" className={styles.frame_4}>
            <img className={styles.logo} alt="LOGO" src={logo} />
            <div className={styles.text_logo}>DO-IT</div>
          </Link>
          <div className={styles.frame_6}>
            <Link to="/" className={styles.frame_8}>
              <img className={styles.dashboard} alt="Image" src={dashboard} />
              <div className={styles.text_wrapper_8}>Dashboard</div>
            </Link>

            <div className={styles.frame_9}>
              <div className={styles.group2}>
                <Link to="/" className={styles.frame_10}>
                  <img className={styles.mylist} alt="Image" src={mylist} />
                  <div className={styles.text_wrapper_8}>My list!</div>
                </Link>

                {/* Add Category */}
                <div className={styles.frame_11}>
                  <div className={styles.frame_12}>
                    <div className={styles.categorycolor} />
                    <div className={styles.text_wrapper_9}>STUDY</div>
                  </div>
                  <div className={styles.frame_12}>
                    <div className={styles.categorycolor} />
                    <div className={styles.text_wrapper_9}>WORK</div>
                  </div>
                  <div className={styles.frame_12}>
                    <div className={styles.categorycolor} />
                    <div className={styles.text_wrapper_9}>PERSONAL</div>
                  </div>
                  <form className={styles.frame_12}>
                    <img
                      className={styles.vector}
                      alt="Vector"
                      src={category}
                    />
                    <input
                      type="text"
                      className={styles.text_wrapper_10}
                      placeholder="Add Category"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </form>
                </div>
              </div>

              <div className={styles.sections}>
                <Link to="/" className={styles.frame_14}>
                  <img className={styles.image} alt="Image" src={scheduled} />
                  <div className={styles.text_wrapper_8}>Scheduled</div>
                </Link>

                <Link to="/" className={styles.frame_14}>
                  <img className={styles.image} alt="Image" src={pomodoro} />
                  <div className={styles.text_wrapper_8}>Pomodoro</div>
                </Link>

                <Link to="/" className={styles.frame_14}>
                  <img className={styles.image} alt="Image" src={settings} />
                  <div className={styles.text_wrapper_8}>Settings</div>
                </Link>

                <div className={styles.frame_15}>
                  <div className={styles.frame_16}>
                    <img className={styles.image_5} alt="Image" src={logout} />
                    <button
                      className={styles.logout}
                      onClick={() => {
                        removeCookie("token");
                        navigate("/");
                        alert("Logged Out");
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navaside;
