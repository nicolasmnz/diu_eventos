import { useState } from "react";
import "./MiniCalendar.css";

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const dayNames = ["LU", "MA", "MI", "JU", "VI", "SA", "DO"];

function MiniCalendar({ fechaSeleccionada, setFechaSeleccionada }) {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const totalDays = lastDay.getDate();
  const startDay = (firstDay.getDay() + 6) % 7;

  const dates = [];

  for (let i = 0; i < startDay; i++) {
    dates.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    dates.push(day);
  }

  function goPrevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function goNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }
  function esHoy(day) {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  }
  function crearFechaISO(year, month, day) {
    const mes = String(month + 1).padStart(2, "0");
    const dia = String(day).padStart(2, "0");

    return `${year}-${mes}-${dia}`;
  }

  function manejarSeleccionDia(day) {
    const fecha = crearFechaISO(year, month, day);

    if (fechaSeleccionada === fecha) {
      setFechaSeleccionada(null);
    } else {
      setFechaSeleccionada(fecha);
    }
  }

  function estaSeleccionado(day) {
    const fecha = crearFechaISO(year, month, day);
    return fechaSeleccionada === fecha;
  }
  return (
    <article className="calendar">
      <header className="calendar-header">
        <button type="button" onClick={goPrevMonth} aria-label="Mes anterior">
          ‹
        </button>

        <h2 className="monthYear">
          {monthNames[month]} {year}
        </h2>

        <button type="button" onClick={goNextMonth} aria-label="Mes siguiente">
          ›
        </button>
      </header>

      <section className="days">
        {dayNames.map((day) => (
          <span key={day} className="calendar-day">
            {day}
          </span>
        ))}
      </section>

      <section className="dates">
        {dates.map((day, index) => (
          <button
            key={index}
            type="button"
            className={`date ${!day ? "inactive" : ""} ${
              esHoy(day) ? "active" : ""
            } ${estaSeleccionado(day) ? "selected" : ""}`}
            disabled={!day}
            onClick={() => manejarSeleccionDia(day)}
          >
            {day}
          </button>
        ))}
      </section>
    </article>
  );
}

export default MiniCalendar;
