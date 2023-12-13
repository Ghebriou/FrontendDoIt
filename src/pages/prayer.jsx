import React, { useState, useEffect } from "react";
import Navaside from "../components/Navaside.jsx";
import Navaside2 from "../components/Navaside2.jsx";
import axios from "axios";
import moment from "moment";
import styles from "./prayer.module.css";


export default function Prayer() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [nextPrayer, setNextPrayer] = useState('');
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const fetchPrayerTimes = async () => {
    try {
      const response = await axios.get(
        'http://api.aladhan.com/v1/timingsByCity?city=Algiers&country=Algeria&method=2'
      );
      const timings = response.data.data.timings;
      setPrayerTimes(timings);

      const currentTime = new Date().getTime();
      const prayerTimesArray = Object.entries(timings);

      let currentPrayerIndex = -1;
 
      for (let i = 0; i < prayerTimesArray.length; i++) {
        const [prayer, time] = prayerTimesArray[i];
        const prayerTime = new Date(new Date().toDateString() + ' ' + time).getTime();

        if (prayerTime <= currentTime) {
          currentPrayerIndex = i;
        } else {
          break;
        }
      }

      if (currentPrayerIndex !== -1) {
        setCurrentPrayer(prayerTimesArray[currentPrayerIndex][0]);
        setNextPrayer(prayerTimesArray[currentPrayerIndex + 1] ? prayerTimesArray[currentPrayerIndex + 1][0] : '');
        const nextPrayerTimeInMillis = new Date(
          new Date().toDateString() + ' ' + prayerTimesArray[currentPrayerIndex + 1][1]
        ).getTime();

        const intervalId = setInterval(() => {
          const remainingTime = nextPrayerTimeInMillis - new Date().getTime();
          if (remainingTime > 0) {
            const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            setCountdown(`${minutes}m ${seconds}s`);
          } else {
            clearInterval(intervalId);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur w fetching data:', error);
    }
  };

  return (
    <div className={styles.prayer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2>Prayer Times</h2>
          <div className={styles.headings}>
            <p>Current Prayer: <span className={styles.txt}> {currentPrayer}</span></p>
            <p>Next Prayer: <span className={styles.txt}>{nextPrayer}</span></p>
            <p>Countdown to Next Prayer: <span className={styles.txt}>{countdown}</span></p>
          </div>
          <div className={styles.prayers}>
          {prayerTimes ? (
            <ul>
              {Object.entries(prayerTimes)
                .filter(([key]) => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(key))
                .map(([key, value]) => (
                  <li key={key} className={key === nextPrayer ? styles.nextPrayer : ''}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
            </ul>
          ) : (
            <p>Loading prayer times...</p>
          )}
          </div>
        </div>
      </div>
      <Navaside />
      <Navaside2 />
    </div>
  );
}