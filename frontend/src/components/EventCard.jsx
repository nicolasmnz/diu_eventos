import { Share2, Bookmark } from "lucide-react";

import "./EventCard.css";

function EventCard({
  img,
  title,
  date,
  hora,
  ubication,
  modalidad,
  mainTheme,
}) {
  /**
   * Obtiene el nombre corto del mes a partir de una fecha en formato "d/m/yyyy".
   *
   * @param {string} fecha - Fecha en formato "día/mes/año", por ejemplo "27/5/2026".
   * @returns {string} Nombre corto del mes, por ejemplo "may".
   */
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

    const partes = fecha.split("-");
    const mes = Number(partes[1]);

    return meses[mes];
  }

  function extraer_dia(fecha) {
    const partes = fecha.split("-");
    return partes[0];
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

  return (
    <article className="card">
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
            aria-label="Compartir evento"
          >
            <Share2 size={20} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            className="card-action-button"
            aria-label="Guardar evento"
          >
            <Bookmark size={20} strokeWidth={2.2} />
          </button>
        </div>
      </footer>
    </article>
  );
}

export default EventCard;
