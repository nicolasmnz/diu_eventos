import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Share2, Bookmark } from "lucide-react";

import ShareModal from "./ShareModal";
import SaveModal from "./SaveModal";

import "./EventCard.css";

function EventCard({
  id,
  img,
  title,
  date,
  hora,
  ubication,
  modalidad,
  mainTheme,
}) {
  function obtenerPartesFecha(fecha) {
    if (!fecha) {
      return {
        year: "",
        month: "",
        day: "",
      };
    }

    const partes = fecha.split("-");

    if (partes[0].length === 4) {
      const [year, month, day] = partes;
      return { year, month, day };
    }

    const [day, month, year] = partes;
    return { year, month, day };
  }

  function extraer_mes_corto(fecha) {
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

  function extraer_dia(fecha) {
    const { day } = obtenerPartesFecha(fecha);
    return day;
  }

  const [modalCompartirAbierto, setModalCompartirAbierto] = useState(false);
  const [modalGuardarAbierto, setModalGuardarAbierto] = useState(false);

  const urlCompartir = `${window.location.origin}/eventos/${title
    .toLowerCase()
    .replaceAll(" ", "-")}`;

  const navigate = useNavigate();

  function obtenerClaseTitulo(title) {
    if (title.length > 70) {
      return "card-title card-title-small";
    }

    if (title.length > 45) {
      return "card-title card-title-medium";
    }

    return "card-title";
  }
  return (
    <article className="card" onClick={() => navigate(`/eventos/${id}`)}>
      <img src={img} className="card-img-top" />
      <time className="card-short-date">
        <span className="month">{extraer_mes_corto(date)}</span>
        <span className="day">{extraer_dia(date)}</span>
      </time>
      <div className="widget">
        <span>{ubication}</span>
        <span>{modalidad}</span>
      </div>
      <div className="theme-chip">
        <span>{mainTheme}</span>
      </div>
      <section className="card-body">
        <h3 className={obtenerClaseTitulo(title)}>{title}</h3>
        <p className="hour">{hora}</p>
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
        titulo={title}
        url={urlCompartir}
      />
      <SaveModal
        abierto={modalGuardarAbierto}
        onCerrar={() => setModalGuardarAbierto(false)}
        titulo={title}
        fechaInicio={date}
        ubicacion={ubication}
      />
    </article>
  );
}

export default EventCard;
