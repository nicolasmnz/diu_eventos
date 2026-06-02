import { useEffect } from "react";
import { createPortal } from "react-dom";

import { FaGoogle, FaMicrosoft } from "react-icons/fa";

import "./SaveModal.css";

function SaveModal({ abierto, onCerrar, titulo, fechaInicio, ubicacion }) {
  //incluir  horaInicio, horaTermino, fechaTermino
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

  if (!abierto) return null;

  function formatearFechaGoogle(fecha) {
    // si viene "26-05-2026"
    const [day, month, year] = fecha.split("-");
    return `${year}${month}${day}`;
  }

  function abrirGoogleCalendar() {
    const fecha = formatearFechaGoogle(fechaInicio);

    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", titulo);
    url.searchParams.set("dates", `${fecha}/${fecha}`);
    url.searchParams.set("location", ubicacion);

    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  function abrirMicrosoftCalendar() {
    const [day, month, year] = fechaInicio.split("-");
    const fechaISO = `${year}-${month}-${day}`;

    const url = new URL(
      "https://outlook.office.com/calendar/0/deeplink/compose",
    );
    url.searchParams.set("subject", titulo);
    url.searchParams.set("startdt", fechaISO);
    url.searchParams.set("enddt", fechaISO);
    url.searchParams.set("location", ubicacion);

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
          <p>{titulo}</p>
        </header>
        <div className="save-modal-options">
          <button type="button" onClick={abrirGoogleCalendar}>
            <FaGoogle size={30} strokeWidth={2.2} />
            <span>Guardar en calendario de Google</span>
          </button>
          <button type="button" onClick={abrirMicrosoftCalendar}>
            <FaMicrosoft size={30} strokeWidth={2.2} />
            <span>Guardar en calendario de Microsoft</span>
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

export default SaveModal;
