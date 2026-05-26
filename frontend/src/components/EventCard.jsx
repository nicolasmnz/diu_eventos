import "./EventCard.css";

function EventCard({ img, title, date, ubication, modalidad }) {
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
      <section className="card-body">
        <h3 className="card-title">{title}</h3>
        <button className="card-button" type="button">
          Más detalles
        </button>
      </section>

      <hr className="card-separator" />

      <footer className="card-footer">
        <p>
          <strong>Fecha del evento:</strong> {obtenerFecha()}
        </p>
      </footer>
    </article>
  );
}

export default EventCard;
