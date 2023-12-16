import React, { useState, useEffect } from "react";
import styles from "./MyList.module.css";
import Navaside from "../components/Navaside.jsx";
import axios from "axios";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import colors from "../assets/coloraddlist.svg";
import addbtn from "../assets/addlistbtn.svg";
import taskdone from "../assets/taskdone.svg";
import tasknotdone from "../assets/tasknotdone.svg";
import taskdelete from "../assets/taskdelete.svg";
import Navaside2 from "../components/Navaside2.jsx";
export default function Mylist() {
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

  // updated
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
  const [showModal, setShowModal] = useState(false);

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

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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

  const handleAddTask = async () => {
    try {
      const task = {
        name: taskName,
        date: taskDate,
        time: taskTime,
        description: taskDescription,
        category: selectedCategory,
        done: taskDone,
      };
      const response = await axios.post("http://localhost:3000/tasks", task, {
        headers: { token: cookies.token },
      });

      if (response.status === 200) {
        notify(); // Trigger Toastify notification
      }
      // console.log(response.data);

      setTaskName("");
      setTaskDescription("");
      setTaskDate("");
      setTaskTime("");
      setSelectedCategory("");
      setTaskDone(false);
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

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

  // Filter tasks based on date
  const filterTasksByDate = (tasks, targetDate) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === targetDate.toDateString();
    });
  };

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Filter tasks for Today, Tomorrow, and Upcoming
  const todayTasks = filterTasksByDate(tasks, today);
  const tomorrowTasks = filterTasksByDate(tasks, tomorrow);
  const afterTomorrow = new Date();
  afterTomorrow.setDate(afterTomorrow.getDate() + 2);
  afterTomorrow.setHours(0, 0, 0, 0);

  const upcomingTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date);
    return taskDate >= afterTomorrow;
  });

  return (
    <div className={styles.my_list}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h1 className={styles.text_wrapper}>My List!</h1>

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
            <button className={styles.overlap_group} onClick={handleOpenModal}>
              <img className={styles.image} alt="Image" src={addbtn} />
              <div className={styles.frame_4}>
                <img className={styles.img} alt="Group" src={colors} />
                <p className={styles.p}>What is your next task ?</p>
              </div>
            </button>

            <div className={styles.tasklist}>
              <h1 className={styles.taskday}>Today’s Tasks</h1>
              <div className={styles.tasks_container}>
                {todayTasks.map((task) => (
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
                      <p className={styles.categoryN}>{task.categoryName}</p>
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

              <h1 className={styles.taskday}> Tomorrow's Tasks</h1>
              <div className={styles.tasks_container}>
                {tomorrowTasks.map((task) => (
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
                      <p className={styles.categoryN}>{task.categoryName}</p>
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

              <h1 className={styles.taskday}>Upcoming Tasks</h1>
              <div className={styles.tasks_container}>
                {upcomingTasks.map((task) => (
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
                      <p className={styles.categoryN}>{task.categoryName}</p>
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
            </div>
            <Navaside />
            <Navaside2 />

            {showModal && (
              <div className={styles.modal_overlay}>
                <form className={styles.modal_window}>
                  <h2 className={styles.h2addtask}>Add Task!</h2>
                  <div className={styles.AddContainer}>
                    <div className={styles.Inputs}>
                      <input
                        className={`${styles.form__field} ${styles.title}`}
                        type="text"
                        placeholder="Title"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        id="name"
                        required
                      />
                      <label htmlFor="name" className={styles.form__label}>
                        Title
                      </label>
                    </div>
                    <div className={styles.Inputs}>
                      <input
                        className={styles.form__field}
                        type="date"
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.Inputs}>
                      <input
                        className={styles.form__field}
                        type="time"
                        value={taskTime}
                        onChange={(e) => setTaskTime(e.target.value)}
                      />
                    </div>
                    <div className={styles.Inputs}>
                      <select
                        className={styles.form__field}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={styles.Addbtn}>
                    <button className={styles.btn2} onClick={handleAddTask}>
                      Add Task
                    </button>
                    <ToastContainer />
                    <button className={styles.btn1} onClick={handleCloseModal}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
