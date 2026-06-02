import { useEffect, useMemo, useState } from "react";

import { BadgeX, BadgeAlert } from "lucide-react";

import EventCard from "../components/EventCard.jsx";
import Header from "../components/Header.jsx";
import MiniCalendar from "../components/MiniCalendar.jsx";
import StickyFilters from "../components/StickyFilters.jsx";

import "./Home.css";

import bannerEventos from "../assets/banner-eventos.jpg";

function obtenerUnicos(lista) {
  return [...new Set(lista.filter(Boolean))].sort();
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function fechaEstaEnRango(fechaSeleccionada, fechaInicio, fechaTermino) {
  if (!fechaSeleccionada) {
    return true;
  }

  const termino = fechaTermino || fechaInicio;

  return fechaSeleccionada >= fechaInicio && fechaSeleccionada <= termino;
}

function Home() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const sedes = useMemo(
    () => obtenerUnicos(eventos.flatMap((evento) => evento.ubicaciones ?? [])),
    [eventos],
  );

  const tipos = useMemo(
    () => obtenerUnicos(eventos.map((evento) => evento.modalidad)),
    [eventos],
  );

  const tematicas = useMemo(
    () => obtenerUnicos(eventos.flatMap((evento) => evento.tematicas ?? [])),
    [eventos],
  );

  const [sedesSeleccionadas, setSedesSeleccionadas] = useState([]);
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [tematicaSeleccionados, setTematicaSeleccionados] = useState([]);

  useEffect(() => {
    async function cargarEventos() {
      try {
        const respuesta = await fetch("http://localhost:5000/eventos");

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los eventos.");
        }

        const data = await respuesta.json();
        setEventos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarEventos();
  }, []);

  useEffect(() => {
    if (eventos.length === 0) {
      return;
    }

    setSedesSeleccionadas(sedes);
    setTiposSeleccionados(tipos);
    setTematicaSeleccionados(tematicas);
  }, [eventos, sedes, tipos, tematicas]);

  const eventosFiltrados = eventos.filter((evento) => {
    const textoEvento = normalizarTexto(`
    ${evento.nombre}
    ${evento.descripcion}
    ${evento.lugar ?? ""}
    ${evento.modalidad}
    ${(evento.ubicaciones ?? []).join(" ")}
    ${(evento.tematicas ?? []).join(" ")}
  `);

    const coincideBusqueda = textoEvento.includes(normalizarTexto(busqueda));

    const coincideSede =
      (evento.ubicaciones ?? []).includes("Todos") ||
      (evento.ubicaciones ?? []).some((ubicacion) =>
        sedesSeleccionadas.includes(ubicacion),
      );

    const coincideModalidad = tiposSeleccionados.includes(evento.modalidad);

    const coincideTematica = (evento.tematicas ?? []).some((tematica) =>
      tematicaSeleccionados.includes(tematica),
    );

    const coincideFecha = fechaEstaEnRango(
      fechaSeleccionada,
      evento.fechaInicio,
      evento.fechaTermino,
    );

    return (
      coincideBusqueda &&
      coincideSede &&
      coincideModalidad &&
      coincideTematica &&
      coincideFecha
    );
  });

  function limpiarFiltros() {
    setBusqueda("");
    setFechaSeleccionada(null);

    setSedesSeleccionadas(sedes);
    setTiposSeleccionados(tipos);
    setTematicaSeleccionados(tematicas);
  }
  return (
    <>
      <Header />

      <section className="banner-eventos">
        <img src={bannerEventos} alt="Banner" className="banner-eventos-img" />

        <div className="banner-tools">
          <div className="banner-left-tools">
            <form
              className="banner-search"
              role="search"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="search-box">
                <input
                  id="buscar-eventos"
                  type="search"
                  placeholder="Buscar por nombre, temática, campus o modalidad"
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                />

                <button type="submit">Buscar</button>
              </div>
            </form>
          </div>

          <div className="mini-calendar">
            <MiniCalendar
              fechaSeleccionada={fechaSeleccionada}
              setFechaSeleccionada={setFechaSeleccionada}
            />
          </div>
        </div>
      </section>

      <StickyFilters
        sedes={sedes}
        tipos={tipos}
        tematicas={tematicas}
        sedesSeleccionadas={sedesSeleccionadas}
        setSedesSeleccionadas={setSedesSeleccionadas}
        tiposSeleccionados={tiposSeleccionados}
        setTiposSeleccionados={setTiposSeleccionados}
        tematicasSeleccionadas={tematicaSeleccionados}
        setTematicasSeleccionadas={setTematicaSeleccionados}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
        onLimpiarFiltros={limpiarFiltros}
      />

      <main className="eventos-main">
        {cargando && (
          <section className="event-status">
            <p>Cargando eventos...</p>
          </section>
        )}

        {error && (
          <section className="event-status event-status-error">
            <BadgeX size={42} strokeWidth={2.2} />
            <h2>No se pudieron cargar los eventos</h2>
            <p>{error}</p>
          </section>
        )}

        {!cargando && !error && eventosFiltrados.length === 0 && (
          <section className="event-status event-status-empty">
            <BadgeAlert size={42} strokeWidth={2.2} />
            <h2>No hay eventos disponibles</h2>
            <p>
              No existen eventos que coincidan con los filtros seleccionados.
            </p>
          </section>
        )}

        {!cargando && !error && eventosFiltrados.length > 0 && (
          <section className="eventos-grid">
            {eventosFiltrados.map((evento) => (
              <EventCard
                key={evento.id}
                id={evento.id}
                img={evento.imagen}
                title={evento.nombre}
                date={evento.fechaInicio}
                hora={evento.horaInicio ?? "Por confirmar"}
                ubication={evento.ubicaciones?.[0] ?? "Sin ubicación"}
                modalidad={evento.modalidad}
                mainTheme={evento.tematicas?.[0] ?? "General"}
              />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default Home;
