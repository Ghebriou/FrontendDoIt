import React, { useState, useEffect } from "react";
import "./MyList.css";

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
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };
  //  the current greeting based on the hour of the day.
  const greet = () => {
    const hour = date.getHours();
    if (hour < 12) return "Good Morning";
    else if (hour < 18) return "Good Evening";
    else return "Good Night";
  };

  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [tasksToday, setTasksToday] = useState([]);
  const [tasksTomorrow, setTasksTomorrow] = useState([]);
  const [tasksUpcoming, setTasksUpcoming] = useState([]);

  const handleAddCategory = () => {
    setCategories([...categories, categoryName]);
    setCategoryName("");
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddTask = () => {
    const newTask = {
      name: taskName,
      date: taskDate,
      time: taskTime,
      description: taskDescription,
      category: taskCategory,
    };

    updateTasksList(newTask);
    setTaskName("");
    setTaskDate("");
    setTaskTime("");
    setTaskDescription("");
    setTaskCategory("");
    handleCloseModal();
  };

  const updateTasksList = (task) => {
    if (isTaskToday(task.date)) {
      setTasksToday([...tasksToday, task]);
    } else if (isTaskTomorrow(task.date)) {
      setTasksTomorrow([...tasksTomorrow, task]);
    } else {
      setTasksUpcoming([...tasksUpcoming, task]);
    }
  };

  const isTaskToday = (taskDate) => {
    const currentDate = new Date();
    const taskDateTime = new Date(taskDate);

    return (
      currentDate.getFullYear() === taskDateTime.getFullYear() &&
      currentDate.getMonth() === taskDateTime.getMonth() &&
      currentDate.getDate() === taskDateTime.getDate()
    );
  };

  const isTaskTomorrow = (taskDate) => {
    const currentDate = new Date();
    const taskDateTime = new Date(taskDate);

    return (
      currentDate.getFullYear() === taskDateTime.getFullYear() &&
      currentDate.getMonth() === taskDateTime.getMonth() &&
      currentDate.getDate() + 1 === taskDateTime.getDate()
    );
  };

  return (
    <div className="my-list">
      <div className="frame-wrapper">
        <div className="frame">
          <div className="div">
            <div className="text-wrapper">My list !</div>
            <div className="frame-2">
              <div className="text-wrapper-2">{formatAMPM(date)}</div>
              <div className="group">
                <div className="good-morning-wrapper">
                  <p className="good-morning">
                    <div className="span">{greet()},</div>
                    <div className="text-wrapper-4">Yasmine! </div>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Enter Category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <button onClick={handleAddCategory}>Add Category</button>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>{category}</li>
              ))}
            </ul>
          </div>

          <div>
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
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleAddTask}>Add Task</button>
                  <button onClick={handleCloseModal}>Cancel</button>
                </div>
              </div>
            )}
          </div>
          <div>
            <h1>Today's Tasks</h1>
            <ul>
              {tasksToday.map((task) => (
                <li key={task.name}>
                  <h2>{task.name}</h2>
                  <p>{task.description}</p>
                  <p>
                    {new Date(task.date).toLocaleDateString()} {task.time}
                  </p>
                  <p>{task.category}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h1>Tomorrow's Tasks</h1>
            <ul>
              {tasksTomorrow.map((task) => (
                <li key={task.name}>
                  <h2>{task.name}</h2>
                  <p>{task.description}</p>
                  <p>
                    {new Date(task.date).toLocaleDateString()} {task.time}
                  </p>
                  <p>{task.category}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h1>Upcoming Tasks</h1>
            <ul>
              {tasksUpcoming.map((task) => (
                <li key={task.name}>
                  <h2>{task.name}</h2>
                  <p>{task.description}</p>
                  <p>
                    {new Date(task.date).toLocaleDateString()} {task.time}
                  </p>
                  <p>{task.category}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="frame-3">
            <div className="todo-box">
              <div className="overlap-group">
                <img className="image" alt="Image" src="image-10.png" />
                <div className="frame-4">
                  <img className="img" alt="Group" src="group-2.svg" />
                  <p className="p">What is your next task ?</p>
                </div>
              </div>
            </div>
            <div className="text-wrapper-5">Today’s list</div>
            <div className="frame-5">
              <div className="frame-6">
                <div className="frame-7">
                  <img className="group-2" alt="Group" src="group-9.png" />
                  <div className="frame-8">
                    <div className="frame-9">
                      <div className="frame-10">
                        <div className="ellipse" />
                        <div className="text-wrapper-6">Write my cv</div>
                      </div>
                      <div className="text-wrapper-6">12:00 PM</div>
                    </div>
                    <div className="frame-11">
                      <div className="ellipse-2" />
                      <img className="image-2" alt="Image" src="image-13.png" />
                    </div>
                  </div>
                </div>
                <div className="frame-7">
                  <img className="group-2" alt="Group" src="image.png" />
                  <div className="frame-12">
                    <div className="frame-13">
                      <div className="frame-10">
                        <div className="ellipse-3" />
                        <div className="text-wrapper-6">ENVS Online Course</div>
                      </div>
                      <div className="text-wrapper-6">04:00 PM</div>
                    </div>
                    <div className="frame-11">
                      <div className="ellipse-2" />
                      <img
                        className="image-2"
                        alt="Image"
                        src="image-13-2.png"
                      />
                    </div>
                  </div>
                </div>
                <div className="frame-7">
                  <img className="group-2" alt="Group" src="group-9-2.png" />
                  <div className="frame-8">
                    <div className="frame-14">
                      <div className="frame-10">
                        <div className="ellipse-4" />
                        <div className="text-wrapper-6">Clean my room</div>
                      </div>
                      <div className="text-wrapper-7">10:00 PM</div>
                    </div>
                    <div className="frame-11">
                      <div className="ellipse-2" />
                      <img
                        className="image-2"
                        alt="Image"
                        src="image-13-3.png"
                      />
                    </div>
                  </div>
                </div>
                <div className="frame-7">
                  <img className="group-2" alt="Group" src="group-9-3.png" />
                  <div className="frame-15">
                    <div className="frame-16">
                      <div className="frame-10">
                        <div className="ellipse-3" />
                        <div className="write-my-cv">GL Online Course</div>
                      </div>
                      <div className="text-wrapper-8">09:00 PM</div>
                    </div>
                    <div className="frame-11">
                      <div className="ellipse-2" />
                      <img
                        className="image-2"
                        alt="Image"
                        src="image-13-4.png"
                      />
                    </div>
                  </div>
                  <img className="line" alt="Line" src="line-11.svg" />
                </div>
              </div>
              <img className="frame-17" alt="Frame" src="frame-88.svg" />
            </div> 
          </div>*/}
        </div>
      </div>
    </div>
  );
}
