import React, { useState, useEffect } from "react";
import styles from "./scheduled.module.css";
import colors from "../assets/coloraddlist.svg";
import Navaside from "../components/Navaside.jsx";
import Navaside2 from "../components/Navaside2.jsx";
import axios from "axios";
import { useCookies } from "react-cookie";
import datepickerIcon from "../assets/datepicker.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import taskdone from "../assets/taskdone.svg";
import tasknotdone from "../assets/tasknotdone.svg";
import taskdelete from "../assets/taskdelete.svg";
export default function Scheduled() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [taskDone, setTaskDone] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [cookies, setCookies] = useCookies();
  const [searchedDay, setSearchedDay] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);

  const handleSearchOnEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchTasks();
    }
  };

  const getTasksForToday = () => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.filter((task) => task.date === today);
  };

  const getTasksForYesterday = () => {
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    return tasks.filter((task) => task.date === yesterday);
  };

  const getPreviousTasks = () => {
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    return tasks.filter((task) => task.date < yesterday);
  };

  const handleSearchTasks = () => {
    if (searchedDay !== "") {
      const tasksForSelectedDay = tasks.filter(
        (task) => task.date === searchedDay
      );
      setFilteredTasks(tasksForSelectedDay);
    } else {
      // Display Today's Tasks, Yesterday's Tasks, and Previous Tasks
      setFilteredTasks(
        getTasksForToday().concat(getTasksForYesterday(), getPreviousTasks())
      );
    }
  };

  useEffect(() => {
    // Set default filtered tasks for today, yesterday, and previous tasks
    setFilteredTasks(
      getTasksForToday().concat(getTasksForYesterday(), getPreviousTasks())
    );
  }, [tasks, searchedDay]);

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

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/tasks", {
        headers: { token: cookies.token },
      });
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`, {
        headers: { token: cookies.token },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleMarkDone = async (id, taskDone) => {
    try {
      const updatedTask = { done: !taskDone };
      const res = await axios.put(
        `http://localhost:3000/tasks/${id}`,
        updatedTask,
        { headers: { token: cookies.token } }
      );
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    } catch (err) {
      console.log(err);
    }
  };

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

  return (
    <div className={styles.scheduled}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h1 className={styles.text_wrapper}>Scheduled!</h1>
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
          </div>

          <div className="TaskFrame">
            <div className={styles.overlap_group}>
              <img
                className={styles.image}
                alt="Image"
                src={datepickerIcon}
                onClick={handleSearchTasks}
              />
              <div className={styles.frame_4}>
                <img
                  className={styles.img}
                  alt="Group"
                  src={colors}
                  onClick={handleSearchTasks}
                />
                <DatePicker
                  selected={searchedDay ? new Date(searchedDay) : null}
                  onSelect={(date) => {
                    const formattedDate = date.toISOString().split("T")[0];
                    setSearchedDay(formattedDate);
                    const tasksForSelectedDay = tasks.filter(
                      (task) => task.date === formattedDate
                    );
                    setFilteredTasks(tasksForSelectedDay);
                  }}
                  onKeyDown={handleSearchOnEnter}
                  onChange={(date) => {
                    if (!date) {
                      setSearchedDay("");
                      handleSearchTasks(); // Call handleSearchTasks when the input is cleared
                    }
                  }}
                  dateFormat="MM/dd/yyyy"
                  className={styles.date_picker}
                  placeholderText="Select day to check your tasks"
                />
              </div>
            </div>

            <div className={styles.tasklist}>
              {searchedDay === "" && (
                <>
                  <h1 className={styles.taskday}>Today’s Tasks</h1>
                  <div className={styles.tasks_container}>
                    {getTasksForToday().map((task) => (
                      <div
                        key={task._id}
                        className={`${styles.task} ${
                          task.done ? styles.done_task : ""
                        }`}
                      >
                        <div
                          className={`${styles.task_info} ${
                            task.done ? styles.done : ""
                          }`}
                        >
                          {" "}
                          <div className={styles.nameT}>
                            <div className={styles.ellipse} />
                            <h3>{task.name}</h3>
                          </div>
                          <p className={styles.categoryN}>
                            {task.categoryName}
                          </p>
                          <p className={styles.timedate}>{task.time}</p>
                        </div>
                        <div className={styles.task_actions}>
                          <button
                            className={styles.btnT}
                            onClick={() => handleMarkDone(task._id, task.done)}
                          >
                            {task.done ? (
                              <img
                                src={taskdone}
                                alt="task done"
                                className={styles.ellipse_2}
                              />
                            ) : (
                              <img
                                src={tasknotdone}
                                alt="task not done"
                                className={styles.ellipse_2}
                              />
                            )}
                          </button>
                          <button
                            className={styles.btnT}
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            <img
                              className={styles.image_2}
                              alt="delete"
                              src={taskdelete}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h1 className={styles.taskday}>Yesterday's Tasks</h1>
                  <div className={styles.tasks_container}>
                    {getTasksForYesterday().map((task) => (
                      <div
                        key={task._id}
                        className={`${styles.task} ${
                          task.done ? styles.done_task : ""
                        }`}
                      >
                        <div
                          className={`${styles.task_info} ${
                            task.done ? styles.done : ""
                          }`}
                        >
                          {" "}
                          <div className={styles.nameT}>
                            <div className={styles.ellipse} />
                            <h3>{task.name}</h3>
                          </div>
                          <p className={styles.categoryN}>
                            {task.categoryName}
                          </p>
                          <p className={styles.timedate}>{task.time}</p>
                        </div>
                        <div className={styles.task_actions}>
                          <button
                            className={styles.btnT}
                            onClick={() => handleMarkDone(task._id, task.done)}
                          >
                            {task.done ? (
                              <img
                                src={taskdone}
                                alt="task done"
                                className={styles.ellipse_2}
                              />
                            ) : (
                              <img
                                src={tasknotdone}
                                alt="task not done"
                                className={styles.ellipse_2}
                              />
                            )}
                          </button>
                          <button
                            className={styles.btnT}
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            <img
                              className={styles.image_2}
                              alt="delete"
                              src={taskdelete}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h1 className={styles.taskday}>Previous Tasks</h1>
                  <div className={styles.tasks_container}>
                    {getPreviousTasks().map((task) => (
                      <div
                        key={task._id}
                        className={`${styles.task} ${
                          task.done ? styles.done_task : ""
                        }`}
                      >
                        <div
                          className={`${styles.task_info} ${
                            task.done ? styles.done : ""
                          }`}
                        >
                          {" "}
                          <div className={styles.nameT}>
                            <div className={styles.ellipse} />
                            <h3>{task.name}</h3>
                          </div>
                          <p className={styles.categoryN}>
                            {task.categoryName}
                          </p>
                          <p className={styles.timedate}>{task.date}</p>
                        </div>
                        <div className={styles.task_actions}>
                          <button
                            className={styles.btnT}
                            onClick={() => handleMarkDone(task._id, task.done)}
                          >
                            {task.done ? (
                              <img
                                src={taskdone}
                                alt="task done"
                                className={styles.ellipse_2}
                              />
                            ) : (
                              <img
                                src={tasknotdone}
                                alt="task not done"
                                className={styles.ellipse_2}
                              />
                            )}
                          </button>
                          <button
                            className={styles.btnT}
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            <img
                              className={styles.image_2}
                              alt="delete"
                              src={taskdelete}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {searchedDay !== "" && (
                <>
                  {filteredTasks.length > 0 ? (
                    <>
                      <h1 className={styles.taskday}>
                        Tasks for {searchedDay}
                      </h1>
                      <div className={styles.tasks_container}>
                        {filteredTasks.map((task) => (
                          <div
                            key={task._id}
                            className={`${styles.task} ${
                              task.done ? styles.done_task : ""
                            }`}
                          >
                            <div
                              className={`${styles.task_info} ${
                                task.done ? styles.done : ""
                              }`}
                            >
                              {" "}
                              <div className={styles.nameT}>
                                <div className={styles.ellipse} />
                                <h3>{task.name}</h3>
                              </div>
                              <p className={styles.categoryN}>
                                {task.categoryName}
                              </p>
                              <p className={styles.timedate}>{task.date}</p>
                            </div>
                            <div className={styles.task_actions}>
                              <button
                                className={styles.btnT}
                                onClick={() =>
                                  handleMarkDone(task._id, task.done)
                                }
                              >
                                {task.done ? (
                                  <img
                                    src={taskdone}
                                    alt="task done"
                                    className={styles.ellipse_2}
                                  />
                                ) : (
                                  <img
                                    src={tasknotdone}
                                    alt="task not done"
                                    className={styles.ellipse_2}
                                  />
                                )}
                              </button>
                              <button
                                className={styles.btnT}
                                onClick={() => handleDeleteTask(task._id)}
                              >
                                <img
                                  className={styles.image_2}
                                  alt="delete"
                                  src={taskdelete}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className={styles.noTasksMessage}>
                      <p className={styles.taskday}>
                        No tasks for {searchedDay}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <Navaside />
        <Navaside2 />
      </div>
    </div>
  );
}
