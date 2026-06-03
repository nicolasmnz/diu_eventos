import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, Bookmark } from "lucide-react";

import ShareModal from "./ShareModal";
import SaveModal from "./SaveModal";

import "./EventCard.css";

function EventCard({ evento, onAntesAbrirDetalle }) {
  const navigate = useNavigate();

  const [modalCompartirAbierto, setModalCompartirAbierto] = useState(false);
  const [modalGuardarAbierto, setModalGuardarAbierto] = useState(false);

  const calendario = evento.calendario;
  function obtenerPartesFecha(fecha) {
    if (!fecha) {
      return { year: "", month: "", day: "" };
    }

    const [year, month, day] = fecha.split("-");
    return { year, month, day };
  }

  function extraerMesCorto(fecha) {
    const meses = {
      1: "ene",
      2: "feb",
      3: "mar",
      4: "abr",
      5: "may",
      6: "jun",
      7: "jul",
      8: "ago",
      9: "sep",
      10: "oct",
      11: "nov",
      12: "dic",
    };

    const { month } = obtenerPartesFecha(fecha);
    return meses[Number(month)] ?? "";
  }

  function extraerDia(fecha) {
    const { day } = obtenerPartesFecha(fecha);
    return day;
  }

  function obtenerClaseTitulo(title) {
    if (title.length > 70) {
      return "card-title card-title-small";
    }

    if (title.length > 45) {
      return "card-title card-title-medium";
    }

    return "card-title";
  }

  function obtenerTextoHora() {
    if (calendario?.todoElDia) {
      return "Todo el día";
    }

    if (calendario?.horaInicio && calendario?.horaTermino) {
      return `${calendario.horaInicio} - ${calendario.horaTermino}`;
    }

    if (calendario?.horaInicio) {
      return calendario.horaInicio;
    }

    return "Por confirmar";
  }

  const urlCompartir = `${window.location.origin}/eventos/${evento.slug}`;

  return (
    <article
      className="card"
      onClick={() => {
        onAntesAbrirDetalle?.();
        navigate(`/eventos/${evento.slug}`);
      }}
    >
      <img src={evento.imagen} className="card-img-top" alt={evento.nombre} />

      <time className="card-short-date" dateTime={calendario.fechaInicio}>
        <span className="month">{extraerMesCorto(calendario.fechaInicio)}</span>
        <span className="day">{extraerDia(calendario.fechaInicio)}</span>
      </time>

      <div className="widget">
        <span>{evento.ubicaciones?.[0] ?? "Sin ubicación"}</span>
        <span>{evento.modalidad}</span>
      </div>

      <div className="theme-chip">
        <span>{evento.tematicas?.[0] ?? "General"}</span>
      </div>

      <section className="card-body">
        <h3 className={obtenerClaseTitulo(evento.nombre)}>{evento.nombre}</h3>
        <p className="hour">{obtenerTextoHora()}</p>
      </section>

      <hr className="card-separator" />

      <footer className="card-footer">
        <div className="card-actions">
          <button
            type="button"
            className="card-action-button"
            onClick={(event) => {
              event.stopPropagation();
              setModalCompartirAbierto(true);
            }}
            aria-label="Compartir evento"
          >
            <Share2 size={20} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            className="card-action-button"
            onClick={(event) => {
              event.stopPropagation();
              setModalGuardarAbierto(true);
            }}
            aria-label="Guardar evento"
          >
            <Bookmark size={20} strokeWidth={2.2} />
          </button>
        </div>
      </footer>

      <ShareModal
        abierto={modalCompartirAbierto}
        onCerrar={() => setModalCompartirAbierto(false)}
        titulo={evento.nombre}
        url={urlCompartir}
      />

      <SaveModal
        abierto={modalGuardarAbierto}
        onCerrar={() => setModalGuardarAbierto(false)}
        calendario={calendario}
      />
    </article>
  );
}

export default EventCard;
