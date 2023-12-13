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
import salat from "../assets/salat.svg";

const Navaside = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [cookies, setCookies, removeCookie] = useCookies();
  const navigate = useNavigate();

  const notify = () => {
    toast.success("New task added!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission behavior
      handleAddCategory();
    }
  };

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
                <Link to="/mylist" className={styles.frame_10}>
                  <img className={styles.mylist} alt="Image" src={mylist} />
                  <div className={styles.text_wrapper_8}>My list!</div>
                </Link>

                {/* Add Category */}
                <div className={styles.frame_11}>
                  <div className={styles.catadd}>
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
                        onKeyDown={handleKeyDown}
                      />{" "}
                    </form>
                  </div>

                  {categories.map((category) => (
                    <div className={styles.frame_12} key={category._id}>
                      <div className={styles.categorycolor} />
                      <div className={styles.text_wrapper_9}>
                        {category.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.sections}>
                <Link to="/scheduled" className={styles.frame_14}>
                  <img className={styles.image} alt="scheduled tasks" src={scheduled} />
                  <div className={styles.text_wrapper_8}>Scheduled</div>
                </Link>

                <Link to="/myprayer" className={styles.frame_14}>
                  <img className={styles.image} alt="prayer" src={salat} />
                  <div className={styles.text_wrapper_8}>My Prayer</div>
                </Link>

                <Link to="/settings" className={styles.frame_14}>
                  <img className={styles.image} alt="settings" src={settings} />
                  <div className={styles.text_wrapper_8}>Settings</div>
                </Link>
              </div>
              <div className={styles.frame_15}>
                <div className={styles.frame_16}>
                  <img className={styles.image_5} alt="logout" src={logout} />
                  <button
                    className={styles.logout}
                    onClick={() => {
                      removeCookie("token");
                      navigate("/");
                      alert("Logged out Successfully!");
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
  );
};
export default Navaside;
