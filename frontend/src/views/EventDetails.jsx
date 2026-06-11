import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronRight,
  Share2,
  Bookmark,
  CalendarDays,
  Clock4,
  MapPin,
  Users,
} from "lucide-react";

import Header from "../components/Header.jsx";
import ShareModal from "../components/ShareModal";
import SaveModal from "../components/SaveModal";

import "./EventDetails.css";

function EventDetails() {
  const { slug } = useParams();

  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [modalCompartirAbierto, setModalCompartirAbierto] = useState(false);
  const [modalGuardarAbierto, setModalGuardarAbierto] = useState(false);

  function formatearFechaVista(fecha) {
    if (!fecha) return "Fecha por confirmar";

    return new Intl.DateTimeFormat("es-CL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: calendario.zonaHoraria ?? "America/Santiago",
    }).format(new Date(`${fecha}T12:00:00`));
  }

  function obtenerTextoFecha() {
    if (calendario.fechaInicio === calendario.fechaTermino) {
      return formatearFechaVista(calendario.fechaInicio);
    }

    return `${formatearFechaVista(calendario.fechaInicio)} - ${formatearFechaVista(
      calendario.fechaTermino,
    )}`;
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

  useEffect(() => {
    async function cargarEvento() {
      try {
        const respuesta = await fetch(`http://10.66.133.116:5000/eventos/${slug}`);

        if (!respuesta.ok) {
          throw new Error("No se pudo cargar el evento.");
        }

        const data = await respuesta.json();
        setEvento(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarEvento();
  }, [slug]);

  if (cargando) return <p>Cargando evento...</p>;
  if (error) return <p>{error}</p>;
  if (!evento) return <p>Evento no encontrado.</p>;

  const calendario = evento.calendario;
  const urlCompartir = `${window.location.origin}${evento.ruta}`;

  return (
    <>
      <Header />
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <ol className="breadcrumbs-list">
          <li className="breadcrumbs-item">
            <a href="/">Eventos USM</a>
          </li>

          <li className="breadcrumbs-separator" aria-hidden="true">
            <ChevronRight size={18} strokeWidth={2.4} />
          </li>

          <li className="breadcrumbs-item breadcrumbs-current">
            {evento.nombre}
          </li>
        </ol>
      </nav>

      <main className="event-detail-page">
        <section className="event-hero">
          <div className="event-hero-inner">
            <aside className="event-summary-card">
              <img src={evento.imagen} alt={evento.nombre} />
            </aside>

            <header className="event-title-block">
              <p className="event-category">{evento.tematicas?.[0]}</p>
              <h1>{evento.nombre}</h1>
              <div className="event-tags-group">
                <div className="event-ubications-row">
                  {(evento.lugar ?? []).map((ubicacion) => (
                    <span key={ubicacion} className="event-ubication">
                      {ubicacion}
                    </span>
                  ))}
                </div>

                <div className="event-modalidad-row">
                  <span className="event-modalidad">{evento.modalidad}</span>
                </div>
              </div>
            </header>
          </div>
        </section>

        <section className="event-content">
          <aside className="event-details">
            <div className="event-detail-item">
              <CalendarDays size={22} strokeWidth={2.2} />
              <span>{obtenerTextoFecha()}</span>
            </div>

            <div className="event-detail-item">
              <Clock4 size={22} strokeWidth={2.2} />
              <span>{obtenerTextoHora()}</span>
            </div>

            <div className="event-detail-item">
              <MapPin size={22} strokeWidth={2.2} />
              <span>{calendario.ubicacion}</span>
            </div>

            <div className="event-detail-item">
              <Users size={22} strokeWidth={2.2} />
              <div>
                <strong>Evento abierto a:</strong>
                <p>{evento.publicoObjetivo}</p>
              </div>
            </div>
          </aside>
          <article className="event-description">
            <h2>Detalles del evento</h2>
            <p>{evento.descripcion}</p>
          </article>

          <aside className="event-actions">
            <button
              type="button"
              className="event-action-button"
              onClick={() => setModalGuardarAbierto(true)}
              aria-label="Guardar evento"
            >
              <Bookmark size={20} strokeWidth={2.2} />
              <span>Guardar</span>
            </button>

            <button
              type="button"
              className="event-action-button event-action-button-secondary"
              onClick={() => setModalCompartirAbierto(true)}
              aria-label="Compartir evento"
            >
              <Share2 size={20} strokeWidth={2.2} />
              <span>Compartir</span>
            </button>
          </aside>
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
        </section>
      </main>
    </>
  );
}

export default EventDetails;
