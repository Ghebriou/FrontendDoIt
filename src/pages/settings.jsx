import React, { useState, useEffect } from "react";
import Navaside from "../components/Navaside.jsx";
import Navaside2 from "../components/Navaside2.jsx";
import styles from "./settings.module.css";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function settings() {
  const [file, setFile] = useState(null);
  const [cookies, setCookies] = useCookies();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getUser", {
          headers: { token: cookies.token },
        });
        setUser(response.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, []);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadProfilePicture = async () => {
    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      await axios.post("http://localhost:3000/uploadProfilePic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: cookies.token,
        },
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <div className={styles.settings}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2>Profile Settings</h2>
          <div>
            {user ? (
              <div>
                <h1>
                  Welcome, <span className={styles.txt}>{user.name}</span>
                </h1>
                <p>Email: {user.email}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <input type="file" onChange={onFileChange} />
          <button className={styles.btnP} onClick={uploadProfilePicture}>
            Upload Profile Picture
          </button>
        </div>
      </div>

      <Navaside />
      <Navaside2 />
    </div>
  );
}
