import { useEffect, useState } from "react";
import "./DateFilter.css";

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

function formatearFechaLarga(fechaISO) {
  if (!fechaISO) {
    return "Fecha";
  }

  const [year, month, day] = fechaISO.split("-").map(Number);

  return `${day} de ${monthNames[month - 1].toLowerCase()} de ${year}`;
}

function crearFechaISO(year, month, day) {
  const mes = String(month + 1).padStart(2, "0");
  const dia = String(day).padStart(2, "0");

  return `${year}-${mes}-${dia}`;
}

function DateFilter({ fechaSeleccionada, setFechaSeleccionada }) {
  const today = new Date();

  const [abierto, setAbierto] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  useEffect(() => {
    if (!fechaSeleccionada) {
      return;
    }

    const [year, month] = fechaSeleccionada.split("-").map(Number);
    setCurrentDate(new Date(year, month - 1, 1));
  }, [fechaSeleccionada]);

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

  function estaSeleccionado(day) {
    const fecha = crearFechaISO(year, month, day);
    return fechaSeleccionada === fecha;
  }

  function manejarSeleccionDia(day) {
    const fecha = crearFechaISO(year, month, day);

    if (fechaSeleccionada === fecha) {
      setFechaSeleccionada(null);
    } else {
      setFechaSeleccionada(fecha);
    }
  }

  return (
    <div className="date-filter">
      <button
        type="button"
        className="date-filter-button"
        onClick={() => setAbierto(!abierto)}
      >
        <span>{formatearFechaLarga(fechaSeleccionada)}</span>
      </button>

      {abierto && (
        <article className="date-filter-calendar">
          <header className="date-filter-header">
            <button type="button" onClick={goPrevMonth}>
              ‹
            </button>

            <h2>
              {monthNames[month]} {year}
            </h2>

            <button type="button" onClick={goNextMonth}>
              ›
            </button>
          </header>

          <section className="date-filter-days">
            {dayNames.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </section>

          <section className="date-filter-dates">
            {dates.map((day, index) => (
              <button
                key={index}
                type="button"
                className={`date-filter-date ${!day ? "inactive" : ""} ${
                  day && esHoy(day) ? "today" : ""
                } ${day && estaSeleccionado(day) ? "selected" : ""}`}
                disabled={!day}
                onClick={() => manejarSeleccionDia(day)}
              >
                {day}
              </button>
            ))}
          </section>
        </article>
      )}
    </div>
  );
}

export default DateFilter;
