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
  const { id } = useParams();

  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [modalCompartirAbierto, setModalCompartirAbierto] = useState(false);
  const [modalGuardarAbierto, setModalGuardarAbierto] = useState(false);

  useEffect(() => {
    async function cargarEvento() {
      try {
        const respuesta = await fetch(`http://localhost:5000/eventos/${id}`);

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
  }, [id]);

  if (cargando) return <p>Cargando evento...</p>;
  if (error) return <p>{error}</p>;
  if (!evento) return <p>Evento no encontrado.</p>;

  const urlCompartir = `${window.location.origin}/eventos/${evento.id}`;

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
              <span>Wednesday, June 3, 2026</span>
            </div>

            <div className="event-detail-item">
              <Clock4 size={22} strokeWidth={2.2} />
              <span>11:00 AM</span>
            </div>

            <div className="event-detail-item">
              <MapPin size={22} strokeWidth={2.2} />
              <span>Sala A16</span>
            </div>

            <div className="event-detail-item">
              <Users size={22} strokeWidth={2.2} />
              <div>
                <strong>Evento abierto a:</strong>
                <p>Estudiantes, Profesores, Funcionarios, Alumni</p>
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
            titulo={evento.nombre}
            fechaInicio={evento.fechaInicio}
            ubicacion={
              evento.ubicaciones?.join(", ") ?? evento.lugar ?? "Sin ubicación"
            }
          />
        </section>
      </main>
    </>
  );
}

export default EventDetails;
