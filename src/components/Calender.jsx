import React, { useState } from 'react';
import styles from './calendar.module.css';
import FaChevronRight from '../assets/chevron-forward-circle.svg';
import FaChevronLeft from '../assets/precalnder.svg';

const Calendar = ({ width, height }) => {
  const [currDate, setCurrDate] = useState(new Date());
  const [showMonthList, setShowMonthList] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const totalDays = daysInMonth(month, year);
    const firstDay = new Date(year, month, 1).getDay();

    const daysArray = [];
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(i);
    }

    return (
      <div className={styles.calendar}>
        <div className={styles.calendarHeader}>
          <img src={FaChevronLeft}
            className={styles.prevMonthIcon}
            onClick={() => setCurrDate(new Date(year, month - 1, 1))}
          />
          <span
            className={styles.monthPicker}
            onClick={() => setShowMonthList(!showMonthList)}
          >
            {monthNames[month]} {year}
          </span>
          <img
          src={FaChevronRight}
            className={styles.nextMonthIcon}
            onClick={() => setCurrDate(new Date(year, month + 1, 1))}
          />
        </div>
        <div className={styles.calendarBody}>
          <div className={styles.calendarWeekDay}>
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className={styles.calendarDays}>
            {Array(firstDay)
              .fill(null)
              .map((_, index) => (
                <div key={`empty-${index}`} className={styles.calendarDay}></div>
              ))}
            {daysArray.map((day) => (
              <div
                key={`day-${day}`}
                className={
                  new Date(year, month, day).toDateString() === currDate.toDateString()
                    ? `${styles.calendarDay} ${styles.currDay}`
                    : styles.calendarDay
                }
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        {showMonthList && (
          <div className={`${styles.monthList} ${styles.show}`}>
            {monthNames.map((monthName, index) => (
              <div
                key={index}
                onClick={() => {
                  setCurrDate(new Date(year, index, 1));
                  setShowMonthList(false);
                }}
              >
                {monthName}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return <div>{generateCalendar(currDate)}</div>;
};

export default Calendar;