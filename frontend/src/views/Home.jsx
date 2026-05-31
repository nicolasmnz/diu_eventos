import { useEffect, useMemo, useState } from "react";
import DropdownCheckbox from "../components/DropdownCheckbox";
import EventCard from "../components/EventCard";

import "./Home.css";

import bannerEventos from "../assets/banner-eventos.jpg";

function Home() {
  const sedes = [
    "Casa Central Valparaíso",
    "Campus San Joaquín",
    "Campus Vitacura",
    "Sede Viña del Mar",
    "Sede Concepción",
    "Externo",
  ];

  const tipos = ["Presencial", "Online", "Híbrido"];

  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [sedesSeleccionadas, setSedesSeleccionadas] = useState(sedes);
  const [tiposSeleccionados, setTiposSeleccionados] = useState(tipos);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        setCargando(true);
        setError("");

        const response = await fetch("http://localhost:5000/eventos");

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("El backend no devolvió un arreglo de eventos");
        }

        setEventos(data);
      } catch (error) {
        console.error("No fue posible cargar los eventos:", error);
        setError("No fue posible cargar los eventos.");
      } finally {
        setCargando(false);
      }
    };

    cargarEventos();
  }, []);

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      const coincideModalidad = tiposSeleccionados.includes(evento.modalidad);

      const coincideUbicacion =
        evento.ubicaciones.includes("Todos") ||
        evento.ubicaciones.includes("Online") ||
        evento.ubicaciones.some((ubicacion) =>
          sedesSeleccionadas.includes(ubicacion)
        );

      return coincideModalidad && coincideUbicacion;
    });
}, [eventos, sedesSeleccionadas, tiposSeleccionados]);

  return (
    <>
      <section className="banner-eventos">
        <img src={bannerEventos} alt="Banner" className="banner-eventos-img" />

        <div className="banner-eventos-content">
          <span className="barra-amarilla"></span>
          <h1>Eventos</h1>
        </div>
      </section>

      <section className="filtros-eventos" aria-label="Filtros de eventos">
        <DropdownCheckbox
          titulo="Ubicación"
          etiquetaCantidad="ubicaciones"
          etiquetaTodos="Todos los emplazamientos"
          opciones={sedes}
          seleccionados={sedesSeleccionadas}
          setSeleccionados={setSedesSeleccionadas}
        />

        <DropdownCheckbox
          titulo="Tipo de modalidad"
          etiquetaCantidad="modalidades"
          etiquetaTodos="Todas las modalidades"
          opciones={tipos}
          seleccionados={tiposSeleccionados}
          setSeleccionados={setTiposSeleccionados}
        />
      </section>

      <main className="eventos-main">
        {cargando && <p>Cargando eventos...</p>}

        {error && <p>{error}</p>}

        {!cargando && !error && eventosFiltrados.length === 0 && (
          <p>No existen eventos que coincidan con los filtros seleccionados.</p>
        )}

        <section className="eventos-grid">
          {eventosFiltrados.map((evento) => (
            <EventCard
              key={evento.id}
              img={evento.imagen}
              title={evento.nombre}
              date={evento.fechaInicio}
              hora={evento.horaInicio ?? ""}
              ubication={evento.ubicaciones.join(", ")}
              modalidad={evento.modalidad}
              mainTheme={evento.tematicas.join(", ")}
            />
          ))}
        </section>
      </main>
    </>
  );
}

export default Home;