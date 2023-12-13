import React, { useState, useEffect } from "react";
import styles from "./scheduled.module.css";
import Navaside from "../components/Navaside.jsx";
import Navaside2 from "../components/Navaside2.jsx";

export default function scheduled() {
  return (
    <div className={styles.scheduled}>
     <div className={styles.container}>

     </div>
     <Navaside/>
     <Navaside2/>
    </div>
  )
}
