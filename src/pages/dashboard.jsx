import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Navaside from "../components/Navaside.jsx";
import axios from "axios";
import { useCookies } from "react-cookie";
import taskdelete from "../assets/taskdelete.svg";
import Navaside2 from "../components/Navaside2.jsx";

export default function Dashboard() {
  return (
    <div className={styles.Dashboard}>
      <div className={styles.container}>
        <div className={styles.content}></div>
        <Navaside/>
        <Navaside2/>
      </div>
    </div>
  );
}
