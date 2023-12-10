import React, { useState, useEffect } from "react";
import profile from "../assets/person-circle.svg";
import Calendar from "./Calender.jsx";
import styles from "./navaside2.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";

export default function Navaside2() {
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
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((task) => task.done).length;
  const notDoneTasks = tasks.filter((task) => !task.done).length;

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
        notify();
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

  return (
    <div className={styles.nav_side}>
      <div className={styles.navside}>
        <div className={styles.user_picture}>
          <img src={profile} alt="profile" />
          {/* <h2>user</h2>
          <h3>user@gmail.com</h3> */}
        </div>

        <div className={styles.calendar}>
          <Calendar width={240} height={350} />
        </div>

        <div className={styles.task_details}>
          <h3>
            Total Task : <span className={styles.clr}>{totalTasks}</span>
          </h3>
          <h3>
            Task Done : <span className={styles.clr}>{doneTasks}</span>
          </h3>
          <h3>
            Task Not-Done : <span className={styles.clr}>{notDoneTasks}</span>
          </h3>
        </div>

        <div className={styles.add_task}>
          <button className={styles.add_task_btn} onClick={handleOpenModal}>
            Add Task
          </button>
          {showModal && (
            <div className={styles.modal_overlay}>
              <form className={styles.modal_window}>
                <h2 className={styles.h2addtask}>Add Task!</h2>
                <div className={styles.AddContainer}>
                  <div className={styles.Inputs}>
                    <input
                      className={styles.form__field}
                      type="text"
                      placeholder="Title"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      id="name"
                      required
                    />
                    <label htmlFor="name" className={styles.form__label}>
                      {" "}
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
  );
}
