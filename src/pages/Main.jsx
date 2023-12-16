import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDone, setTaskDone] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cookies, setCookies, removeCookie] = useCookies();

  const [searchedDay, setSearchedDay] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);

  const getTasksForToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.date === today);
  };

  const getTasksForYesterday = () => {
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return tasks.filter(task => task.date === yesterday);
  };

  const getPreviousTasks = () => {
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return tasks.filter(task => task.date < yesterday);
  };

  const handleSearchTasks = () => {
    if (searchedDay !== "") {
      const tasksForSelectedDay = tasks.filter(task => task.date === searchedDay);
      setFilteredTasks(tasksForSelectedDay);
    }
  };

  useEffect(() => {
    // Set default filtered tasks for today, yesterday, and previous tasks
    setFilteredTasks(getTasksForToday().concat(getTasksForYesterday(), getPreviousTasks()));
  }, [tasks, searchedDay])
   


  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((task) => task.done).length;
  const notDoneTasks = tasks.filter((task) => !task.done).length;

  const navigate = useNavigate();
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

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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

      console.log(response.data);

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

  return (
    <div>
      {/* <div>
        {user ? (
          <div>
            <h1>Welcome, {user.name}</h1>
            <p>Email: {user.email}</p>
            <Link to="/updateProfile">Update Profile</Link>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="App">
        <h1>Do-It!</h1>

        <div>
          <input
            type="text"
            placeholder="Enter Category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button onClick={handleAddCategory}>Add Category</button>
          <ul>
            {categories.map((category) => (
              <li key={category._id}>
                <p>Name: {category.name}</p>
              </li>
            ))}
          </ul>
        </div> */}

        {/* <div>
          <button onClick={handleOpenModal}>Add Task</button>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-window">
                <h2>Add Task</h2>
                <input
                  type="text"
                  placeholder="Enter Task Name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                />
                <input
                  type="time"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                />
                <textarea
                  placeholder="Enter Task Description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <button onClick={handleAddTask}>Add Task</button>
                <button onClick={handleCloseModal}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <h1>Tasks</h1>
        <div>
          {tasks.map((task) => (
            <li key={task._id}>
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              <p>Date: {task.date}</p>
              <p>Time: {task.time}</p>
              <p>Category: {task.categoryName}</p>
              <p>Done: {task.done.toString()}</p>
              <button onClick={() => handleMarkDone(task._id, task.done)}>
                Mark as {task.done ? "not done" : "done"}
              </button>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </li>
          ))}
          <button
            onClick={() => {
              removeCookie("token");
              navigate("/");
              alert("Logged Out");
            }}
          >
            {" "}
            Logout{" "}
          </button>
        </div>
        <h3>Total Tasks: {totalTasks}</h3>
        <h3>Done Tasks: {doneTasks}</h3>
        <h3>Not Done Tasks: {notDoneTasks}</h3>
      </div> */}



<div>
        <input
          type="date"
          value={searchedDay}
          onChange={(e) => setSearchedDay(e.target.value)}
        />
        <button onClick={handleSearchTasks}>Search Tasks</button>
        <div>
          {searchedDay === "" && (
            <>
              <h2>Tasks for Today</h2>
              {getTasksForToday().map((task) => (
                 <li key={task._id}>
                 <h3>{task.name}</h3>
                 <p>{task.description}</p>
                 <p>Date: {task.date}</p>
                 <p>Time: {task.time}</p>
                 <p>Category: {task.categoryName}</p>
                 <p>Done: {task.done.toString()}</p>
                 <button onClick={() => handleMarkDone(task._id, task.done)}>
                   Mark as {task.done ? "not done" : "done"}
                 </button>
                 <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
               </li>
              ))}
              <h2>Tasks for Yesterday</h2>
              {getTasksForYesterday().map((task) => (
                 <li key={task._id}>
                 <h3>{task.name}</h3>
                 <p>{task.description}</p>
                 <p>Date: {task.date}</p>
                 <p>Time: {task.time}</p>
                 <p>Category: {task.categoryName}</p>
                 <p>Done: {task.done.toString()}</p>
                 <button onClick={() => handleMarkDone(task._id, task.done)}>
                   Mark as {task.done ? "not done" : "done"}
                 </button>
                 <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
               </li>
              ))}
              <h2>Previous Tasks</h2>
              {getPreviousTasks().map((task) => (
                 <li key={task._id}>
                 <h3>{task.name}</h3>
                 <p>{task.description}</p>
                 <p>Date: {task.date}</p>
                 <p>Time: {task.time}</p>
                 <p>Category: {task.categoryName}</p>
                 <p>Done: {task.done.toString()}</p>
                 <button onClick={() => handleMarkDone(task._id, task.done)}>
                   Mark as {task.done ? "not done" : "done"}
                 </button>
                 <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
               </li>
              ))}
            </>
          )}
          {searchedDay !== "" && (
            <>
              <h2>Tasks for {searchedDay}</h2>
              {filteredTasks.map((task) => (
                <li key={task._id}>
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              <p>Date: {task.date}</p>
              <p>Time: {task.time}</p>
              <p>Category: {task.categoryName}</p>
              <p>Done: {task.done.toString()}</p>
              <button onClick={() => handleMarkDone(task._id, task.done)}>
                Mark as {task.done ? "not done" : "done"}
              </button>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </li>
              ))}
            </>
          )}
        </div>
      </div>
      <br /><br /><br />
    </div>
  );
}
