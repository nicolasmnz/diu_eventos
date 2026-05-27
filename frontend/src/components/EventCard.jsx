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
  function obtenerFecha() {
    if (Array.isArray(date) && date.length === 2) {
      const [desde, hasta] = date;
      return `${desde} — ${hasta}`;
    }
    return `${date}`;
  }
  return (
    <article className="card">
      <img src={img} className="card-img-top" />
      <div className="widget">
        <span>{ubication}</span>
        <span>{modalidad}</span>
      </div>
      <div className="theme-chip">
        <span>{mainTheme}</span>
      </div>
      <section className="card-body">
        <h3 className="card-title">{title}</h3>
      </section>

      <hr className="card-separator" />

      <footer className="card-footer">
        <p>
          <strong>Fecha del evento:</strong> {obtenerFecha()}
        </p>
        <p>
          <strong>Hora del evento:</strong> {hora}
        </p>
      </footer>
    </article>
  );
}

export default EventCard;
