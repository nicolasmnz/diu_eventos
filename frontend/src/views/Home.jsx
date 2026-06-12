import { useEffect, useMemo, useState } from "react";

import { BadgeAlert, BadgeX } from "lucide-react";

import EventCard from "../components/EventCard.jsx";
import Header from "../components/Header.jsx";
import MiniCalendar from "../components/MiniCalendar.jsx";
import StickyFilters from "../components/StickyFilters.jsx";
import Footer from "../components/Footer.jsx";

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

  const [sedesSeleccionadas, setSedesSeleccionadas] = useState([]);
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [tematicaSeleccionados, setTematicaSeleccionados] = useState([]);

  const [homeStateListo, setHomeStateListo] = useState(false);
  const [homeRestaurado, setHomeRestaurado] = useState(false);

  const sedes = useMemo(
    () =>
      obtenerUnicos(
        eventos
          .flatMap((evento) => evento.ubicaciones ?? [])
          .filter((ubicacion) => ubicacion !== "Todos"),
      ),
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

  useEffect(() => {
    async function cargarEventos() {
      try {
        const API_URL = `http://${window.location.hostname}:5000`;
        const respuesta = await fetch(`${API_URL}/eventos`);

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

  /*
    Restaura los filtros y la posición del scroll cuando el usuario
    vuelve desde el detalle de un evento.
  */
  useEffect(() => {
    if (eventos.length === 0) {
      return;
    }

    const debeRestaurar =
      sessionStorage.getItem("restaurarHomeEventos") === "true";

    const estadoGuardado = sessionStorage.getItem("homeEventosState");

    if (debeRestaurar && estadoGuardado) {
      try {
        const estado = JSON.parse(estadoGuardado);

        setBusqueda(estado.busqueda ?? "");
        setFechaSeleccionada(estado.fechaSeleccionada ?? null);

        setSedesSeleccionadas(estado.sedesSeleccionadas ?? sedes);
        setTiposSeleccionados(estado.tiposSeleccionados ?? tipos);
        setTematicaSeleccionados(estado.tematicaSeleccionados ?? tematicas);

        setHomeRestaurado(true);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, estado.scrollY ?? 0);
          });
        });
      } catch {
        sessionStorage.removeItem("homeEventosState");
      }

      sessionStorage.removeItem("restaurarHomeEventos");
    } else {
      setSedesSeleccionadas(sedes);
      setTiposSeleccionados(tipos);
      setTematicaSeleccionados(tematicas);
    }

    setHomeStateListo(true);
  }, [eventos.length, sedes, tipos, tematicas]);

  /*
    Guarda automáticamente el estado actual mientras el usuario
    permanece en la página.
  */
  useEffect(() => {
    if (!homeStateListo) {
      return;
    }

    function guardarEstado() {
      sessionStorage.setItem(
        "homeEventosState",
        JSON.stringify({
          busqueda,
          fechaSeleccionada,
          sedesSeleccionadas,
          tiposSeleccionados,
          tematicaSeleccionados,
          scrollY: window.scrollY,
        }),
      );
    }

    window.addEventListener("scroll", guardarEstado);

    guardarEstado();

    return () => {
      window.removeEventListener("scroll", guardarEstado);
    };
  }, [
    homeStateListo,
    busqueda,
    fechaSeleccionada,
    sedesSeleccionadas,
    tiposSeleccionados,
    tematicaSeleccionados,
  ]);

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

  function guardarEstadoHome() {
    sessionStorage.setItem("restaurarHomeEventos", "true");

    sessionStorage.setItem(
      "homeEventosState",
      JSON.stringify({
        busqueda,
        fechaSeleccionada,
        sedesSeleccionadas,
        tiposSeleccionados,
        tematicaSeleccionados,
        scrollY: window.scrollY,
      }),
    );
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
              mostrarSeleccionRestaurada={homeRestaurado}
            />
          </div>

          <div className="mini-calendar">
            <MiniCalendar
              fechaSeleccionada={fechaSeleccionada}
              setFechaSeleccionada={setFechaSeleccionada}
            />
          </div>
        </div>
      </section>

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
          <>
            <section className="eventos-grid">
              {eventosFiltrados.map((evento) => (
                <div key={evento.id} className="event-snap-panel">
                  <EventCard
                    evento={evento}
                    onAntesAbrirDetalle={guardarEstadoHome}
                  />
                </div>
              ))}
            </section>

            <div className="home-footer-snap">
              <Footer />
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Home;
