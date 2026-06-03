import { useEffect } from "react";
import { createPortal } from "react-dom";

import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { CalendarDays, Clock4 } from "lucide-react";

import "./SaveModal.css";

function SaveModal({ abierto, onCerrar, calendario }) {
  useEffect(() => {
    if (!abierto) return;

    function cerrarConEscape(event) {
      if (event.key === "Escape") {
        onCerrar();
      }
    }

    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto, onCerrar]);

  if (!abierto || !calendario) return null;

  function fechaGoogle(fecha) {
    return fecha.replaceAll("-", "");
  }

  function sumarDias(fecha, dias) {
    const [year, month, day] = fecha.split("-").map(Number);
    const nuevaFecha = new Date(Date.UTC(year, month - 1, day + dias));

    return nuevaFecha.toISOString().slice(0, 10);
  }

  function sumarMinutos(fecha, hora, minutos) {
    const fechaHora = new Date(`${fecha}T${hora}:00`);
    fechaHora.setMinutes(fechaHora.getMinutes() + minutos);

    const nuevaFecha = fechaHora.toISOString().slice(0, 10);
    const nuevaHora = fechaHora.toTimeString().slice(0, 5);

    return {
      fecha: nuevaFecha,
      hora: nuevaHora,
    };
  }

  function fechaHoraGoogle(fecha, hora) {
    return `${fechaGoogle(fecha)}T${hora.replace(":", "")}00`;
  }

  function obtenerFechaTerminoExclusiva() {
    return sumarDias(calendario.fechaTermino ?? calendario.fechaInicio, 1);
  }

  function obtenerFinConHora() {
    if (calendario.horaTermino) {
      return {
        fecha: calendario.fechaTermino ?? calendario.fechaInicio,
        hora: calendario.horaTermino,
      };
    }

    return sumarMinutos(
      calendario.fechaInicio,
      calendario.horaInicio,
      calendario.duracionMinutosSugerida ?? 60,
    );
  }

  function obtenerTextoFecha() {
    if (calendario.fechaInicio === calendario.fechaTermino) {
      return calendario.fechaInicio;
    }

    return `${calendario.fechaInicio} - ${calendario.fechaTermino}`;
  }

  function obtenerTextoHora() {
    if (calendario.todoElDia) {
      return "Todo el día";
    }

    if (calendario.horaInicio && calendario.horaTermino) {
      return `${calendario.horaInicio} - ${calendario.horaTermino}`;
    }

    if (calendario.horaInicio) {
      return `Desde ${calendario.horaInicio}`;
    }

    return "Horario por confirmar";
  }

  function abrirGoogleCalendar() {
    const url = new URL("https://calendar.google.com/calendar/render");

    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", calendario.titulo);
    url.searchParams.set("details", calendario.descripcion ?? "");
    url.searchParams.set("location", calendario.ubicacion ?? "");
    url.searchParams.set("ctz", calendario.zonaHoraria ?? "America/Santiago");

    if (calendario.todoElDia) {
      const inicio = fechaGoogle(calendario.fechaInicio);
      const termino = fechaGoogle(obtenerFechaTerminoExclusiva());

      url.searchParams.set("dates", `${inicio}/${termino}`);
    } else {
      const fin = obtenerFinConHora();

      const inicio = fechaHoraGoogle(
        calendario.fechaInicio,
        calendario.horaInicio,
      );

      const termino = fechaHoraGoogle(fin.fecha, fin.hora);

      url.searchParams.set("dates", `${inicio}/${termino}`);
    }

    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  function abrirMicrosoftCalendar() {
    const url = new URL(
      "https://outlook.office.com/calendar/0/deeplink/compose",
    );

    url.searchParams.set("subject", calendario.titulo);
    url.searchParams.set("body", calendario.descripcion ?? "");
    url.searchParams.set("location", calendario.ubicacion ?? "");

    if (calendario.todoElDia) {
      url.searchParams.set("allday", "true");
      url.searchParams.set("startdt", calendario.fechaInicio);
      url.searchParams.set("enddt", obtenerFechaTerminoExclusiva());
    } else {
      const fin = obtenerFinConHora();

      url.searchParams.set(
        "startdt",
        `${calendario.fechaInicio}T${calendario.horaInicio}:00`,
      );

      url.searchParams.set("enddt", `${fin.fecha}T${fin.hora}:00`);
    }

    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  return createPortal(
    <div className="save-modal-backdrop" onClick={onCerrar}>
      <section
        className="save-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="save-modal-close"
          onClick={onCerrar}
          aria-label="Cerrar modal"
        >
          ×
        </button>

        <header className="save-modal-header">
          <h2 id="save-modal-title">Guardar evento</h2>
          <p>{calendario.titulo}</p>
        </header>

        <div className="save-modal-resume">
          <div className="save-modal-resume-item">
            <CalendarDays size={20} strokeWidth={2.2} />
            <span>{obtenerTextoFecha()}</span>
          </div>

          <div className="save-modal-resume-item">
            <Clock4 size={20} strokeWidth={2.2} />
            <span>{obtenerTextoHora()}</span>
          </div>
        </div>

        <div className="save-modal-options">
          <button type="button" onClick={abrirGoogleCalendar}>
            <FaGoogle size={30} />
            <span>Guardar en calendario de Google</span>
          </button>

          <button type="button" onClick={abrirMicrosoftCalendar}>
            <FaMicrosoft size={30} />
            <span>Guardar en calendario de Microsoft</span>
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

export default SaveModal;
