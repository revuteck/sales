import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function CalendarFilter({ pendingDates = [], completedDates = [], onSelectDate }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

   // FORMAT DATE
    const formatDate = (date) => {
        if (!date) return "—";
        // const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

  // Custom color classes
  const handleDayClass = (date) => {
    const formatted = date.toISOString().split("T")[0];

    if (pendingDates.includes(formatted)) return "red-date";
    if (completedDates.includes(formatted)) return "green-date";

    return "";
  };

  return (
    <>
      {/* BUTTON */}
      <button className="open-calendar-btn" onClick={() => setShowCalendar(true)}>
        📅 
      </button>

      {/* CALNEDER POPUP */}
      {showCalendar && (
        <div className="calendar-modal">
          <div className="calendar-box">

            <button className="close-btn bg-dark" onClick={() => setShowCalendar(false)}>
              ✖
            </button>

            <ReactDatePicker
          
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                const formatted = formatDate(date);
                if (onSelectDate) onSelectDate(formatted); // send selected date
                setShowCalendar(false);
              }}
              inline
              dayClassName={handleDayClass}
                // 🔥 Dynamic navigation
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
             
               
            />

          </div>
        </div>
      )}
    </>
  );
}
