import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Navaside from "../components/Navaside.jsx";
import Navaside2 from "../components/Navaside2.jsx";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cookies, setCookies] = useCookies();
  const [user, setUser] = useState(null);

  // Adding a clock to appears in our page !
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  const greet = () => {
    const hour = date.getHours();
    if (hour < 12) return "Good Morning";
    else if (hour < 18) return "Good Evening";
    else return "Good Night";
  };

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

  // Function to count tasks for each category
  const countTasksByCategory = (category) => {
    const tasksForCategory = tasks.filter(
      (task) => task.categoryName === category
    );
    const tasksDone = tasksForCategory.filter((task) => task.done).length;
    const tasksNotDone = tasksForCategory.filter((task) => !task.done).length;
    const totalTasks = tasksForCategory.length;
    const percentageAchievement =
      totalTasks > 0 ? ((tasksDone / totalTasks) * 100).toFixed(2) : 0;
    return { tasksDone, tasksNotDone, percentageAchievement };
  };

  useEffect(() => {
    // Fetch categories and tasks from API
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get(
          "http://localhost:3000/categories",
          {
            headers: { token: cookies.token },
          }
        );
        setCategories(categoriesRes.data);

        const tasksRes = await axios.get("http://localhost:3000/tasks", {
          headers: { token: cookies.token },
        });
        setTasks(tasksRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [cookies.token]);

  return (
    <div className={styles.Dashboard}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h1 className={styles.text_wrapper}>Dashboard!</h1>
            <div className={styles.section2}>
              <div className={styles.text_wrapper_2}>{formatAMPM(date)}</div>
              <div className={styles.group}>
                <div className={styles.greating}>
                  <div className={styles.greet}>{greet()},</div>
                  {user ? (
                    <div className={styles.text_wrapper_4}>{user.name} !</div>
                  ) : (
                    <div className={styles.text_wrapper_4}>User</div>
                  )}
                </div>
              </div>
            </div>
          </div><div className={styles.act}>My activity</div>
          <div className={styles.categoryTasks}>
            

            {categories.map((category) => {
              const { tasksDone, tasksNotDone, percentageAchievement } =
                countTasksByCategory(category.name);
              return (
                <div key={category._id} className={styles.categoryItem}>
                  <div className={styles.lineContainer}>
                    <div className={styles.line}></div>
                    <div className={styles.ovalShape1}>{category.name}</div>
                  </div>
                  <div className={styles.shapes}>
                    <div className={styles.ovalShape2}>
                      <div className={styles.txt1}>you did</div>
                      <div className={styles.txt2}>{tasksDone} tasks!</div>
                    </div>
                    <div className={styles.ovalShape2}>
                      <div className={styles.txt1}>it left</div>
                      <div className={styles.txt2}>{tasksNotDone} tasks!</div>
                    </div>
                    <div className={styles.ovalShape3}>
                      <div className={styles.prog1}>your progress</div>
                      <div className={styles.prog2}>
                        Keep improving the quality of your day!
                      </div>
                      <div className={styles.perc}>
                        <div className={styles.ellipse} >
                        <div className={styles.prog3}>{percentageAchievement}%</div>
                        </div>
                      </div>
          
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Navaside />
        <Navaside2 />
      </div>
    </div>
  );
}
